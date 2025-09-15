load("config.js");

function execute(url) {
    try {
        // URL đã có format "v1/chapter_list/storyId?page=X&new=0"
        let apiUrl = BASE_URL.replace("https://", "https://api.") + "/" + url;
        
        let response = fetch(apiUrl);
        if (response.ok) {
            let json = response.json();
            
            // Kiểm tra cấu trúc response - có thể là success hoặc code
            if (!json || (!json.success && json.code !== 0)) {
                return Response.error("API response không hợp lệ: " + JSON.stringify(json));
            }
            
            if (!json.data || !Array.isArray(json.data)) {
                return Response.error("Dữ liệu chapters không tồn tại hoặc không đúng định dạng. Data: " + JSON.stringify(json.data));
            }
            
            let chapters = [];
            json.data.forEach(e => {
                chapters.push({
                    name: e.name,
                    url: e.url,
                    pay: e.is_vip || false,
                    host: BASE_URL,
                });
            });
            
            return Response.success(chapters);
        } else {
            return Response.error("Không thể tải dữ liệu từ server. Status: " + response.status + ". URL: " + apiUrl);
        }
    } catch (error) {
        return Response.error("Lỗi khi xử lý dữ liệu: " + error.message);
    }
}