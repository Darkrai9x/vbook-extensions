local data = {}

local tab1 = {}
tab1["title"] = "Mới cập nhật"
tab1["script"] = "gen.lua"
tab1["input"] = "https://truyenyy.vip/truyen-moi-cap-nhat/"
table.insert(data, tab1)

local tab2 = {}
tab2["title"] = "Đọc nhiều"
tab2["script"] = "gen.lua"
tab2["input"] = "https://truyenyy.vip/kim-thanh-bang/top/doc-nhieu-trong-tuan/"
table.insert(data, tab2)

local tab3 = {}
tab3["title"] = "Đề cử"
tab3["script"] = "gen.lua"
tab3["input"] = "https://truyenyy.vip/kim-thanh-bang/top/truyen-de-cu/"
table.insert(data, tab3)

local tab4 = {}
tab4["title"] = "Bình luận nhiều"
tab4["script"] = "gen.lua"
tab4["input"] = "https://truyenyy.vip/kim-thanh-bang/top/truyen-binh-luan-soi-noi/"
table.insert(data, tab4)

return response:success(data)
