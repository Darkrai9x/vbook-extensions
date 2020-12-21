local url, page = ...
if text:is_empty(page) then
    page = 1
end
local doc = http:get(url .. "/trang-" .. page):html()
if doc ~= nil then
    local el = doc:select(".truyencv-main .truyencv-section"):last():select("ul.list-group > li")
    local list = {}
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local item = {}
        item["name"] = e:select(".info > .title > a"):text()
        item["link"] = e:select(".info > .title > a"):attr("href")
        item["cover"] = text:replace(e:select("img"):first():attr("src"), "30x40", "100x150")
        item["description"] = e:select(".author"):text()
        item["host"] = "https://truyencv.com"
        table.insert(list, item)
    end

    local pageNext = doc:select("li.active + li"):text()
    if not num:is_int(pageNext) then
        pageNext = ""
    end
    return response:success(list, pageNext)
end
return nil