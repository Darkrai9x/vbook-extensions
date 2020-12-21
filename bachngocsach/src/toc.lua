local url = ...

local doc = http:get(url):html()
if doc ~= nil then
    local list = {}
    local el = doc:select(".view-content .mucluc-chuong a")
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local chap = {}
        chap["name"] = e:text()
        chap["url"] = e:attr("href")
        chap["host"] = "http://bachngocsach.com"
        table.insert(list, chap)
    end
    return response:success(list)
end
return nil