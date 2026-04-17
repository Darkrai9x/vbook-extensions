load('config.js');

function execute() {
    return Response.success([
        { title: "Hành động", input: BASE_URL + "/hanh-dong", script: "gen.js" },
        { title: "Phiêu lưu", input: BASE_URL + "/phieu-luu", script: "gen.js" },
        { title: "Khoa học", input: BASE_URL + "/khoa-hoc", script: "gen.js" },
        { title: "Hài hước", input: BASE_URL + "/hai-huoc", script: "gen.js" },
        { title: "Hoạt hình", input: BASE_URL + "/hoat-hinh", script: "gen.js" },
        { title: "Thần thoại", input: BASE_URL + "/than-thoai", script: "gen.js" },
        { title: "Võ thuật", input: BASE_URL + "/vo-thuat", script: "gen.js" },
        { title: "Hhninja", input: BASE_URL + "/hhninja", script: "gen.js" },
        { title: "Hhtqtv", input: BASE_URL + "/hhtqtv", script: "gen.js" },
        { title: "Hhpanda", input: BASE_URL + "/hhpanda", script: "gen.js" }
    ]);
}
