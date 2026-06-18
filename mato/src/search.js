load('config.js');

function execute(key, page) {
    if (page) return Response.success([], null);

    let query = (key || '').toLowerCase();
    if (!isMatoQuery(query)) return Response.success([], null);

    let info = getInfo();
    if (!info) return Response.error('Không tải được thông tin truyện');

    return Response.success([toListItem(info)], null);
}

function isMatoQuery(query) {
    return query.indexOf('mato') >= 0 ||
        query.indexOf('ma đô') >= 0 ||
        query.indexOf('ma do') >= 0 ||
        query.indexOf('slave') >= 0 ||
        query.indexOf('nô lệ') >= 0 ||
        query.indexOf('no le') >= 0 ||
        query.indexOf('chained soldier') >= 0;
}
