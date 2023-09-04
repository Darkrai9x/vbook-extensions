let BASE_URL = 'https://blogtruyenmoi.com';
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}