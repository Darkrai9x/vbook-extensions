local url = ...
local list = {}
local new_url = text:replace(url, "truyenyy.com", "truyenyy.vip")
new_url = text:replace(new_url, "truyenyy.vn", "truyenyy.vip")
local doc = http:get(new_url .. "/danh-sach-chuong"):timeout(0):html()

local page = num:to_int(regexp:find_last(doc:html(), "\\?p=\\d+\\s*\">\\s*(\\d+)\\s*<"), 1)

for i = 1, page do
    table.insert(list, text:replace(url, "truyenyy.vn", "truyenyy.vip") .. "/danh-sach-chuong/?p=" .. i)
end
return response:success(list)