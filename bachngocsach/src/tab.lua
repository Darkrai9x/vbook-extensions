local url, page = ...
if text:is_empty(page) then
    page = 0
end
local doc = http:get(url .. "?page=" .. page):html()
if doc ~= nil then
    local el = doc:select("ul.content-grid > li > div")
    local list = {}
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local item = {}
        item["name"] = e:select("div.recent-truyen a"):text()
        item["link"] = e:select("div.recent-truyen a"):attr("href")
        item["cover"] = e:select("div.recent-anhbia img"):attr("src")
        item["description"] = e:select("div.recent-chuong a"):text()
        item["host"] = "https://bachngocsach.com"
        table.insert(list, item)
    end

    local pageNext = regexp:find_last(doc:select("li.pager-next > a"):attr("href"), "page=(\\d+)")
    return response:success(list, pageNext)
end
return nil