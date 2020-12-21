local data = {}

local tab1 = {
    ["title"] = "Mới cập nhật",
    ["script"] = "gen.lua",
    ["input"] = "http://truyenqq.com/truyen-moi-cap-nhat.html"
}
table.insert(data, tab1)

local tab2 = {
    ["title"] = "Con trai",
    ["script"] = "gen.lua",
    ["input"] = "http://truyenqq.com/truyen-con-trai.html"
}
table.insert(data, tab2)

local tab3 = {
    ["title"] = "Con gái",
    ["script"] = "gen.lua",
    ["input"] = "http://truyenqq.com/truyen-con-gai.html"
}
table.insert(data, tab3)

return response:success(data)
