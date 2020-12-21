local url = ...
local list = {}
local doc = http:get(text:replace(url, "truyenyy.com", "truyenyy.vn") .. "/danh-sach-chuong"):timeout(0):html()

local page = num:to_int(regexp:find_last(doc:html(), "\\?p=\\d+\\s*\">\\s*(\\d+)\\s*<"), 1)

for i = 1, page do
    table.insert(list, text:replace(url, "truyenyy.com", "truyenyy.vn") .. "/danh-sach-chuong/?p=" .. i)
end
return response:success(list)