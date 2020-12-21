local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local element = doc:select("div#js-read__content"):first()
    if (string.len(element:text()) < 2000) then
        return response:error(url)
    end
    html:remove(doc, { "script", "div.nh-read__alert", "small.text-muted" })
    local title = doc:select("div.nh-read__title"):first():text()
    return response:success(element:html(), title)
end
return nil