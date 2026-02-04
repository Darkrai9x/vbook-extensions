function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let htmlContent = doc.html();
        
        // 1. Lấy Media Server (ưu tiên từ script, nếu không có thì mặc định là 3 hoặc 5)
        let mediaServerMatch = /media_server\s*:\s*(\d+)/.exec(htmlContent);
        let mediaServer = mediaServerMatch ? mediaServerMatch[1] : "3"; 

        // 2. Chọn chính xác các ảnh thumbnail
        let el = doc.select("#thumbnail-container img.lazyload");
        let data = [];

        el.forEach(e => {
            let thumbSrc = e.attr("data-src");
            if (thumbSrc) {
                let match = /\/galleries\/(\d+)\/(\d+)t\.(webp|jpg|png)/.exec(thumbSrc);
                
                if (match) {
                    let galleryId = match[1];
                    let pageNum = match[2];
                    let extension = match[3];
                    
                    let originalUrl = "https://i" + mediaServer + ".nhentai.net/galleries/" + galleryId + "/" + pageNum + "." + extension;
                    
                    data.push(originalUrl);
                }
            }
        });

        return Response.success(data);
    }
    return null;
}