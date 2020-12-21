local url = ...
local doc = http:get(url):html()
local list = {}
local lastPage = regexp:find(doc:select(".trangcurrent"):text(), "\\d+/(\\d+)")

local totalPage = num:to_int(lastPage, 1)
for i = 1, totalPage do
    table.insert(list, url .. "/page" .. i)
end
return response:success(list)