local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    doc:select(".title-chap"):remove()
    return response:success(doc:select(".reading"):html())
end
return nil