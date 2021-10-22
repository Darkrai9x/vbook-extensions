function execute(url, page) {
    if (!page) page = '1';
    const doc = Http.get(url+'/page/'+page).html()
    //param chỉ dùng khi link có dạng url?key=value
    //còn bt cứ dùng link bt
     var next = doc.select('.wp-pagenavi').select('span.current + a').text();
     var el = doc.select(".content_page .item_sach");
    const data = [];
     for (var i =0; i <el.size();i++){
     var e = el.get(i);
        data.push({    
        name: e.select(".title_sach").first().text(),
        link: e.select("a").first().attr("href"),
        cover: e.select("img.medium_thum").attr("src"),
        //không xài cũng bỏ vào để tránh lỗi do thiếu data
        description : null,
        host: "https://nhasachmienphi.com"
         })
    }
    return Response.success(data, next)
}