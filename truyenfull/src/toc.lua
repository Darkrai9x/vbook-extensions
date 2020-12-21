local url = ...
local list = {}
local js = http:get(url):table()
if js ~= nil then
    local doc = html:parse(js["chap_list"])
    local el = doc:select(".list-chapter li a")
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local chap = {}
        chap["name"] = e:text()
        chap["url"] = e:attr("href")
        chap["host"] = "http://truyenfull.vn"
        table.insert(list, chap)
    end
    return response:success(list)
end
return nil