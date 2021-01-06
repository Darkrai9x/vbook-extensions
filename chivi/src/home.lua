local data = {}

local tab1 = {
    ["title"] = "Vừa xem",
    ["script"] = "gen.lua",
    ["input"] = "https://chivi.xyz/api/books?"
}
table.insert(data, tab1)

local tab2 = {
    ["title"] = "Đổi mới",
    ["script"] = "gen.lua",
    ["input"] = "https://chivi.xyz/api/books?order=update&"
}
table.insert(data, tab2)

local tab3 = {
    ["title"] = "Đánh giá",
    ["script"] = "gen.lua",
    ["input"] = "https://chivi.xyz/api/books?order=rating&"
}
table.insert(data, tab3)

local tab4 = {
    ["title"] = "Tổng hợp",
    ["script"] = "gen.lua",
    ["input"] = "https://chivi.xyz/api/books?order=weight&"
}
table.insert(data, tab4)

return response:success(data)
