import Scraper from './scraper.js';
import Parser from './parser.js';
import Downloader from './downloader.js';
import { Readable } from 'stream';

export default class Core {
  private scraper: Scraper;
  private parser: Parser;
  private downloader: Downloader;

  constructor() {
    this.scraper = new Scraper();
    this.parser = new Parser();
    this.downloader = new Downloader();
  }

  async download(url: string): Promise<Readable> {
    const html = await this.scraper.getPageHTML(url);
    const iframeUrl = this.parser.extractIframeUrl(html);
    if (!iframeUrl) {
      throw new Error('Failed to extract iframe URL from LK21 main page. Selector may have changed.');
    }
    const videoUrl = await this.scraper.bypassAndGetVideoUrl(iframeUrl);
    if (!videoUrl) {
      throw new Error('Failed to get Video URL from inside player iframe.');
    }

    if (videoUrl.includes('.m3u8')) {
      if (videoUrl.includes('hownetwork.xyz') || videoUrl.includes('/zzz/')) {
        return await this.downloader.downloadM3U8(videoUrl, {
          'Referer': 'https://cloud.hownetwork.xyz/',
          'Origin': 'https://cloud.hownetwork.xyz'
        });
      }
      
      return await this.downloader.downloadM3U8(videoUrl);
    }

    return await this.downloader.downloadDirect(videoUrl);
  }
}
