import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import path from 'path';
import Core from './src/core.js';

const pipelineAsync = promisify(pipeline);

export default async function lk21dl(url: string, outputPath: string = './downloads/test.mp4'): Promise<string> {
  const core = new Core();
  try {
    // Pastikan folder untuk menampung output download sudah ada
    const dir = path.dirname(outputPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    console.log('Starting download...');
    const videoStream = await core.download(url);
    const writeStream = createWriteStream(outputPath);
    
    await pipelineAsync(videoStream, writeStream);
    return outputPath;
  } catch (error) {
    throw new Error(`Download failed: ${(error as Error).message}`);
  }
}
