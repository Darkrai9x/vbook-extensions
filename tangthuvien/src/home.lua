local data = {}

local tab1 = {}
tab1["title"] = "Xem nhiều"
tab1["script"] = "gen.lua"
tab1["input"] = "https://truyen.tangthuvien.vn/tong-hop?rank=vw"
table.insert(data, tab1)

local tab2 = {}
tab2["title"] = "Đề cử"
tab2["script"] = "gen.lua"
tab2["input"] = "https://truyen.tangthuvien.vn/tong-hop?rank=nm"
table.insert(data, tab2)

local tab3 = {}
tab3["title"] = "Bình luận nhiều"
tab3["script"] = "gen.lua"
tab3["input"] = "https://truyen.tangthuvien.vn/tong-hop?rank=bl"
table.insert(data, tab3)

local tab4 = {}
tab4["title"] = "Theo dõi nhiều"
tab4["script"] = "gen.lua"
tab4["input"] = "https://truyen.tangthuvien.vn/tong-hop?rank=td"
table.insert(data, tab4)

return response:success(data)
