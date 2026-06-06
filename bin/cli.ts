#!/usr/bin/env node

import Core from '../src/core.js';
import * as fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

const args = process.argv.slice(2);
const showBanner = () => {
  console.log('\x1b[35m%s\x1b[0m', '            LK21DL-CORE CLI v1.0.0                 ');
  console.log('\x1b[35m%s\x1b[0m', '      Movie Downloader Engine By @Dimzxzzx07        ');
};

const showHelp = () => {
  showBanner();
  console.log('\x1b[33m%s\x1b[0m', 'Usage:');
  console.log('  lk21dl <url-film-lk21> [option]\n');
  console.log('\x1b[33m%s\x1b[0m', 'Option:');
  console.log('  -o, --output <path>   Specify the location and name of the output .mp4 file (Default: ./lk21.mp4)');
  console.log('  -h, --help            Show this help menu');
  console.log('  -v, --version         Show current application version\n');
  console.log('\x1b[33m%s\x1b[0m', 'Command Example:');
  console.log('  lk21dl https://tv21.tips/the-family-plan-2023');
  console.log('  lk21dl https://tv21.tips/the-family-plan-2023 -o ~/Downloads/family-plan.mp4');
};

async function run() {
  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(0);
  }

  if (args.includes('-v') || args.includes('--version')) {
    console.log('lk21dl-core v1.0.0');
    process.exit(0);
  }

  const targetUrl = args[0];
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    console.error('\x1b[31m%s\x1b[0m', 'The URL you entered is invalid! Make sure it starts with http:// or https://');
    process.exit(1);
  }

  let outputPath = path.resolve('./lk21.mp4');
  const outputIndex = args.findIndex(arg => arg === '-o' || arg === '--output');

  if (outputIndex !== -1 && args[outputIndex + 1]) {
    outputPath = path.resolve(args[outputIndex + 1]);
  }

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  showBanner();
  console.log('\x1b[32m%s\x1b[0m', `URL : ${targetUrl}`);
  console.log('\x1b[32m%s\x1b[0m', `File: ${outputPath}\n`);
  try {
    const core = new Core();
    const videoStream = await core.download(targetUrl);
    const writeStream = fs.createWriteStream(outputPath);
    await pipeline(videoStream, writeStream);
    console.log('\x1b[32m%s\x1b[0m', `\nsuccses path on: ${outputPath}`);
    process.exit(0);
  } catch (error: any) {
    console.error('\x1b[31m%s\x1b[0m', `\nerror: ${error.message}`);
    process.exit(1);
  }
}

run();