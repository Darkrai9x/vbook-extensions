local data = {}

local hot = {}
hot["title"] = "Truyện Hot"
hot["script"] = "hot.lua"
hot["input"] = "https://truyenvkl.com/tim-kiem/hot/"
table.insert(data, hot)

return response:success(data)
