local doc = html:parse("<a href=\"action-26.html\">Action</a><a href=\"adult-68.html\">Adult</a><a href=\"adventure-27.html\">Adventure</a><a href=\"anime-62.html\">Anime</a><a href=\"chuyen-sinh-91.html\">Chuyển Sinh</a><a href=\"co-dai-90.html\">Cổ Đại</a><a href=\"comedy-28.html\">Comedy</a><a href=\"comic-60.html\">Comic</a><a href=\"demons-99.html\">Demons</a><a href=\"detective-100.html\">Detective</a><a href=\"doujinshi-96.html\">Doujinshi</a><a href=\"drama-29.html\">Drama</a><a href=\"dam-my-93.html\">Đam Mỹ</a><a href=\"ecchi-50.html\">Ecchi</a><a href=\"fantasy-30.html\">Fantasy</a><a href=\"gender-bender-45.html\">Gender Bender</a><a href=\"harem-47.html\">Harem</a><a href=\"historical-51.html\">Historical</a><a href=\"horror-44.html\">Horror</a><a href=\"huyen-huyen-468.html\">Huyền Huyễn</a><a href=\"isekai-85.html\">Isekai</a><a href=\"josei-54.html\">Josei</a><a href=\"mafia-69.html\">Mafia</a><a href=\"magic-58.html\">Magic</a><a href=\"manhua-35.html\">Manhua</a><a href=\"manhwa-49.html\">Manhwa</a><a href=\"martial-arts-41.html\">Martial Arts</a><a href=\"mature-48.html\">Mature</a><a href=\"military-101.html\">Military</a><a href=\"mystery-39.html\">Mystery</a><a href=\"ngon-tinh-87.html\">Ngôn Tình</a><a href=\"one-shot-95.html\">One shot</a><a href=\"psychological-40.html\">Psychological</a><a href=\"romance-36.html\">Romance</a><a href=\"school-life-37.html\">School Life</a><a href=\"sci-fi-43.html\">Sci-fi</a><a href=\"seinen-42.html\">Seinen</a><a href=\"shoujo-38.html\">Shoujo</a><a href=\"shoujo-ai-98.html\">Shoujo Ai</a><a href=\"shounen-31.html\">Shounen</a><a href=\"shounen-ai-86.html\">Shounen Ai</a><a href=\"slice-of-life-46.html\">Slice of life</a><a href=\"smut-97.html\">Smut</a><a href=\"sports-57.html\">Sports</a><a href=\"supernatural-32.html\">Supernatural</a><a href=\"tragedy-52.html\">Tragedy</a><a href=\"trong-sinh-82.html\">Trọng Sinh</a><a href=\"truyen-mau-92.html\">Truyện Màu</a><a href=\"webtoon-55.html\">Webtoon</a><a href=\"xuyen-khong-88.html\">Xuyên Không</a><a href=\"yaoi-70.html\">Yaoi</a><a href=\"yuri-75.html\">Yuri</a>")
local genre = {}
if doc ~= nil then
    local el = doc:select("a")
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local link = {
            ["title"] = e:text(),
            ["input"] = "http://truyenqq.com/the-loai/" .. e:attr("href"),
            ["script"] = "gen.lua"
        }
        table.insert(genre, link)
    end
    return response:success(genre)
end

return nil