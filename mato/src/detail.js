load('config.js');

function execute(url) {
    let info = getInfo();
    if (!info) return Response.error('Không tải được thông tin truyện');

    let ongoing = info.status === 'ongoing';
    let status = ongoing ? 'Đang tiến hành' : 'Hoàn thành';

    return Response.success({
        name: info.title,
        cover: info.cover,
        host: BASE_URL,
        author: AUTHOR,
        description: info.description,
        detail: 'Số chương: ' + info.chapterCount + '\nTình trạng: ' + status,
        ongoing: ongoing
    });
}
