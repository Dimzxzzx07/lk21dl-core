import * as cheerio from 'cheerio';

export default class Parser {
  extractIframeUrl(html: string): string {
    const $ = cheerio.load(html);
    let iframeUrl = '';
    
    $('iframe').each((index: number, element: any) => {
      const src = $(element).attr('src');
      if (src && (src.includes('player') || src.includes('embed') || src.includes('video'))) {
        iframeUrl = src;
        return false;
      }
    });
    
    if (!iframeUrl) {
      $('a').each((index: number, element: any) => {
        const href = $(element).attr('href');
        if (href && (href.includes('player') || href.includes('embed'))) {
          iframeUrl = href;
          return false;
        }
      });
    }
    
    if (!iframeUrl) {
      const match = html.match(/iframe.*?src=["']([^"']+)["']/i);
      if (match) iframeUrl = match[1];
    }
    
    if (!iframeUrl) {
      throw new Error('Iframe URL not found');
    }
    
    return iframeUrl;
  }
}