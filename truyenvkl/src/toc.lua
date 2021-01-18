local url = ...
local list = {}
local el
if (text:contains(url, "truyenvkl.com")) then
    local doc = http:get(url):html()
    el = doc:select(".listchap"):last():select("li a")
else
    local doc = http:get("https://truyenvkl.com" .. url):html()
    local bookId = doc:select("#views"):attr("data-id")
    local ajaxDoc = http:post("https://truyenvkl.com/wp-admin/admin-ajax.php"):params({ ["action"] = "all_chap", ["id"] = bookId }):html()
    el = ajaxDoc:select("a")
    if el:isEmpty() then
        local page = num:to_int(regexp:find(doc:select("#pagination"):text(), "1/(\\d+)"), 0)
        for i = 1, page do
            local chap = {}
            chap["name"] = "Phần " .. i
            chap["url"] = "https://truyenvkl.com" .. url .. "/" .. i
            chap["host"] = "https://truyenvkl.com"
            table.insert(list, chap)
        end
        return response:success(list)
    end
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