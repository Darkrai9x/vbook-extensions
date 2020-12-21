local url = ...
local doc = http:get(url):html()
local list = {}
local truyenId = doc:select("input#truyen-id"):attr("value")
local truyenAscii = doc:select("input#truyen-ascii"):attr("value")
local page = num:to_int(doc:select("input#total-page"):attr("value"), 1)
for i = 1, page do
    table.insert(list, "https://truyenfull.vn/ajax.php?type=list_chapter&tid=" .. truyenId .. "&tascii=" .. truyenAscii .. "&page=" .. i .. "&totalp=" .. page)
end
return response:success(list)