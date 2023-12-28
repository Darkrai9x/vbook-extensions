let BASE_URL = 'https://www.nettruyenbing.com';
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}