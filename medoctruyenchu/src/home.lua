local data = {}

table.insert(data, {
    ["title"] = "Mới cập nhật",
    ["script"] = "news.lua",
    ["input"] = "https://www.medoctruyenchu.net/de-xuat/cap-nhat-moi/2"
})

table.insert(data, {
    ["title"] = "Truyện Hot",
    ["script"] = "news.lua",
    ["input"] = "https://www.medoctruyenchu.net/de-xuat/cap-nhat-hot/11"
})

table.insert(data, {
    ["title"] = "Truyện Full",
    ["script"] = "news.lua",
    ["input"] = "https://www.medoctruyenchu.net/de-xuat/truyen-full-de-cu/12"
})

table.insert(data, {
    ["title"] = "vừa kết thúc",
    ["script"] = "news.lua",
    ["input"] = "https://www.medoctruyenchu.net/de-xuat/truyen-vua-ket-thuc/21"
})

return response:success(data)
