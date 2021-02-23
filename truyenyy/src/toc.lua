local url = ...
local new_url = text:replace(url, "truyenyy.com", "truyenyy.vip")
new_url = text:replace(new_url, "truyenyy.vn", "truyenyy.vip")
local doc = http:get(new_url):timeout(0):html()
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
        chap["host"] = "https://truyenyy.vip"
        table.insert(list, chap)
    end
    return response:success(list)
end
return nil