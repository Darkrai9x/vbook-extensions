local data = {}

local tab1 = {
    ["title"] = "Home",
    ["script"] = "news.lua",
    ["input"] = "https://blogtruyen.vn/thumb"
}
table.insert(data, tab1)

return response:success(data)
