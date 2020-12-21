local doc = html:parse("<a href=\"tien-hiep\">Tiên Hiệp</a><a href=\"kiem-hiep\">Kiếm Hiệp</a><a href=\"do-thi\">Đô Thị</a><a href=\"huyen-ao\">Huyền Ảo</a><a href=\"ngon-tinh\">Ngôn Tình</a><a href=\"di-nang\">Dị Năng</a><a href=\"vong-du\">Võng Du</a><a href=\"di-gioi\">Dị Giới</a><a href=\"khoa-huyen\">Khoa Huyễn</a><a href=\"quan-su\">Quân Sự</a><a href=\"lich-su\">Lịch Sử</a><a href=\"xuyen-khong\">Xuyên Không</a><a href=\"trung-sinh\">Trùng Sinh</a><a href=\"canh-ky\">Cạnh Kỹ</a><a href=\"dong-nhan\">Đồng Nhân</a><a href=\"linh-di\">Linh Dị</a><a href=\"mat-the\">Mạt Thế</a><a href=\"nu-hiep\">Nữ Hiệp</a>")
local genre = {}
if doc ~= nil then
    local el = doc:select("a")
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local link = {}
        link["title"] = e:text()
        link["input"] = "https://truyencv.com/" .. e:attr("href")
        link["script"] = "gen.lua"
        table.insert(genre, link)
    end
    return response:success(genre)
end

return nil