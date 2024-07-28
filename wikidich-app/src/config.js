const BASE_URL = "https://api.truyenreview.com";
const API_KEY = "986252BF0B662B4C09A4F293B992024A";
const API_SECRET = "2AB216EB017B05D3FB81D7A9DD7B4F29";
const VERSION = "0.1.6"

function createHeaders(path) {
    let time = new Date().getTime() + "";
    let args = path;
    if (args.length > 10) {
        args = args.substring(args.length - 10);
    }
    args = time + args;
    let hash = CryptoJS.HmacSHA256(args, API_SECRET);
    let signature = CryptoJS.enc.Base64.stringify(hash);
    return {
        "Api-Key": API_KEY,
        "Signature": signature,
        "Request-Time": time,
        "User-Agent": "okhttp/3.12.1"
    }
}