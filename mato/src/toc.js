load('config.js');

function execute(url) {
    let response = fetch(API_URL + '/chapters.json');
    if (!response.ok) return Response.error('Không tải được danh sách chương');

    let data = response.json();
    let chapters = [];

    for (let i = data.length - 1; i >= 0; i--) {
        chapters.push({
            name: data[i].title,
            url: data[i].apiUrl
        });
    }

    return Response.success(chapters);
}
