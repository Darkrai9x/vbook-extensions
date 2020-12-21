local htm = "<a href=\"toan-bo\">Toàn bộ</a><a href=\"ngon-tinh\">Ngôn Tình</a><a href=\"truyen-teen\">Truyện Teen</a><a href=\"tien-hiep\">Tiên Hiệp</a><a href=\"kiem-hiep\">Kiếm Hiệp</a><a href=\"sac-hiep\">Sắc Hiệp</a><a href=\"do-thi\">Đô Thị</a><a href=\"quan-su\">Quân Sự</a><a href=\"lich-su\">Lịch Sử</a><a href=\"xuyen-khong\">Xuyên Không</a><a href=\"truyen-ma\">Truyện Ma</a><a href=\"trinh-tham\">Trinh Thám</a><a href=\"huyen-huyen\">Huyền Huyễn</a><a href=\"khoa-huyen\">Khoa Huyễn</a><a href=\"vong-du\">Võng Du</a><a href=\"di-gioi\">Dị Giới</a><a href=\"trong-sinh\">Trọng Sinh</a><a href=\"dam-my\">Đam Mỹ</a><a href=\"nu-cuong\">Nữ Cường</a><a href=\"nu-phu\">Nữ Phụ</a><a href=\"bach-hop\">Bách Hợp</a><a href=\"novels\">Novels</a>"
local el = html:parse(htm):select("a")
local genre = {}
for i = 0, el:size() - 1 do
    local e = el:get(i)
    table.insert(genre, { ["title"] = e:text(), ["input"] = "https://www.medoctruyenchu.net/tim-truyen/" .. e:attr("href"), ["script"] = "gen.lua" })
end

return response:success(genre)