local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    html:remove(doc, { ".note-reg" })
    return response:success(doc:select("div#chapter-content"):html())
end
return nil