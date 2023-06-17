let BASE_URL = 'https://www.nettruyenmax.com';
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}