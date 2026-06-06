import axios from 'axios';
import { gotScraping } from 'got-scraping';
import * as fs from 'fs';
export default class Scraper {
    async getPageHTML(url) {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });
        return response.data;
    }
    async bypassAndGetVideoUrl(iframeUrl) {
        if (iframeUrl.startsWith('//')) {
            iframeUrl = `https:${iframeUrl}`;
        }
        try {
            const response = await gotScraping.get(iframeUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': 'https://tv.lk21official.us/',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                }
            });
            const html = response.body;
            fs.writeFileSync('./iframe_dump.html', html, 'utf-8');
            const nestedIframeMatch = html.match(/<iframe\s+[^>]*src=["']([^"']+)["']/i);
            if (nestedIframeMatch) {
                let realVideoHost = nestedIframeMatch[1];
                if (realVideoHost.startsWith('//'))
                    realVideoHost = `https:${realVideoHost}`;
                return await this.fetchDirectVideoLink(realVideoHost, iframeUrl);
            }
            const mp4Match = html.match(/https?:\/\/[^"'\s<>]+\.mp4[^"'\s<>]*/i);
            if (mp4Match)
                return mp4Match[0];
            const m3u8Match = html.match(/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/i);
            if (m3u8Match)
                return m3u8Match[0];
            throw new Error('Failed to find hidden streaming host on Layer 1.');
        }
        catch (err) {
            throw err;
        }
    }
    async fetchDirectVideoLink(videoHostUrl, parentReferer) {
        try {
            const response = await gotScraping.get(videoHostUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': parentReferer
                }
            });
            const html = response.body;
            const idMatch = videoHostUrl.match(/id=([a-f0-9]+)/i);
            const videoId = idMatch ? idMatch[1] : null;
            if (!videoId)
                throw new Error('Video ID tidak ditemukan di URL Layer 2.');
            const urlObj = new URL(videoHostUrl);
            const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
            const jsResponse = await gotScraping.get(`${baseUrl}/js/init.min.js?t=29`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': videoHostUrl
                }
            });
            const jsContent = jsResponse.body;
            let apiFile = 'api2.php';
            const apiRouteMatch = jsContent.match(/this\.post\(\s*["']([^"'\?]+)/i);
            if (apiRouteMatch) {
                apiFile = apiRouteMatch[1];
            }
            const targetApiUrl = `${baseUrl}/${apiFile}?id=${videoId}`;
            const apiResponse = await gotScraping.post(targetApiUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': videoHostUrl,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                form: {
                    r: parentReferer,
                    d: urlObj.hostname
                },
                responseType: 'json'
            });
            const resData = apiResponse.body;
            if (resData.message) {
                throw new Error(`Server menolak memberikan stream: ${resData.message}`);
            }
            let directUrl = '';
            if (Array.isArray(resData)) {
                const firstSource = resData.find((src) => src.file);
                if (firstSource)
                    directUrl = firstSource.file;
            }
            else if (resData && typeof resData === 'object') {
                if (resData.file)
                    directUrl = resData.file;
                else if (Array.isArray(resData.sources)) {
                    const firstSource = resData.sources.find((src) => src.file);
                    if (firstSource)
                        directUrl = firstSource.file;
                }
            }
            if (!directUrl) {
                const rawJsonString = JSON.stringify(resData);
                const m3u8Match = rawJsonString.match(/https?:\/\/[^"'\s<>,\\]+\.m3u8[^"'\s<>,\\]*/i);
                if (m3u8Match)
                    directUrl = m3u8Match[0].replace(/\\/g, '');
                const mp4Match = rawJsonString.match(/https?:\/\/[^"'\s<>,\\]+\.mp4[^"'\s<>,\\]*/i);
                if (mp4Match && !directUrl)
                    directUrl = mp4Match[0].replace(/\\/g, '');
            }
            if (!directUrl) {
                throw new Error('Failed to extract direct streaming URL from JSON API response.');
            }
            return directUrl;
        }
        catch (error) {
            throw new Error(`err: ${error.message}`);
        }
    }
}
