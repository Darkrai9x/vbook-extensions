local url, page = ...

if text:is_empty(page) then
    page = 1
end
local doc = http:get(url .. "/page/" .. page):html()
if doc ~= nil then
    local el = doc:select(".theloai-thumlist li")
    local novelList = {}
    local next = num:to_int(doc:select(".pagination li.active + li"):text(), 1)
    local current = num:to_int(page, 1)

    if current >= next then
        next = ""
    end
    for i = 1, el:size() do
        local e = el:get(i - 1)
        local novel = {}
        local cover = e:select(".thumbnail img"):attr("data-src")
        if text:is_empty(page) then
            cover = e:select(".thumbnail img"):attr("src")
        end
        novel["name"] = e:select("h2"):text()
        novel["link"] = e:select("h2 a"):attr("href")
        novel["description"] = e:select(".content p"):first():text()
        novel["cover"] = cover
        novel["host"] = "https://truyenvkl.com"
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end

return nil