local url, page = ...

if text:is_empty(page) then
    page = 0
end
local doc = http:get(url .. "/?page=" .. page):html()

if doc ~= nil then
    local el = doc:select(".view-content .term-row")
    local novelList = {}
    local next

    local last = doc:select(".pager-next"):last()
    if last ~= nil then
        next = regexp:find(last:select("a"):attr("href"), "page=(\\d+)")
    end
    for i = 1, el:size() do
        local e = el:get(i - 1)
        local novel = {}
        novel["name"] = e:select("a.term-truyen-a"):text()
        novel["link"] = e:select("a.term-truyen-a"):attr("href")
        novel["description"] = e:select(".term-tacgia"):text()
        novel["cover"] = e:select(".term-anhbia-a > img"):attr("src")
        novel["host"] = "https://bachngocsach.com"
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end