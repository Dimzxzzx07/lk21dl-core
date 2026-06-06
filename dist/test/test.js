import lk21dl from '../index.js';
async function test() {
    const url = 'https://tv.lk21official.us/the-family-plan-2023';
    const output = './downloads/test.mp4';
    try {
        console.log('Starting download...');
        const result = await lk21dl(url, output);
        console.log(`Download completed: ${result}`);
    }
    catch (error) {
        console.error('Download failed:', error);
    }
}
test();
