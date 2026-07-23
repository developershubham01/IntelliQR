import fs from 'fs';
import path from 'path';

if (process.env.VERCEL) {
  const apiDir = path.join(process.cwd(), 'api');
  if (fs.existsSync(apiDir)) {
    const files = fs.readdirSync(apiDir);
    for (const file of files) {
      const fullPath = path.join(apiDir, file);
      if (file === 'index.js') {
        continue;
      }
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(fullPath);
      }
    }
    console.log('Cleaned api/ directory on Vercel, leaving only api/index.js');
  }
} else {
  console.log('Not on Vercel, skipping api/ directory cleanup');
}
