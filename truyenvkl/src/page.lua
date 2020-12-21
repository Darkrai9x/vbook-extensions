local url = ...
local doc = http:get(url):html()
local list = {}
local pages = doc:select(".pagination li")
local page = 1
local listChap = doc:select("#dsc")
if not listChap:isEmpty() then
    if pages:size() > 1 then
        page = num:to_int(regexp:find(pages:get(pages:size() - 2):select("a"):attr("href"), "/(\\d+)"), 1)
    end
    for i = 1, page do
        table.insert(list, url .. "/" .. i)
    end
else
    local bookId = doc:select("#views"):attr("data-id")
    table.insert(list, bookId)
end

return response:success(list)