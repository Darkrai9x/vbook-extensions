local data = {}

table.insert(data, {
    ["title"] = "Mới cập nhật",
    ["script"] = "news.lua",
    ["input"] = "https://www.medoctruyentranh.net/de-xuat/cap-nhat-moi/2"
})

table.insert(data, {
    ["title"] = "Tác phẩm mới",
    ["script"] = "news.lua",
    ["input"] = "https://www.medoctruyentranh.net/de-xuat/tac-pham-moi/20"
})

table.insert(data, {
    ["title"] = "Đề xuất mới",
    ["script"] = "news.lua",
    ["input"] = "https://www.medoctruyentranh.net/de-xuat/de-xuat-truyen-moi/37"
})

return response:success(data)
