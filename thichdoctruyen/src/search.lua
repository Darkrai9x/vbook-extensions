local key, page = ...

if text:is_empty(page) then
    page = '1'
end
local doc = http:get("https://thichdoctruyen.com/tim-truyen/search.php"):params({ ["keysearch"] = key, ["page"] = page }):html()

if doc ~= nil then
    local el = doc:select(".tabtruyen tr")
    local novelList = {}
    local next = doc:select(".phantrangactive + a"):first():text()
    for i = 1, el:size() do
        local e = el:get(i - 1)
        html:remove(e, { ".fullicon" })
        local novel = {}
        local name = e:select(".tabtruyen-name"):text()
        if not text:is_empty(name) then
            novel["name"] = e:select(".tabtruyen-name"):text()
            novel["link"] = e:select("a"):first():attr("href")
            novel["description"] = e:select("td"):last():text()
            novel["cover"] = e:select(".tabtruyen-img"):attr("src")
            novel["host"] = "https://thichdoctruyen.com"
            table.insert(novelList, novel)
        end
    end

    return response:success(novelList, next)
end

return nil