let BASE_URL = 'https://metruyencv.com';
let API_HOST = 'https://android.lonoapp.net';
let ERROR_MESSAGE = `Vui lòng vào trang nguồn ${BASE_URL} , nhấn vào dấu 3 gạch góc trên bên phải và đăng nhập lại MTC để đọc tiếp`;
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}

/**
 * Lấy Bearer token từ localStorage hoặc từ cookie trên trang web.
 * Token được cache trong localStorage với thời hạn 24 giờ.
 */
function getToken(url) {
    var authorization = localStorage.getItem("authorization");
    var authTime = localStorage.getItem("authorization_time");

    if (authorization && authTime) {
        var now = Date.now();
        var oneDay = 24 * 60 * 60 * 1000;
        if (now - parseInt(authTime) > oneDay) {
            localStorage.removeItem("authorization");
            localStorage.removeItem("authorization_time");
            authorization = null;
        }
    }

    if (authorization) return authorization;

    var res = fetch(BASE_URL + "/tai-khoan/tu-truyen");

    if (!res.ok) {
        var browser = Engine.newBrowser();
        browser.launch(BASE_URL + "/tai-khoan/tu-truyen", 5000);
        browser.close();

        res = fetch(BASE_URL + "/tai-khoan/tu-truyen");
    }

    var cookie = "";
    if (res && res.request && res.request.headers && res.request.headers.cookie) {
        cookie = res.request.headers.cookie;
    }

    if (!cookie) return null;

    var match = cookie.match(/(?:^|;\s*)accessToken=([^;]+)/);
    if (!match) return null;

    var accessToken = match[1];
    authorization = "Bearer " + accessToken;

    localStorage.setItem("authorization", authorization);
    localStorage.setItem("authorization_time", Date.now());
    return authorization;
}

/**
 * Tạo headers chuẩn cho mọi request đến API mới.
 */
function apiHeaders(authorization) {
    var h = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'okhttp/4.9.0',
    };
    if (authorization) h['Authorization'] = authorization;
    return h;
}
