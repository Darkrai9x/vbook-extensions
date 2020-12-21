
local doc = html:parse("<a href=\"/truyen?\">Tất cả</a><a href=\"/truyen?genre=10\">Hiện Đại Ngôn Tình</a><a href=\"/truyen?genre=13\">Huyền Huyễn Ngôn Tình</a><a href=\"/truyen?genre=14\">Tiên Hiệp Kỳ Duyên</a><a href=\"/truyen?genre=15\">Cổ Đại Ngôn Tình</a><a href=\"/truyen?genre=16\">Huyền Nghi Thần Quái</a><a href=\"/truyen?genre=17\">Khoa Huyễn Không Gian</a><a href=\"/truyen?genre=18\">Lãng Mạn Thanh Xuân</a>")
local genre = {}
if doc ~= nil then
    local el = doc:select("a")
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local link = {}
        link["title"] = e:text()
        link["input"] = "https://nuhiep.com" .. e:attr("href")
        link["script"] = "gen.lua"
        table.insert(genre, link)
    end
    return response:success(genre)
end

return nil