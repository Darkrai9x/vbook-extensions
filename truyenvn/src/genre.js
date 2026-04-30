load('config.js');
function execute() {
    return Response.success([
        { title: "ROMANCE", input: BASE_URL + "/the-loai/romance/", script: "gen.js" },
        { title: "DRAMA", input: BASE_URL + "/the-loai/drama/", script: "gen.js" },
        { title: "ADVENTURE", input: BASE_URL + "/the-loai/adventure/", script: "gen.js" },
        { title: "HISTORICAL", input: BASE_URL + "/the-loai/historical/", script: "gen.js" },
        { title: "HUYỀN HUYỄN", input: BASE_URL + "/the-loai/huyen-huyen/", script: "gen.js" },
        { title: "KINH DỊ", input: BASE_URL + "/the-loai/kinh-di/", script: "gen.js" },
        { title: "HIỆN ĐẠI", input: BASE_URL + "/the-loai/hien-dai/", script: "gen.js" },
        { title: "HORROR", input: BASE_URL + "/the-loai/horror/", script: "gen.js" },
        { title: "HỌC ĐƯỜNG", input: BASE_URL + "/the-loai/hoc-duong/", script: "gen.js" },
        { title: "HAREM", input: BASE_URL + "/the-loai/harem/", script: "gen.js" },
        { title: "GAME", input: BASE_URL + "/the-loai/game/", script: "gen.js" },
        { title: "ECHI", input: BASE_URL + "/the-loai/echi/", script: "gen.js" },
        { title: "FANTASY", input: BASE_URL + "/the-loai/fantasy/", script: "gen.js" },
        { title: "COMIC", input: BASE_URL + "/the-loai/comic/", script: "gen.js" },
        { title: "COOKING", input: BASE_URL + "/the-loai/cooking/", script: "gen.js" },
    ]);
}