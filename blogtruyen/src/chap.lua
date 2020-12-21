local url = ...

local doc = http:get(url):html()

local imgs = doc:select("article#content img")
local data = {}
for i = 0, imgs:size() - 1 do
    local e = imgs:get(i)
    table.insert(data, {
        ["link"] = e:attr("src")
    })
end
return response:success(data)