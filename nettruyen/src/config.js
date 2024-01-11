let BASE_URL = 'https://www.nettruyenclub.com';
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}