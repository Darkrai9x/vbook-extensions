local key, page = ...
if text:is_empty(page) then
    page = "1"
end
local doc = http:get("https://ln.hako.re/tim-kiem"):params({["keywords"] = key, ["page"] = page}):html()

if doc ~= nil then
    local el = doc:select(".sect-body .thumb-item-flow")
    local novelList = {}
    local next = doc:select(".pagination-footer a.current + a"):text()

    for i = 1, el:size() do
        local e = el:get(i - 1)
        local novel = {}
        novel["name"] = e:select(".series-title a"):text()
        novel["link"] = e:select(".series-title a"):attr("href")
        novel["description"] = e:select(".chapter-title"):text()
        novel["cover"] = e:select(".img-in-ratio"):attr("data-bg")
        novel["host"] = "https://ln.hako.re"
        table.insert(novelList, novel)
    end
    return response:success(novelList, next)
end

return nil
