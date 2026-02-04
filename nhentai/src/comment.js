function execute(url, next) {
    // 1. Gửi yêu cầu lấy dữ liệu từ API
    let response = fetch(url, {
        headers: { "user-agent": UserAgent.chrome() }
    });
    if (response.ok) {
        // 2. Phân giải dữ liệu JSON
        let json = response.json(); 
        let comments = [];

        json.forEach(item => {
            // Lấy thông tin người đăng từ object "poster"
            let poster = item.poster;
            
            // Xử lý thời gian (nHentai dùng Unix timestamp)
            let date = new Date(item.post_date * 1000);
            let timeStr = date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN");

            // Xử lý link Avatar (thêm domain i3.nhentai.net nếu cần)
            let avatar = poster.avatar_url;
            if (avatar && !avatar.startsWith("http")) {
                avatar = "https://i3.nhentai.net/" + avatar;
            }

            comments.push({
                name: poster.username,
                content: item.body,
                description: "📅 " + timeStr,
                avatar: avatar
            });
        });

        // Trả về danh sách bình luận cho ứng dụng hiển thị
        return Response.success(comments);
    }

    return null;
}