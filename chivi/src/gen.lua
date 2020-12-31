local url, page = ...

if text:is_empty(page) then
    page = 1
end
local doc = http:get(url .. "/?page=" .. page):html()

if doc ~= nil then
    local el = doc:select(".list .book")
    local novelList = {}
    local next = doc:select(".pagi"):select('a._primary + a'):text()
    for i = 1, el:size() do
        local e = el:get(i - 1)
        local novel = {}
        novel["name"] = e:select(".title"):text()
        novel["link"] = e:select("a"):attr("href")
        novel["description"] = e:select(".genre"):text()
        novel["cover"] = e:select("img"):attr("src")
        novel["host"] = "https://chivi.xyz"
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end
