local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local list = {}
    local sections = doc:select(".volume-list")
    local sectionCount = sections:size()
    for i = 0, sectionCount - 1 do
        local section = sections:get(i)
        local sectionName = section:select(".sect-title"):text()
        local chapters = section:select(".list-chapters li")

        for j = 0, chapters:size() - 1 do
            local chapter = chapters:get(j)
            local chap = {}
            local name = chapter:select(".chapter-name a"):text()
            if j == 0 then
                name = sectionName .. " " .. name
            end
            chap["name"] = name
            chap["url"] = chapter:select(".chapter-name"):select("a"):first():attr("href")
            chap["host"] = "https://ln.hako.re"
            table.insert(list, chap)
        end

    end
    return response:success(list)
end
return nil