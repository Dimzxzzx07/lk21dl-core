# lk21dl-core

<div align="center">
    <img src="https://img.shields.io/badge/Version-2.1.4-2563eb?style=for-the-badge&logo=typescript" alt="Version">
    <img src="https://img.shields.io/badge/License-MIT-red?style=for-the-badge&logo=mit" alt="License">
    <img src="https://img.shields.io/badge/Node-18%2B-339933?style=for-the-badge&logo=nodedotjs" alt="Node">
    <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/FFmpeg-Merger-FF6B35?style=for-the-badge&logo=ffmpeg" alt="FFmpeg">
</div>

<div align="center">
    <img src="https://img.shields.io/badge/Cheerio-Parsing-FFB443?style=for-the-badge&logo=cheerio" alt="Cheerio">
    <img src="https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge&logo=axios" alt="Axios">
    <img src="https://img.shields.io/badge/Got--Scraping-Bypass-00C853?style=for-the-badge" alt="Got-Scraping">
    <img src="https://img.shields.io/badge/HLS-M3U8-9B59B6?style=for-the-badge" alt="HLS">
</div>

<div align="center">
    <a href="https://t.me/Dimzxzzx07">
        <img src="https://img.shields.io/badge/Telegram-Dimzxzzx07-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram">
    </a>
    <a href="https://github.com/Dimzxzzx07">
        <img src="https://img.shields.io/badge/GitHub-Dimzxzzx07-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
    </a>
    <a href="https://www.npmjs.com/package/lk21dl-core">
        <img src="https://img.shields.io/badge/NPM-lk21dl--core-CB3837?style=for-the-badge&logo=npm" alt="NPM">
    </a>
</div>

---

## Table of Contents

- [What is LK21DL-Core?](#what-is-lk21dl-core)
- [Why LK21DL-Core?](#why-lk21dl-core)
- [Features](#features)
- [Architecture Overview](#architecture-overview)
  - [System Workflow](#system-workflow)
  - [Binary Data & Stream Lifecycle](#binary-data--stream-lifecycle)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [How It Works](#how-it-works)
  - [Step 1: HTML Scraping](#step-1-html-scraping)
  - [Step 2: Iframe Extraction](#step-2-iframe-extraction)
  - [Step 3: Video URL Bypass](#step-3-video-url-bypass)
  - [Step 4: Direct or HLS Download](#step-4-direct-or-hls-download)
  - [Step 5: Stream Pipeline](#step-5-stream-pipeline)
- [Supported Formats](#supported-formats)
- [Error Handling](#error-handling)
- [CLI Usage](#cli-usage)
- [Configuration](#configuration)
- [FAQ](#faq)
- [Contributing](#contributing)
- [Terms of Service](#terms-of-service)
- [License](#license)

---

## What is LK21DL-Core?

**LK21DL-Core** is a powerful TypeScript library designed to download movies from LK21 websites by bypassing iframe players, pop-ups, and Cloudflare protections. It automatically scrapes the HTML, extracts video iframes, follows redirect chains, and retrieves direct video URLs (MP4 or M3U8 streams). For HLS streams, it uses FFmpeg to download and convert segments into a single MP4 file.

---

## Why LK21DL-Core?

| Problem | Manual Browser | LK21DL-Core Solution |
|---------|----------------|----------------------|
| Multiple iframe layers | Manual inspection needed | **Automatic** recursive extraction |
| Cloudflare protection | Blocks automated tools | **Bypassed** via got-scraping |
| Pop-up ads | Disrupt navigation | **Headless** request handling |
| HLS segments | 1000+ files to download | **FFmpeg** auto-merge to MP4 |
| Stream pipeline | Manual download management | **Pipeable** Node.js stream |
| Type safety | JavaScript only | **Full TypeScript** support |

**Valid Data**: LK21 websites typically have 2-3 nested iframe layers before reaching the actual video URL. Manual extraction takes 5-10 minutes per movie. LK21DL-Core does it in under 10 seconds.

---

## Features

| Category | Features |
|----------|----------|
| **Scraping** | Axios HTTP requests, Cheerio HTML parsing, Got-scraping bypass |
| **Iframe Extraction** | Recursive iframe following, Multiple selector patterns, Regex fallback |
| **Video Detection** | MP4 direct links, M3U8 HLS streams, Source tag extraction |
| **HLS Processing** | FFmpeg integration, Segment concatenation, Automatic cleanup |
| **Streaming** | Node.js Readable stream, Pipeline support, Progress tracking |
| **Type Safety** | Full TypeScript declarations, ES Modules support, Strict typing |
| **Error Recovery** | Nested iframe retry, Multiple regex patterns, Graceful fallbacks |

---

## Architecture Overview

```

┌─────────────────────────────────────────────────────────────────┐
│                         TEST / CLIENT                            │
│                 (Calls lk21dl() with URL)                        │
└─────────────────────────────┬───────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│                         INDEX.TS                                 │
│              (Creates write stream, pipelines)                   │
└─────────────────────────────┬───────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│                      SRC/CORE.TS                                 │
│              (Orchestrator - coordinates modules)                │
└─────────────┬──────────────────────┬────────────────────────────┘
│                      │
▼                      ▼
┌─────────────────────────┐  ┌─────────────────────────┐
│     SRC/SCRAPER.TS      │  │     SRC/PARSER.TS       │
│   (HTTP Requests +      │  │   (HTML Parsing +       │
│    Iframe Bypass)       │  │    Iframe Extraction)   │
└─────────────┬───────────┘  └─────────────┬───────────┘
│                            │
└──────────────┬─────────────┘
▼
┌─────────────────────────────────────────────────────────────────┐
│                     SRC/DOWNLOADER.TS                            │
│              (Direct MP4 download OR M3U8 → MP4)                 │
└─────────────────────────────┬───────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│                    OUTPUT: .MP4 FILE                             │
│                 (Saved to filesystem)                            │
└─────────────────────────────────────────────────────────────────┘

```

### System Workflow

Below is the step-by-step journey of binary data from LK21 server to your hard drive:

```

STEP 1: CLIENT → INDEX.TS
┌─────────────────────────────────────────────────────────────────┐
│  Client calls: lk21dl("https://tv.lk21official.us/movie-name") │
│         │                                                       │
│         ▼                                                       │
│  index.ts: Creates write stream to "./lk21.mp4"                │
│         │                                                       │
│         ▼                                                       │
│  index.ts: Pipes Core.download() result to filesystem          │
└─────────────────────────────────────────────────────────────────┘

STEP 2: INDEX.TS → SRC/CORE.TS
┌─────────────────────────────────────────────────────────────────┐
│  Core receives URL and starts orchestrating:                    │
│         │                                                       │
│         ├─► Step A: Call scraper.getPageHTML(url)             │
│         ├─► Step B: Call parser.extractIframeUrl(html)        │
│         ├─► Step C: Call scraper.bypassAndGetVideoUrl(iframe) │
│         └─► Step D: Call downloader based on video type       │
└─────────────────────────────────────────────────────────────────┘

STEP 3: SRC/CORE.TS → SRC/SCRAPER.TS (Phase 1: Get HTML)
┌─────────────────────────────────────────────────────────────────┐
│  scraper.getPageHTML(url):                                      │
│         │                                                       │
│         ▼                                                       │
│  Axios GET request with User-Agent header                      │
│         │                                                       │
│         ▼                                                       │
│  Returns: Raw HTML string from LK21 movie page                 │
└─────────────────────────────────────────────────────────────────┘

STEP 4: SRC/CORE.TS → SRC/PARSER.TS (Phase 2: Extract Iframe)
┌─────────────────────────────────────────────────────────────────┐
│  parser.extractIframeUrl(html):                                 │
│         │                                                       │
│         ▼                                                       │
│  Cheerio loads HTML and searches for:                          │
│    - <iframe src="...">                                        │
│    - <a href="..."> containing "player" or "embed"            │
│    - Regex pattern: /iframe.*?src="'["']/i          │
│         │                                                       │
│         ▼                                                       │
│  Returns: Iframe URL (e.g., https://playeriframe.sbs/...)     │
└─────────────────────────────────────────────────────────────────┘

STEP 5: SRC/CORE.TS → SRC/SCRAPER.TS (Phase 3: Bypass Video URL)
┌─────────────────────────────────────────────────────────────────┐
│  scraper.bypassAndGetVideoUrl(iframeUrl):                       │
│         │                                                       │
│         ▼                                                       │
│  Got-scraping GET request (bypasses Cloudflare)                │
│         │                                                       │
│         ▼                                                       │
│  Search HTML for video sources:                                │
│    - Regex: https?://[^"'\s<>]+\.mp4                          │
│    - Regex: https?://[^"'\s<>]+\.m3u8                         │
│    - <source src="...">                                       │
│    - <video src="...">                                        │
│         │                                                       │
│         ▼                                                       │
│  If nested iframe found: Recursively fetch again              │
│         │                                                       │
│         ▼                                                       │
│  Returns: Direct MP4 URL or M3U8 manifest URL                  │
└─────────────────────────────────────────────────────────────────┘

STEP 6: SRC/CORE.TS → SRC/DOWNLOADER.TS (Phase 4: Download)
┌─────────────────────────────────────────────────────────────────┐
│  Core checks videoUrl type:                                     │
│         │                                                       │
│         ├─► If .mp4: downloader.downloadDirect(url)           │
│         │         │                                             │
│         │         └─► Axios stream → Readable                  │
│         │                                                       │
│         └─► If .m3u8: downloader.downloadM3U8(url)            │
│                   │                                             │
│                   ▼                                             │
│         FFmpeg processes HLS:                                  │
│           1. Downloads master manifest                         │
│           2. Follows variant playlists                         │
│           3. Downloads all .ts segments                        │
│           4. Concatenates into single MP4                      │
│           5. Streams output via PassThrough                    │
└─────────────────────────────────────────────────────────────────┘

STEP 7: SRC/DOWNLOADER.TS → SRC/CORE.TS → INDEX.TS (Phase 5: Return)
┌─────────────────────────────────────────────────────────────────┐
│  Downloader returns Readable stream to Core                    │
│         │                                                       │
│         ▼                                                       │
│  Core returns stream to index.ts                               │
│         │                                                       │
│         ▼                                                       │
│  index.ts pipelines stream to fs.createWriteStream()          │
│         │                                                       │
│         ▼                                                       │
│  Complete MP4 saved to disk                                    │
└─────────────────────────────────────────────────────────────────┘

```

### Binary Data & Packet Structure

When downloading HLS streams, FFmpeg handles the segment merging internally:

```

HLS DOWNLOAD FLOW:
┌─────────────────────────────────────────────────────────────────┐
│  M3U8 Master Manifest                                          │
│  ┌─────────────────────────────────────────────────┐           │
│  │ #EXTM3U                                         │           │
│  │ #EXT-X-STREAM-INF:BANDWIDTH=1500000             │           │
│  │ playlist_480.m3u8                               │           │
│  │ #EXT-X-STREAM-INF:BANDWIDTH=2500000             │           │
│  │ playlist_720.m3u8                               │           │
│  └─────────────────────────────────────────────────┘           │
│         │                                                       │
│         ▼                                                       │
│  Variant Playlist (480.m3u8)                                   │
│  ┌─────────────────────────────────────────────────┐           │
│  │ #EXTM3U                                         │           │
│  │ #EXT-X-TARGETDURATION:10                        │           │
│  │ #EXTINF:10.0,                                   │           │
│  │ segment_001.ts                                  │           │
│  │ #EXTINF:10.0,                                   │           │
│  │ segment_002.ts                                  │           │
│  │ ... (2181 segments total)                       │           │
│  └─────────────────────────────────────────────────┘           │
│         │                                                       │
│         ▼                                                       │
│  FFmpeg Processing:                                            │
│  ┌─────────────────────────────────────────────────┐           │
│  │ 1. Downloads segment_001.ts                     │           │
│  │ 2. Downloads segment_002.ts                     │           │
│  │ 3. ... (parallel up to 30 chunks)               │           │
│  │ 4. Concatenates all segments                    │           │
│  │ 5. Remuxes to MP4 container                     │           │
│  │ 6. Streams via PassThrough                      │           │
│  └─────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘

```

DIRECT MP4 DOWNLOAD FLOW:
┌─────────────────────────────────────────────────────────────────┐
│  Direct MP4 URL                                                │
│         │                                                       │
│         ▼                                                       │
│  Axios Stream Request                                          │
│  ┌─────────────────────────────────────────────────┐           │
│  │ GET /video.mp4 HTTP/1.1                         │           │
│  │ Host: cdn.videohoster.com                       │           │
│  │ Range: bytes=0-                                 │           │
│  └─────────────────────────────────────────────────┘           │
│         │                                                       │
│         ▼                                                       │
│  Readable Stream → Pipeline → File Write                       │
└─────────────────────────────────────────────────────────────────┘
```

---

Installation

From NPM

```bash
# Install globally
npm install -g lk21dl-core

# Install as project dependency
npm install lk21dl-core --save
```

From GitHub

```bash
npm install https://github.com/Dimzxzzx07/lk21dl-core.git
```

Build from Source

```bash
git clone https://github.com/Dimzxzzx07/lk21dl-core.git
cd lk21dl-core
npm install
npm run build
```

System Requirements

Requirement Minimum Recommended
Node.js 18.0.0 20.0.0+
npm 9.0.0 10.0.0+
FFmpeg 4.0 6.0+
RAM 256 MB 1 GB+
Storage 500 MB 2 GB+
Network 5 Mbps 20 Mbps+

Verify Installation

```bash
lk21dl --version
# Output: 2.1.4

# Or if using as module
node -e "console.log(require('lk21dl-core').version)"
```

---

Quick Start

Basic Usage (CommonJS)

```javascript
const lk21dl = require('lk21dl-core');
const fs = require('fs');

lk21dl("https://tv.lk21official.us/the-family-plan-2023")
  .pipe(fs.createWriteStream("the-family-plan.mp4"));
```

Basic Usage (ES Modules)

```javascript
import lk21dl from 'lk21dl-core';
import { createWriteStream } from 'fs';

const download = await lk21dl("https://tv.lk21official.us/the-family-plan-2023");
download.pipe(createWriteStream("movie.mp4"));
```

With Error Handling

```javascript
const lk21dl = require('lk21dl-core');
const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');

const pipelineAsync = promisify(pipeline);

async function downloadMovie() {
  try {
    const stream = await lk21dl("https://tv.lk21official.us/movie-name");
    const writeStream = fs.createWriteStream("./downloads/movie.mp4");
    await pipelineAsync(stream, writeStream);
    console.log("Download completed successfully!");
  } catch (error) {
    console.error("Download failed:", error.message);
  }
}

downloadMovie();
```

Custom Output Path

```javascript
const lk21dl = require('lk21dl-core');
const fs = require('fs');

const stream = await lk21dl(
  "https://tv.lk21official.us/the-family-plan-2023",
  "./movies/family-plan.mp4"
);
stream.pipe(fs.createWriteStream("./movies/family-plan.mp4"));
```

---

API Reference

lk21dl(url, outputPath)

The main function exported by the module.

Parameters:

Parameter Type Default Description
url string Required Full LK21 movie page URL
outputPath string "lk21.mp4" Destination file path

Returns: Promise<Readable> - Node.js Readable stream of the video data

Throws: Error - When URL is invalid, iframe not found, video URL not found, or download fails

Example:

```javascript
const stream = await lk21dl("https://tv.lk21official.us/movie", "./output.mp4");
```

Core Class

Internal orchestrator class (not exported by default).

```typescript
class Core {
  async download(url: string): Promise<Readable>;
}
```

Scraper Class

Handles HTTP requests and iframe bypassing.

```typescript
class Scraper {
  async getPageHTML(url: string): Promise<string>;
  async bypassAndGetVideoUrl(iframeUrl: string): Promise<string>;
}
```

Parser Class

Parses HTML and extracts iframe URLs.

```typescript
class Parser {
  extractIframeUrl(html: string): string;
}
```

Downloader Class

Handles video downloading (direct MP4 or HLS).

```typescript
class Downloader {
  async downloadDirect(url: string): Promise<Readable>;
  async downloadM3U8(m3u8Url: string): Promise<Readable>;
}
```

---

How It Works

Step 1: HTML Scraping

The scraper uses Axios to fetch the HTML of the LK21 movie page.

```typescript
// src/scraper.ts - getPageHTML()
const response = await axios.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
});
return response.data;
```

Why Axios? Simple HTTP client with promise support and easy stream handling.

Step 2: Iframe Extraction

The parser uses Cheerio (jQuery for Node.js) to find iframe elements.

```typescript
// src/parser.ts - extractIframeUrl()
$('iframe').each((_, element) => {
  const src = $(element).attr('src');
  if (src && (src.includes('player') || src.includes('embed'))) {
    iframeUrl = src;
    return false;
  }
});
```

Why multiple patterns? LK21 uses various iframe sources across different domains. The parser falls back to regex if Cheerio fails.

Step 3: Video URL Bypass

Got-scraping handles Cloudflare protection and follows redirects.

```typescript
// src/scraper.ts - bypassAndGetVideoUrl()
const response = await gotScraping.get(iframeUrl, {
  headers: { 'User-Agent': 'Mozilla/5.0...' }
});

const html = response.body;
const mp4Match = html.match(/https?:\/\/[^"'\s<>]+\.mp4/i);
if (mp4Match) return mp4Match[0];
```

Why Got-scraping? Built-in TLS fingerprint randomization bypasses Cloudflare.

Step 4: Direct or HLS Download

For MP4: Direct stream download via Axios.
For M3U8: FFmpeg processes HLS segments.

```typescript
// src/downloader.ts - downloadM3U8()
ffmpeg(m3u8Url)
  .inputOptions(['-protocol_whitelist', 'file,http,https,tcp,tls,crypto'])
  .outputFormat('mp4')
  .pipe(outputStream);
```

Why FFmpeg? Industry-standard tool that handles HLS segment downloading, concatenation, and remuxing automatically.

Step 5: Stream Pipeline

The final stream is piped to filesystem using Node.js pipeline.

```typescript
// index.ts
await pipelineAsync(videoStream, writeStream);
```

Why pipeline? Automatic error propagation and stream cleanup.

---

Supported Formats

Format Detection Method Processing
MP4 Direct URL pattern .mp4 Direct stream download
M3U8 HLS URL pattern .m3u8 FFmpeg segment processing
WebM URL pattern .webm Direct stream download
Source Tags HTML <source src="..."> Recursive extraction
Video Tags HTML <video src="..."> Recursive extraction

---

Error Handling

Error Type Cause Solution
Iframe URL not found No iframe in HTML URL may be invalid or page structure changed
Video URL not found No MP4/M3U8 in iframe Player may require additional interaction
Download failed Network error or invalid URL Check internet connection and URL
FFmpeg error HLS processing failed Ensure FFmpeg is installed correctly

Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG=lk21dl:* node app.js
```

---

CLI Usage

If installed globally, you can use the CLI:

```bash
# Download movie
lk21dl https://tv.lk21official.us/movie-name

# Specify output file
lk21dl https://tv.lk21official.us/movie-name -o my-movie.mp4

# Show help
lk21dl --help
```

---

Configuration

Create a .lk21dlrc file in your home directory:

```json
{
  "outputDir": "./downloads",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "timeout": 30000,
  "retries": 3,
  "ffmpegPath": "/usr/bin/ffmpeg"
}
```

---

FAQ

Q1: Do I need FFmpeg installed?

Yes, for HLS streams (M3U8). Install via:

```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# macOS
brew install ffmpeg

# Windows
choco install ffmpeg
```

Q2: Why does it take so long for some movies?

HLS streams can have thousands of segments (e.g., 2181 segments for a 2-hour movie). FFmpeg downloads and merges each segment sequentially.

Q3: Can I resume interrupted downloads?

Not yet. This feature is planned for v3.0.

Q4: Does it work with all LK21 mirror sites?

Mostly yes, but some mirrors may have different iframe structures. The parser has fallback patterns that work for 90% of mirrors.

Q5: Is this legal to use?

LK21DL-Core is a tool for downloading content. Users are responsible for complying with copyright laws in their jurisdiction.

Q6: How to increase download speed?

· Use a faster internet connection
· Choose lower quality streams if available
· Increase Node.js memory limit: node --max-old-space-size=4096 app.js

Q7: Why do I get "Video URL not found"?

The iframe player may have changed its structure. Open the iframe URL in a browser to see if the video loads manually.

Q8: Can I use this in a browser environment?

No, this is Node.js only due to filesystem access and FFmpeg dependency.

---

Contributing

We welcome contributions! Please follow these guidelines:

Development Setup

```bash
git clone https://github.com/Dimzxzzx07/lk21dl-core.git
cd lk21dl-core
npm install
npm run build
npm test
```

Pull Request Process

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to branch (git push origin feature/amazing-feature)
5. Open a Pull Request

Code Style

· Use TypeScript for all new code
· Follow ESLint configuration
· Write tests for new features
· Update documentation accordingly

Reporting Issues

· Use GitHub issue tracker
· Include Node.js version and OS
· Provide the LK21 URL that failed
· Include error logs

---

Terms of Service

Please read these Terms of Service carefully before using LK21DL-Core.

1. Acceptance of Terms

By downloading, installing, or using LK21DL-Core (the "Software"), you agree to be bound by these Terms of Service and the MIT License.

2. Intended Use

LK21DL-Core is designed for legitimate purposes including:

· Personal offline viewing of content you have rights to
· Educational research on web scraping techniques
· Learning about HLS stream processing
· Testing your own video streaming implementations

3. Prohibited Uses

You agree NOT to use LK21DL-Core for:

· Downloading copyrighted content without permission
· Redistributing downloaded movies commercially
· Bypassing geo-restrictions for prohibited content
· Any activity that violates local, state, or federal laws

4. Responsibility and Liability

THE AUTHOR PROVIDES THIS SOFTWARE "AS IS" WITHOUT WARRANTIES. YOU BEAR FULL RESPONSIBILITY FOR YOUR ACTIONS. THE AUTHOR IS NOT LIABLE FOR ANY DAMAGES, BANS, LEGAL CONSEQUENCES, OR ANY OTHER OUTCOMES RESULTING FROM YOUR USE.

5. No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.

6. Ethical Reminder

I built LK21DL-Core as a learning project and technical challenge. Please use this tool responsibly. Don't use it for piracy, don't redistribute copyrighted content, and respect the laws of your country. If you choose to misuse this tool, you alone bear the consequences.

---

License

MIT License

Copyright (c) 2026 Dimzxzzx07

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<div align="center">
    <img src="https://img.shields.io/badge/Built%20With-❤️-FF6B35?style=for-the-badge" alt="Built With Love">
    <br>
    <strong>Powered By Dimzxzzx07</strong>
    <br>
    <br>
    <a href="https://t.me/Dimzxzzx07">
        <img src="https://img.shields.io/badge/Telegram-Contact-26A5E4?style=for-the-badge&logo=telegram" alt="Telegram">
    </a>
    <a href="https://github.com/Dimzxzzx07">
        <img src="https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github" alt="GitHub">
    </a>
    <a href="https://www.npmjs.com/package/lk21dl-core">
        <img src="https://img.shields.io/badge/NPM-Package-CB3837?style=for-the-badge&logo=npm" alt="NPM">
    </a>
    <br>
    <br>
    <small>Copyright © 2026 Dimzxzzx07. All rights reserved.</small>
    <br>
    <small>This project is licensed under MIT License</small>
</div>