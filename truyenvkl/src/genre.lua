local doc = html:parse("<a href=\"/keyword/bach-hop\">Bách Hợp</a><a href=\"/keyword/co-dai\">Cổ Đại</a><a href=\"/keyword/di-gioi\">Dị Giới</a><a href=\"/keyword/di-nang\">Dị Năng</a><a href=\"/keyword/huyen-huyen\">Huyền Huyễn</a><a href=\"/keyword/hai-huoc\">Hài Hước</a><a href=\"/keyword/hac-bang\">Hắc Bang</a><a href=\"/keyword/he-thong\">Hệ Thống</a><a href=\"/keyword/khoa-huyen\">Khoa Huyễn</a><a href=\"/keyword/kiem-hiep\">Kiếm Hiệp</a><a href=\"/keyword/ky-huyen\">Kỳ Huyễn</a><a href=\"/keyword/linh-di\">Linh Dị</a><a href=\"/keyword/mat-the\">Mạt Thế</a><a href=\"/keyword/ngon-tinh\">Ngôn Tình</a><a href=\"/keyword/nguoc\">Ngược</a><a href=\"/keyword/phuong-tay\">Phương Tây</a><a href=\"/keyword/quan-truong\">Quan Trường</a><a href=\"/keyword/quan-nhan\">Quân Nhân</a><a href=\"/keyword/showbiz\">Showbiz</a><a href=\"/keyword/sac\">Sắc</a><a href=\"/keyword/sung\">Sủng</a><a href=\"/keyword/tien-hiep\">Tiên Hiệp</a><a href=\"/keyword/trinh-tham\">Trinh Thám</a><a href=\"/keyword/truyen-sex\">Truyện 18+</a><a href=\"/keyword/gay\">Truyện Gay</a><a href=\"/keyword/les\">Truyện Les</a><a href=\"/keyword/teen\">Truyện Teen</a><a href=\"/keyword/truyen-tranh\">Truyện Tranh</a><a href=\"/keyword/voz\">Truyện Voz</a><a href=\"/keyword/trong-sinh\">Trọng Sinh</a><a href=\"/keyword/vong-du\">Võng Du</a><a href=\"/keyword/xuyen-khong\">Xuyên Không</a><a href=\"/keyword/zombie\">Zombie</a><a href=\"/keyword/dam-my\">Đam Mỹ</a><a href=\"/keyword/do-thi\">Đô Thị</a><a href=\"/keyword/dong-nhan\">Đồng Nhân</a>")
local genre = {}
if doc ~= nil then
    local el = doc:select("a")
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local link = {}
        link["title"] = e:text()
        link["input"] = "https://truyenvkl.com" .. e:attr("href")
        link["script"] = "gen.lua"
        table.insert(genre, link)
    end
    return response:success(genre)
end

return nil