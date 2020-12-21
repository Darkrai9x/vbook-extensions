local key, page = ...
if text:is_empty(page) then
    page = '0'
end
local doc = http:get("https://gacsach.com/find-book"):params({
    ["title"] = key,
    ["page"] = page
}):html()

if doc ~= nil then
    local el = doc:select(".view-content a")
    local novelList = {}
    local next

    local last = doc:select(".pager li.pager-current + li"):last()
    if last ~= nil then
        next = last:select("a"):text()
    end
    for i = 1, el:size() do
        local e = el:get(i - 1)
        local novel = {}
        novel["name"] = e:text()
        novel["link"] = e:attr("href")
        novel["host"] = "https://gacsach.com"
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end

return nil
