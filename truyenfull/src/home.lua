local data = {}

local dich = {}
dich["title"] = "Truyện Mới"
dich["script"] = "gen.lua"
dich["input"] = "https://truyenfull.vn/danh-sach/truyen-moi/"
table.insert(data, dich)

local convert = {}
convert["title"] = "Truyện Hot"
convert["script"] = "gen.lua"
convert["input"] = "https://truyenfull.vn/danh-sach/truyen-hot/"
table.insert(data, convert)

local suu = {}
suu["title"] = "Truyện Full"
suu["script"] = "gen.lua"
suu["input"] = "https://truyenfull.vn/danh-sach/truyen-full/"
table.insert(data, suu)

return response:success(data)
