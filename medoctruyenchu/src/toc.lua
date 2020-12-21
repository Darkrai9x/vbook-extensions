local url = ...

local doc = http:get(url):html()
if doc ~= nil then
    local list = {}
    local el = doc:select(".chapter_pages a")
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local chap = {
            ["name"] = e:text(),
            ["url"] = e:attr("href"),
            ["host"] = "https://www.medoctruyenchu.net",
        }
        table.insert(list, chap)
    end
    return response:success(list)
end
return nil