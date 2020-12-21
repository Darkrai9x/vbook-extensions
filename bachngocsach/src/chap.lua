local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    return response:success(doc:select("div#noi-dung"):html())
end
return nil