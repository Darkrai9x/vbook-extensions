local url, page = ...

if text:is_empty(page) then
    page = 1
end
local doc = http:get(url .. "&page=" .. page):html()

if doc ~= nil then
    local el = doc:select("#rank-view-list ul li")
    local novelList = {}
    local next

    local last = doc:select("ul.pagination > li > a"):last()
    if last ~= nil then
        next = regexp:find(last:attr("href"), "page=(\\d+)")
    end
    for i = 1, el:size() do
        local e = el:get(i - 1)
        local novel = {}
        novel["name"] = e:select("h4 > a"):text()
        novel["link"] = e:select("h4 > a"):attr("href")
        novel["description"] = e:select(".author"):text()
        novel["cover"] = e:select("img"):first():attr("src")
        novel["host"] = "https://truyen.tangthuvien.vn"
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end

return nil