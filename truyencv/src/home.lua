local data = {}

local tab1 = {}
tab1["title"] = "Truyện Mới"
tab1["script"] = "gen.lua"
tab1["input"] = "https://truyencv.com/danh-sach/moi-cap-nhat/"
table.insert(data, tab1)

local tab2 = {}
tab2["title"] = "Hoàn thành"
tab2["script"] = "gen.lua"
tab2["input"] = "https://truyencv.com/danh-sach/hoan-thanh/"
table.insert(data, tab2)

local tab3 = {}
tab3["title"] = "Đề cử"
tab3["script"] = "gen.lua"
tab3["input"] = "https://truyencv.com/danh-sach/truyen-de-cu/"
table.insert(data, tab3)

local tab4 = {}
tab4["title"] = "Sáng tác"
tab4["script"] = "gen.lua"
tab4["input"] = "https://truyencv.com/danh-sach/sang-tac/"
table.insert(data, tab4)

return response:success(data)
