local data = {}

table.insert(data, {
    ["title"] = "Mới cập nhật",
    ["script"] = "gen.lua",
    ["input"] = "https://ln.hako.re/danh-sach?truyendich=1&sangtac=1&convert=1&dangtienhanh=1&tamngung=1&hoanthanh=1&sapxep=capnhat"
})
table.insert(data, {
    ["title"] = "Truyện mới",
    ["script"] = "gen.lua",
    ["input"] = "https://ln.hako.re/danh-sach?truyendich=1&sangtac=1&convert=1&dangtienhanh=1&tamngung=1&hoanthanh=1&sapxep=truyenmoi"
})

table.insert(data, {
    ["title"] = "Theo dõi",
    ["script"] = "gen.lua",
    ["input"] = "https://ln.hako.re/danh-sach?truyendich=1&sangtac=1&convert=1&dangtienhanh=1&tamngung=1&hoanthanh=1&sapxep=theodoi"
})

table.insert(data, {
    ["title"] = "Top toàn thời gian",
    ["script"] = "gen.lua",
    ["input"] = "https://ln.hako.re/danh-sach?truyendich=1&sangtac=1&convert=1&dangtienhanh=1&tamngung=1&hoanthanh=1&sapxep=top"
})

table.insert(data, {
    ["title"] = "Top tháng",
    ["script"] = "gen.lua",
    ["input"] = "https://ln.hako.re/danh-sach?truyendich=1&sangtac=1&convert=1&dangtienhanh=1&tamngung=1&hoanthanh=1&sapxep=topthang"
})

return response:success(data)
