let BASE_URL = "uukanshu.net";
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}

let DESKTOP_URL = "https://www." + BASE_URL;
let MOBILE_URL = "https://sj." + BASE_URL;