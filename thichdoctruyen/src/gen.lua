local url, page = ...

if text:is_empty(page) then
    page = '1'
end
local doc = http:get(url .. "/page" .. page):html()

if doc ~= nil then
    local el = doc:select(".tabtruyen [itemtype]")
    local novelList = {}
    local next = doc:select(".phantrangactive + a"):first():text()
    for i = 1, el:size() do
        local e = el:get(i - 1)
        html:remove(e, {".fullicon"})
        local novel = {}
        novel["name"] = e:select(".tabtruyen-name"):text()
        novel["link"] = e:select("a"):first():attr("href")
        novel["description"] = e:select("[itemprop=author]"):text()
        novel["cover"] = e:select(".tabtruyen-img"):attr("src")
        novel["host"] = "https://thichdoctruyen.com"
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end

return nil