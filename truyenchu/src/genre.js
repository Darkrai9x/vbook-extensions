load('config.js');

function execute() {
    return Response.success(
        [
            {"title": "Tiên hiệp", "input": BASE_URL + "/the-loai/tien-hiep", "script": "gen.js"},
            {"title": "Huyền huyễn", "input": BASE_URL + "/the-loai/huyen-huyen", "script": "gen.js"},
            {"title": "Khoa huyễn", "input": BASE_URL + "/the-loai/khoa-huyen", "script": "gen.js"},
            {"title": "Võng du", "input": BASE_URL + "/the-loai/vong-du", "script": "gen.js"},
            {"title": "Đô thị", "input": BASE_URL + "/the-loai/do-thi", "script": "gen.js"},
            {"title": "Đồng nhân", "input": BASE_URL + "/the-loai/dong-nhan", "script": "gen.js"},
            {"title": "Dã sử", "input": BASE_URL + "/the-loai/da-su", "script": "gen.js"},
            {"title": "Cạnh kỹ", "input": BASE_URL + "/the-loai/canh-ky", "script": "gen.js"},
            {"title": "Huyền nghi", "input": BASE_URL + "/the-loai/huyen-nghi", "script": "gen.js"},
            {"title": "Kiếm hiệp", "input": BASE_URL + "/the-loai/kiem-hiep", "script": "gen.js"},
            {"title": "Kỳ ảo", "input": BASE_URL + "/the-loai/ky-ao", "script": "gen.js"},
            {"title": "Sắc", "input": BASE_URL + "/the-loai/sac", "script": "gen.js"},
            {"title": "Ngôn tình", "input": BASE_URL + "/the-loai/ngon-tinh", "script": "gen.js"},
            {"title": "Đam mỹ", "input": BASE_URL + "/the-loai/dam-my", "script": "gen.js"},
            {"title": "Bách Hợp", "input": BASE_URL + "/the-loai/bach-hop", "script": "gen.js"},
            {"title": "Truyện Teen", "input": BASE_URL + "/the-loai/truyen-teen", "script": "gen.js"},
            {"title": "Light Novel", "input": BASE_URL + "/the-loai/light-novel", "script": "gen.js"}
        ]
    );
}