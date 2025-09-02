load("voice_list.js");

function execute(text, voice) {
    let voiceInfo = voices.find(function (e) {
        return e.id == voice;
    });
    let formattedText = text
        .replace(/\+/g, 'plus')
        .replace(/\n/g, '. ')
        .replace(/\s+/g, '+')
        .replace(/&/g, 'and');

    // let cookie = "";
    if (!cookie || !cookie.includes("sessionid=")) {
        return Response.error("Bạn phải vào Tiktok đăng nhập trên trình duyệt để có thể đọc.");
    }

    let response = fetch("https://api16-normal-c-useast1a.tiktokv.com/media/api/text/speech/invoke/", {
        method: 'POST',
        queries: {
            "text_speaker": voiceInfo.id,
            "req_text": formattedText,
            "speaker_map_type": "0",
            "aid": "1233"
        },
        headers: {
            'User-Agent': 'com.zhiliaoapp.musically/2022600030 (Linux; U; Android 7.1.2; es_ES; SM-G988N; Build/NRD90M;tt-ok/3.12.13.1)',
            'Accept-Encoding': 'gzip,deflate,compress',
        }
    });

    let resultText = response.text();

    // Parse JSON if it looks like JSON
    if (resultText.startsWith('{')) {
        let result = JSON.parse(resultText);
        let statusCode = result.status_code;

        if (statusCode === 0) {
            return Response.success(result.data.v_str);
        } else {
            return Response.error(result.status_msg);
        }
    }

    return null;
}
