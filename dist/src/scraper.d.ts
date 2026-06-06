export default class Scraper {
    getPageHTML(url: string): Promise<string>;
    bypassAndGetVideoUrl(iframeUrl: string): Promise<string>;
    private fetchDirectVideoLink;
}
