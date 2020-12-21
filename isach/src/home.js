function execute() {
    return Response.success([
        {title: "Mới cập nhật", input: "https://isach.info/most_reading.php?sort=last_update_date", script: "top.js"},
        {title: "Đọc nhiều", input: "https://isach.info/most_reading.php?sort=page_view", script: "top.js"},
        {title: "Tải nhiều", input: "https://isach.info/story.php?list=story&order=created_date", script: "top.js"}
    ]);
}