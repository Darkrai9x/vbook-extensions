function execute() {
    return Response.success([
        {title: "Mới cập nhật", input: "post_type=wp-manga&m_orderby=latest", script: "top.js"},
        {title: "Truyện mới", input: "post_type=wp-manga&m_orderby=new-manga", script: "top.js"},
        {title: "Đánh giá", input: "post_type=wp-manga&m_orderby=rating", script: "top.js"},
        {title: "Nổi bật", input: "post_type=wp-manga&m_orderby=trending", script: "top.js"},
        {title: "Đọc nhiều", input: "wp-manga&m_orderby=views", script: "top.js"},
    ]);
}