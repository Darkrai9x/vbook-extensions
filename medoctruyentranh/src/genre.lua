local htm = "<a href=\"toan-bo\">Toàn bộ</a><a href=\"xuyen-khong\">Xuyên không</a><a href=\"manhua\">Manhua</a><a href=\"co-dai\">Cổ Đại</a><a href=\"action\">Action</a><a href=\"dam-my\">Đam Mỹ</a><a href=\"manga\">Manga</a><a href=\"adventure\">Adventure</a><a href=\"comedy\">Comedy</a><a href=\"cooking\">Cooking</a><a href=\"comic\">Comic</a><a href=\"drama\">Drama</a>"
local el = html:parse(htm):select("a")
local genre = {}
for i = 0, el:size() - 1 do
    local e = el:get(i)
    table.insert(genre, { ["title"] = e:text(), ["input"] = "https://www.medoctruyentranh.net/tim-truyen/" .. e:attr("href"), ["script"] = "gen.lua" })
end

return response:success(genre)