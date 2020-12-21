local url, page = ...

if text:is_empty(page) then
    page = 1
end
local doc = http:get(text:replace(url, "truyenyy.com", "truyenyy.vn") .. "/?page=" .. page):html()

if doc ~= nil then
    local el = doc:select(".books-list > li")
    local novelList = {}
    local next

    local last = doc:select(".pagination > li > a"):last()
    if last ~= nil then
        next = regexp:find(last:attr("href"), "page=(\\d+)")
    end
    for i = 1, el:size() do
        local e = el:get(i - 1)
        local novel = {}
        novel["name"] = e:select(".book-title"):text()
        novel["link"] = e:select("a"):first():attr("href")
        novel["description"] = e:select(".book-author"):text()

        local cover = e:select("img"):first():attr("data-src")
        if string.len(cover) == 0 then
            cover = regexp:find_last(e:html(), "(http.*?.jpg)")
        end
        novel["cover"] = cover
        novel["host"] = "https://truyenyy.vn"
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end

return nil