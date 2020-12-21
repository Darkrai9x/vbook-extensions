local url = ...
local list = {}
local doc = http:get(url):html()
if doc ~= nil then
    html:remove(doc, {".phantranga", "thead"})
    local el = doc:select("#dschuong a")

    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local chap = {}
        chap["name"] = e:text()
        chap["url"] = e:attr("href")
        chap["host"] = "http://thichdoctruyen.com"
        table.insert(list, chap)
    end
    return response:success(list)
end
return nil