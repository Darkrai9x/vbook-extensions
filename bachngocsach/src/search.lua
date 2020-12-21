local key, page = ...
if text:is_empty(page) then
    page = 0
end
local doc = http:get("https://bachngocsach.com/reader/search?ten=" .. key .. "&page=" .. page):html()

if doc ~= nil then
    local pageNext = regexp:find_last(doc:select("li.pager-next > a"):attr("href"), "page=(\\d+)")
    local el = doc:select("div.view-content"):select("li.search-row")
    local list = {}
    if el ~= nil then
        for i = 0, el:size() - 1 do
            local e = el:get(i)
            local item = {}
            item["name"] = e:select("div.search-truyen a"):text()
            item["link"] = e:select("div.search-truyen a"):attr("href")
            item["cover"] = e:select("div.search-anhbia img"):attr("src")
            item["description"] = e:select("div.search-tacgia a"):text()
            item["host"] = "https://bachngocsach.com"
            table.insert(list, item)
        end
    end
    return response:success(list, pageNext)
end

return nil
