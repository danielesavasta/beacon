import fs from 'node:fs';
import path from 'node:path';

const MEDIA_EXT = /\.(png|jpe?g|webp|gif|mp4|webm|mov)$/i;

export function hasProjectMedia(group: string | undefined): boolean {
  if (!group) return false;
  const dir = path.join(process.cwd(), 'public', 'projects', group);
  if (!fs.existsSync(dir)) return false;
  return fs.readdirSync(dir).some((f: string) => MEDIA_EXT.test(f));
}
