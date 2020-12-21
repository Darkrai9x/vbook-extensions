local url = ...
local list = {}
local el
if (text:contains(url, "truyenvkl.com")) then
    local doc = http:get(url):html()
    el = doc:select(".listchap"):last():select("li a")
else
    local doc = http:post("https://truyenvkl.com/wp-admin/admin-ajax.php"):params({ ["action"] = "all_chap", ["id"] = url }):html()
    el = doc:select("a")
end
if el ~= nil then
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local chap = {}
        chap["name"] = e:text()
        chap["url"] = e:attr("href")
        chap["host"] = "https://truyenvkl.com"
        table.insert(list, chap)
    end
    return response:success(list)
end
return nil