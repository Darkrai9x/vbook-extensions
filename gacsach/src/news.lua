local doc = http:get("https://gacsach.com"):html()

if doc ~= nil then
    local el = doc:select(".sachmoi .view-content .views-row")
    local novelList = {}
    for i = 1, el:size() do
        local e = el:get(i - 1)
        local novel = {}
        novel["name"] = e:select(".smtitle"):first():select("a"):text()
        novel["link"] = e:select(".smimg"):first():select("a"):attr("href")
        novel["cover"] = e:select(".smimg"):first():select("a img"):attr("src")
        novel["description"] = e:select(".smauthor"):text()
        novel["host"] = "https://gacsach.com"
        table.insert(novelList, novel)
    end

    return response:success(novelList)
end

return nil