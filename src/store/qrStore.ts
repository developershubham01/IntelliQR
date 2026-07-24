import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QRType, QRData, QRStyle, QRCodeItem } from "@/types/qr";
import { DEFAULT_QR_STYLE } from "@/types/qr";
import { generateQRContent, generateQRCode, generateId } from "@/lib/qr-generator";
import { toast } from "sonner";

interface QRStore {
  // Current QR being edited
  currentQR: QRCodeItem | null;
  selectedType: QRType;
  formData: QRData;
  style: QRStyle;
  isDynamic: boolean;
  isGenerating: boolean;
  generatedAt: Date | null;

  // History
  history: QRCodeItem[];

  // Guest limiting
  anonymousGenerations: number[];
  isAuthenticated: boolean;

  // Actions
  setStoreAuth: (auth: boolean) => void;
  setSelectedType: (type: QRType) => void;
  setFormData: (data: QRData) => void;
  updateFormField: (name: string, value: string) => void;
  setStyle: (style: QRStyle) => void;
  updateStyle: (updates: Partial<QRStyle>) => void;
  setIsDynamic: (isDynamic: boolean) => void;
  generateQR: () => Promise<void>;
  addToHistory: (item: QRCodeItem) => void;
  removeFromHistory: (id: string) => void;
  toggleFavorite: (id: string) => void;
  duplicateQR: (id: string) => void;
  renameQR: (id: string, name: string) => void;
  loadQR: (item: QRCodeItem) => void;
  reset: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  getFilteredHistory: () => QRCodeItem[];

  // Stats
  getStats: () => { totalGenerated: number; totalDownloads: number; totalFavorites: number };
}

export const useQRStore = create<QRStore>()(
  persist(
    (set, get) => ({
      currentQR: null,
      selectedType: "website",
      formData: {},
      style: { ...DEFAULT_QR_STYLE },
      isDynamic: false,
      isGenerating: false,
      generatedAt: null,
      history: [],
      searchQuery: "",
      anonymousGenerations: [],
      isAuthenticated: false,

      setStoreAuth: (isAuthenticated) => set({ isAuthenticated }),

      setSelectedType: (type) =>
        set({ selectedType: type, formData: {}, currentQR: null, generatedAt: null }),

      setFormData: (data) => set({ formData: data }),

      updateFormField: (name, value) =>
        set((state) => ({
          formData: { ...state.formData, [name]: value },
        })),

      setStyle: (style) => set({ style }),

      updateStyle: (updates) =>
        set((state) => ({
          style: { ...state.style, ...updates },
        })),

      setIsDynamic: (isDynamic) => set({ isDynamic }),

      generateQR: async () => {
        const state = get();
        const isAuthenticated = state.isAuthenticated;
        const content = generateQRContent(state.selectedType, state.formData);
        if (!content) return;

        // Apply rate limit for unauthenticated users
        if (!isAuthenticated) {
          const now = Date.now();
          const oneDayAgo = now - 24 * 60 * 60 * 1000;
          const recentGenerations = (state.anonymousGenerations || []).filter((t) => t > oneDayAgo);

          if (recentGenerations.length >= 5) {
            toast.error(
              "You have reached the free limit of 5 QR codes per day. Sign up for a free account to get unlimited generations!",
              {
                duration: 6000,
                action: {
                  label: "Sign Up / Log In",
                  onClick: () => {
                    window.location.href = "/login";
                  },
                },
              }
            );
            return;
          }

          set({
            anonymousGenerations: [...recentGenerations, now],
          });
        }

        set({ isGenerating: true });

        try {
          let finalContent = content;
          let shortId: string | undefined;

          if (state.isDynamic) {
            if (!isAuthenticated) {
              toast.error("Dynamic QR codes require a free account. Please log in or sign up first!", {
                action: {
                  label: "Log In",
                  onClick: () => {
                    window.location.href = "/login";
                  },
                },
              });
              set({ isGenerating: false });
              return;
            }

            const res = await fetch("/api/trpc/qr.create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: `${state.selectedType.charAt(0).toUpperCase() + state.selectedType.slice(1)} QR`,
                type: state.selectedType,
                content: content,
                data: state.formData,
                style: state.style,
                isDynamic: true,
              }),
            });
            const json = await res.json();
            if (json.result?.data?.shortId) {
              shortId = json.result.data.shortId;
              finalContent = `${window.location.origin}/r/${shortId}`;
            }
          }

          const { dataUrl, svgContent } = await generateQRCode(finalContent, state.style);

          const newQR: QRCodeItem = {
            id: generateId(),
            name: `${state.selectedType.charAt(0).toUpperCase() + state.selectedType.slice(1)} QR`,
            type: state.selectedType,
            content,
            data: { ...state.formData },
            style: { ...state.style },
            imageUrl: dataUrl,
            svgContent,
            isFavorite: false,
            isDynamic: state.isDynamic,
            shortId,
            scanCount: 0,
            downloadCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set({
            currentQR: newQR,
            isGenerating: false,
            generatedAt: new Date(),
            history: [newQR, ...state.history].slice(0, 100),
          });
        } catch (e) {
          console.error("QR Generation Failed:", e);
          set({ isGenerating: false });
        }
      },

      addToHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 100),
        })),

      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
          currentQR: state.currentQR?.id === id ? null : state.currentQR,
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          history: state.history.map((item) =>
            item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
          ),
          currentQR:
            state.currentQR?.id === id
              ? { ...state.currentQR, isFavorite: !state.currentQR.isFavorite }
              : state.currentQR,
        })),

      duplicateQR: (id) => {
        const state = get();
        const item = state.history.find((h) => h.id === id);
        if (!item) return;

        const duplicated: QRCodeItem = {
          ...item,
          id: generateId(),
          name: `${item.name} (Copy)`,
          isFavorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set({
          history: [duplicated, ...state.history],
          currentQR: duplicated,
          selectedType: duplicated.type,
          formData: { ...duplicated.data },
          style: { ...duplicated.style },
        });
      },

      renameQR: (id, name) =>
        set((state) => ({
          history: state.history.map((item) =>
            item.id === id ? { ...item, name } : item
          ),
          currentQR:
            state.currentQR?.id === id
              ? { ...state.currentQR, name }
              : state.currentQR,
        })),

      loadQR: (item) =>
        set({
          currentQR: item,
          selectedType: item.type,
          formData: { ...item.data },
          style: { ...item.style },
        }),

      reset: () =>
        set({
          currentQR: null,
          selectedType: "website",
          formData: {},
          style: { ...DEFAULT_QR_STYLE },
          isGenerating: false,
          generatedAt: null,
        }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      getFilteredHistory: () => {
        const state = get();
        if (!state.searchQuery) return state.history;
        const q = state.searchQuery.toLowerCase();
        return state.history.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.type.toLowerCase().includes(q) ||
            item.content.toLowerCase().includes(q)
        );
      },

      getStats: () => {
        const state = get();
        return {
          totalGenerated: state.history.length,
          totalDownloads: state.history.reduce((sum, item) => sum + item.downloadCount, 0),
          totalFavorites: state.history.filter((item) => item.isFavorite).length,
        };
      },
    }),
    {
      name: "qrify-store",
      partialize: (state) => ({
        history: state.history,
        style: state.style,
        anonymousGenerations: state.anonymousGenerations,
      }),
    }
  )
);
