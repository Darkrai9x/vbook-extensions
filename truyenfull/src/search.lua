local key, page = ...
if text:is_empty(page) then
    page = 1
end
local doc = http:get("https://truyenfull.vn/tim-kiem/?tukhoa=" .. key .. "&page=" .. page):html()

if doc ~= nil then
    local el = doc:select(".list-truyen div[itemscope]")
    local novelList = {}
    local next

    local last = doc:select(".pagination"):last()
    if last ~= nil then
        next = regexp:find(last:html(), "trang-(\\d+).*?glyphicon-menu-right")
    end
    for i = 1, el:size() do
        local e = el:get(i - 1)
        local novel = {}
        novel["name"] = e:select(".truyen-title > a"):text()
        novel["link"] = e:select(".truyen-title > a"):attr("href")
        novel["description"] = e:select(".author"):text()
        novel["cover"] = e:select("[data-image]"):attr("data-image")
        novel["host"] = "https://truyenfull.vn"
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end

return nil
