local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local element = doc:select("div#js-read__content"):first()
    if (string.len(element:text()) < 2000) then
        return response:error(url)
    end
    html:remove(doc, { "script", "div.nh-read__alert", "small.text-muted" })
    local title = doc:select("div.nh-read__title"):first():text()

    local htm = element:html()
    local trash = regexp:find(htm, ".*(<br>.*?<a href=.*?/truyen/.*?)$")
    if string.len(trash) < 500 and string.len(trash) > 100 then
        htm = text:replace(htm, trash, "")
    end
    return response:success(htm, title)
end
return nil