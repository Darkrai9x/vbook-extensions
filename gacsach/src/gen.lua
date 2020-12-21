local url, page = ...

if text:is_empty(page) then
    page = "0"
end
local doc = http:get(url .. "?page=" .. page):html()

if doc ~= nil then
    local el = doc:select(".view-content tbody tr")
    local novelList = {}
    local next

    local last = doc:select(".pager li.pager-current + li"):last()
    if last ~= nil then
        next = regexp:find(last:select("a"):attr("href"), "page=(\\d+)")
    end
    for i = 1, el:size() do
        local e = el:get(i - 1)
        local novel = {}
        novel["name"] = e:select(".tvtitle a"):text()
        novel["link"] = e:select(".tvtitle a"):attr("href")
        novel["description"] = e:select(".tvauthor"):text()
        novel["host"] = "https://gacsach.com"
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end

return nil