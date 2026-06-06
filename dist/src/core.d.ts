import { Readable } from 'stream';
export default class Core {
    private scraper;
    private parser;
    private downloader;
    constructor();
    download(url: string): Promise<Readable>;
}
