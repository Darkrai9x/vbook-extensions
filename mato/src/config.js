var BASE_URL = 'https://mato.suicaodex.com';
var API_URL = BASE_URL + '/api/v1/mato';
var AUTHOR = 'Takahiro, Takemura Youhei';

function getInfo() {
    let response = fetch(API_URL + '/info.json');
    if (response.ok) return response.json();
    return null;
}

function toListItem(info) {
    return {
        name: info.title,
        link: info.url || BASE_URL + '/',
        host: BASE_URL,
        cover: info.cover,
        description: info.description
    };
}
