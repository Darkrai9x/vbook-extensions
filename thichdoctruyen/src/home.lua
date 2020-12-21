local data = {}
table.insert(data, {
    ["title"] = "Truyện mới",
    ["script"] = "gen.lua",
    ["input"] = "https://thichdoctruyen.com/the-loai/truyen-moi"
})
table.insert(data, {
    ["title"] = "Truyện hot",
    ["script"] = "gen.lua",
    ["input"] = "https://thichdoctruyen.com/the-loai/truyen-hot"
})

table.insert(data, {
    ["title"] = "Truyện full",
    ["script"] = "gen.lua",
    ["input"] = "https://thichdoctruyen.com/the-loai/truyen-full"
})

table.insert(data, {
    ["title"] = "Ngôn tình",
    ["script"] = "gen.lua",
    ["input"] = "https://thichdoctruyen.com/the-loai/ngon-tinh"
})

table.insert(data, {
    ["title"] = "Truyện teen",
    ["script"] = "gen.lua",
    ["input"] = "https://thichdoctruyen.com/the-loai/truyen-teen"
})

return response:success(data)
