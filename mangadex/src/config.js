let BASE_URL = 'https://mangadex.org';
let LANGUAGE = "vi,en,ja-ro,ja";
let FALLBACK_LANGUAGE = "en,ja-ro,ja"
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
    if (CONFIG_LANGUAGE) {
        LANGUAGE = CONFIG_LANGUAGE;
    }
} catch (error) {
}
let API_URL = BASE_URL.replace("https://", "https://api.");

function getDisplayLanguageData(value) {
    let lang = LANGUAGE.split(",");
    if (lang.length === 0) lang = ["vi"];
    for (let i = 0; i < lang.length; i++) {
        if (value[lang[i]]) return value[lang[i]];
    }
    lang = FALLBACK_LANGUAGE.split(",");
    for (let i = 0; i < lang.length; i++) {
        if (value[lang[i]]) return value[lang[i]];
    }
    const firstKey = Object.keys(value)[0];
    return value[firstKey];
}