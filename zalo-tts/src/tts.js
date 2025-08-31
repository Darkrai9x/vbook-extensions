load("voice_list.js");

let apiKeys = [];
let index = 0;
try {
    apiKeys = (api_keys || "").split("\n").filter(k => k !== "");
} catch (e) {}

function execute(text, voice) {
    let voiceInfo = voices.find(function (e) {
        return e.id == voice;
    });
    const asyncUrl = getAsyncSpeakUrl(text, voiceInfo.id, '1.0', 'mp3');

    if (asyncUrl) {

        sleep(100); // Wait 100ms
        let response = fetch(asyncUrl);
        let count = 1;

        while (response.status === 404 && count < 4) {
            sleep(1000); // Wait 1 second
            response = fetch(asyncUrl);
            count++;
        }
        if (response.ok) {
            return Response.success(response.base64());
        }
    }
    return null;
}

function getAsyncSpeakUrl(text, voice, speed, format) {
    while (apiKeys.length > 0) {
        let apiKey = getApiKey();
        try {
            let response = fetch("https://api.zalo.ai/v1/tts/synthesize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "apikey": apiKey,
                },
                body: {
                    input: text,
                    encode_type: format,
                    speed: speed,
                    speaker_id: voice,
                },
            });

            let json = response.json();

            if (json.error_code === 0 && json.data && json.data.url) {
                return json.data.url;
            } else {
                apiKeys = apiKeys.filter(key => key !== apiKey);
            }
        } catch (err) {
            return null;
        }
    }
    return null;
}

function getApiKey() {
    index = (index + 1) % apiKeys.length;
    return apiKeys[index];
}