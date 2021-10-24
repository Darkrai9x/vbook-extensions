function execute() { 
    return Response.success([ 
{   title: "Văn học Việt Nam ", input: "https://www.sachhayonline.com/danh-muc/van-hoc-viet-nam", script: "gen.js"},
    {title: "Văn Học nước ngoài", input: "https://www.sachhayonline.com/danh-muc/van-hoc-nuoc-ngoai", script: "gen.js"},
{title: "Các thể loại khác", input: "https://www.sachhayonline.com/danh-muc/the-loai-khac", script: "gen.js"}
    ]);
}