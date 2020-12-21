local data = {}

table.insert(data, {
    ["title"] = "Mới cập nhật",
    ["script"] = "gen.lua",
    ["input"] = "https://metruyenchu.com/truyen?"
})

table.insert(data, {
    ["title"] = "Đọc nhiều",
    ["script"] = "rank.lua",
    ["input"] = "https://metruyenchu.com/bang-xep-hang?rank_type=1&period=1"
})

table.insert(data, {
    ["title"] = "Tặng thưởng",
    ["script"] = "rank.lua",
    ["input"] = "https://metruyenchu.com/bang-xep-hang?rank_type=5&period=1"
})

table.insert(data, {
    ["title"] = "Đề cử",
    ["script"] = "rank.lua",
    ["input"] = "https://metruyenchu.com/bang-xep-hang?rank_type=2&period=1"
})

table.insert(data, {
    ["title"] = "Yêu thích",
    ["script"] = "rank.lua",
    ["input"] = "https://metruyenchu.com/bang-xep-hang?rank_type=4&period=1"
})

table.insert(data, {
    ["title"] = "Đánh giá",
    ["script"] = "rank.lua",
    ["input"] = "https://metruyenchu.com/truyen?sort_by=review_count"
})

table.insert(data, {
    ["title"] = "Thảo luận",
    ["script"] = "rank.lua",
    ["input"] = "https://metruyenchu.com/bang-xep-hang?rank_type=3&period=1"
})

return response:success(data)
