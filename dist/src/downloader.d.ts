import { Readable } from 'stream';
export default class Downloader {
    downloadDirect(url: string): Promise<Readable>;
    downloadM3U8(m3u8Url: string, customHeaders?: Record<string, string>): Promise<Readable>;
}
