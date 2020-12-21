local data = {}

local tab1 = {
    ["title"] = "Thịnh hành",
    ["script"] = "gen.lua",
    ["input"] = "_wp_manga_week_views"
}
table.insert(data, tab1)

local tab2 = {
    ["title"] = "Xếp hạng",
    ["script"] = "gen.lua",
    ["input"] = "_manga_avarage_reviews"
}
table.insert(data, tab2)

local tab3 = {
    ["title"] = "Đọc nhiều",
    ["script"] = "gen.lua",
    ["input"] = "_wp_manga_views"
}
table.insert(data, tab3)

local tab4 = {
    ["title"] = "Mới cập nhật",
    ["script"] = "gen.lua",
    ["input"] = "_latest_update"
}
table.insert(data, tab4)

return response:success(data)
