local data = {}

table.insert(data, {
    ["title"] = "Thịnh hành",
    ["script"] = "rank.lua",
    ["input"] = "https://vtruyen.com/bang-xep-hang?rank_type=6"
})

table.insert(data, {
    ["title"] = "Đọc nhiều",
    ["script"] = "rank.lua",
    ["input"] = "https://vtruyen.com/bang-xep-hang?rank_type=1&period=2"
})

table.insert(data, {
    ["title"] = "Tặng thưởng",
    ["script"] = "rank.lua",
    ["input"] = "https://vtruyen.com/bang-xep-hang?rank_type=5&period=2"
})

table.insert(data, {
    ["title"] = "Đề cử",
    ["script"] = "rank.lua",
    ["input"] = "https://vtruyen.com/bang-xep-hang?rank_type=2&period=2"
})

table.insert(data, {
    ["title"] = "Yêu thích",
    ["script"] = "rank.lua",
    ["input"] = "https://vtruyen.com/bang-xep-hang?rank_type=4&period=2"
})

table.insert(data, {
    ["title"] = "Thảo luận",
    ["script"] = "rank.lua",
    ["input"] = "https://vtruyen.com/bang-xep-hang?rank_type=3&period=2"
})

return response:success(data)
