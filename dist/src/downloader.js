import axios from 'axios';
import { gotScraping } from 'got-scraping';
import * as fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
export default class Downloader {
    async downloadDirect(url) {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        return response.data;
    }
    async downloadM3U8(m3u8Url, customHeaders = {}) {
        const tempDir = path.resolve('./downloads/chunks');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        const defaultHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
            'Connection': 'keep-alive',
            ...customHeaders
        };
        let manifestRes = await gotScraping.get(m3u8Url, { headers: defaultHeaders, http2: false });
        let manifestText = manifestRes.body;
        if (manifestText.includes('<html') || manifestText.includes('<!DOCTYPE')) {
            throw new Error('Server rejected! The m3u8 manifest obtained is a web/HTML page.');
        }
        if (manifestText.includes('#EXT-X-STREAM-INF')) {
            const lines = manifestText.split('\n');
            let targetMediaUrl = '';
            for (let i = lines.length - 1; i >= 0; i--) {
                const line = lines[i].trim();
                if (line && line.startsWith('http')) {
                    targetMediaUrl = line;
                    break;
                }
            }
            if (!targetMediaUrl) {
                for (let i = lines.length - 1; i >= 0; i--) {
                    const line = lines[i].trim();
                    if (line && !line.startsWith('#')) {
                        const urlObj = new URL(m3u8Url);
                        const baseUrl = `${urlObj.protocol}//${urlObj.host}${path.dirname(urlObj.pathname)}/`;
                        targetMediaUrl = new URL(line, baseUrl).href;
                        break;
                    }
                }
            }
            if (targetMediaUrl) {
                manifestRes = await gotScraping.get(targetMediaUrl, { headers: defaultHeaders, http2: false });
                manifestText = manifestRes.body;
                m3u8Url = targetMediaUrl;
            }
        }
        const lines = manifestText.split('\n');
        const segments = [];
        const urlObj = new URL(m3u8Url);
        const baseUrl = `${urlObj.protocol}//${urlObj.host}${path.dirname(urlObj.pathname)}/`;
        for (let line of lines) {
            line = line.trim();
            if (line && !line.startsWith('#')) {
                if (line.startsWith('http')) {
                    segments.push(line);
                }
                else {
                    segments.push(new URL(line, baseUrl).href);
                }
            }
        }
        if (segments.length === 0) {
            throw new Error('No video segments (.ts) were found in the playlist..');
        }
        const CONCURRENCY_LIMIT = 30;
        const fileListPath = path.join(tempDir, 'files.txt');
        let completedCount = 0;
        const downloadChunk = async (segmentUrl, index) => {
            const chunkFileName = `chunk_${String(index).padStart(4, '0')}.ts`;
            const chunkPath = path.join(tempDir, chunkFileName);
            try {
                const chunkRes = await gotScraping.get(segmentUrl, {
                    headers: defaultHeaders,
                    responseType: 'buffer',
                    http2: false,
                    timeout: {
                        request: 30000
                    },
                    retry: {
                        limit: 4,
                        methods: ['GET'],
                        statusCodes: [408, 429, 500, 502, 503, 504],
                        errorCodes: ['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED', 'EPIPE']
                    }
                });
                fs.writeFileSync(chunkPath, chunkRes.rawBody);
                completedCount++;
                return chunkPath;
            }
            catch (err) {
                console.error(`\nerr: ${err.message}`);
                throw err;
            }
        };
        for (let i = 0; i < segments.length; i += CONCURRENCY_LIMIT) {
            const pool = [];
            for (let j = 0; j < CONCURRENCY_LIMIT && (i + j) < segments.length; j++) {
                const index = i + j;
                pool.push(downloadChunk(segments[index], index));
            }
            await Promise.all(pool);
        }
        let fileListContent = '';
        for (let i = 0; i < segments.length; i++) {
            const chunkFileName = `chunk_${String(i).padStart(4, '0')}.ts`;
            const chunkPath = path.join(tempDir, chunkFileName);
            fileListContent += `file '${chunkPath}'\n`;
        }
        fs.writeFileSync(fileListPath, fileListContent, 'utf-8');
        const outputMp4 = path.resolve(`./downloads/final_temp_${Date.now()}.mp4`);
        try {
            await execAsync(`ffmpeg -f concat -safe 0 -i "${fileListPath}" -c copy -y "${outputMp4}"`);
        }
        catch (err) {
            throw new Error(`err: ${err.message}`);
        }
        try {
            for (let i = 0; i < segments.length; i++) {
                const chunkPath = path.join(tempDir, `chunk_${String(i).padStart(4, '0')}.ts`);
                if (fs.existsSync(chunkPath))
                    fs.unlinkSync(chunkPath);
            }
            if (fs.existsSync(fileListPath))
                fs.unlinkSync(fileListPath);
        }
        catch (e) { }
        const finalStream = fs.createReadStream(outputMp4);
        finalStream.on('close', () => {
            if (fs.existsSync(outputMp4))
                fs.unlinkSync(outputMp4);
        });
        return finalStream;
    }
}
