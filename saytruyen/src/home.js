function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "https://saytruyen.net/danh-sach-truyen.html", script: "gen.js" },
        { title: "Manga", input: "https://saytruyen.net/danh-sach-truyen-the-loai-manga.html", script: "cat.js" },
        { title: "Manhwa", input: "https://saytruyen.net/danh-sach-truyen-the-loai-manhwa.html", script: "cat.js" },
        { title: "Manhua", input: "https://saytruyen.net/danh-sach-truyen-the-loai-manhua.html", script: "cat.js" },
    ]);
}