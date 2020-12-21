local data = {}

table.insert(data, {
    ["title"] = "Mới cập nhật",
    ["script"] = "news.lua",
    ["input"] = "https://gacsach.com"
})

return response:success(data)
