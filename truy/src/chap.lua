local url = ...

local doc = http:get(url):html()
local imgs = doc:select(".reading-content img")
html:remove(imgs, { "noscript" })
local data = {}
for i = 0, imgs:size() - 1 do
    local e = imgs:get(i)
    local link = e:attr("data-src")

    if not text:is_empty(link) then
        table.insert(data, {
            ["link"] = e:attr("data-src")
        })
    end
end
return response:success(data)