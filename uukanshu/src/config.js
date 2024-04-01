let BASE_URL = "zhaoshuyuan.com";
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}

let DESKTOP_URL = "https://www." + BASE_URL;
let MOBILE_URL = "https://sj." + BASE_URL;