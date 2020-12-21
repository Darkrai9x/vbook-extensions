local data = {}

table.insert(data, {
    ["title"] = "Mới cập nhật",
    ["script"] = "gen.lua",
    ["input"] = "https://www.wattpad.com/api/v3/stories?filter=new"
}
)

return response:success(data)
