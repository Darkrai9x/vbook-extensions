load('config.js');

function execute(url, page) {
    if (page) return Response.success([], null);

    let info = getInfo();
    if (!info) return Response.error('Không tải được thông tin truyện');

    return Response.success([toListItem(info)], null);
}
