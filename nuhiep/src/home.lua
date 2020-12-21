local data = {}

table.insert(data, {
    ["title"] = "Mới cập nhật",
    ["script"] = "gen.lua",
    ["input"] = "https://nuhiep.com/truyen?"
})

table.insert(data, {
    ["title"] = "Đọc nhiều",
    ["script"] = "rank.lua",
    ["input"] = "https://nuhiep.com/bang-xep-hang?rank_type=1&period=1"
})
table.insert(data, {
    ["title"] = "Độ ngọt",
    ["script"] = "rank.lua",
    ["input"] = "https://nuhiep.com/bang-xep-hang?rank_type=5"
})

table.insert(data, {
    ["title"] = "Độ thơm",
    ["script"] = "rank.lua",
    ["input"] = "https://nuhiep.com/bang-xep-hang?rank_type=2&period=1"
})

table.insert(data, {
    ["title"] = "Yêu thích",
    ["script"] = "rank.lua",
    ["input"] = "https://nuhiep.com/bang-xep-hang?rank_type=4&period=1"
})

table.insert(data, {
    ["title"] = "Thảo luận",
    ["script"] = "rank.lua",
    ["input"] = "https://nuhiep.com/bang-xep-hang?rank_type=3&period=1"
})

return response:success(data)
