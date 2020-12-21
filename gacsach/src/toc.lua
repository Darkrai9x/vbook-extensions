local url = ...
local list = {}
local doc = http:get(url):html()
if doc ~= nil then
    local name = "- " .. doc:select("h1.page-title"):text() .. " - "
    local el = doc:select("div.book-nav option")
    for i = 2, el:size() - 1 do
        local e = el:get(i)
        local chap = {}
        chap["name"] = text:remove(e:text(), { name })
        chap["url"] = regexp:find(e:attr("value"), "(http.*?)$")
        chap["host"] = "https://gacsach.com"
        table.insert(list, chap)
    end
    return response:success(list)
end
return nil