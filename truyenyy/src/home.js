load('config.js');
function execute() {
    return Response.success([
        {title: "Mới cập nhật", script: "top.js", input: BASE_URL + "/truyen-moi-cap-nhat/"},
        {title: "Đọc nhiều", script: "top.js", input: BASE_URL + "/kim-thanh-bang/top/doc-nhieu-trong-tuan/"},
        {title: "Đề cử", script: "top.js", input: BASE_URL + "/kim-thanh-bang/top/truyen-de-cu/"},
        {title: "Bình luận nhiều", script: "top.js", input: BASE_URL + "/kim-thanh-bang/top/truyen-binh-luan-soi-noi/"}
    ]);
}


