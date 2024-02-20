let BASE_URL = 'https://www.nettruyenbb.com';
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}