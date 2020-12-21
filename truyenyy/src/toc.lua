local url = ...
local doc = http:get(text:replace(url, "truyenyy.com", "truyenyy.vn")):timeout(0):html()
if doc ~= nil then
    local list = {}
    local el = doc:select("tbody tr")
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local ch = e:select("td"):first():text()
        ch = ch .. ": " .. e:select("td"):get(1):text()
        local chap = {}
        chap["name"] = ch
        chap["url"] =  e:select("a"):first():attr("href")
        chap["host"] = "https://truyenyy.vn"
        table.insert(list, chap)
    end
    return response:success(list)
end
return nil