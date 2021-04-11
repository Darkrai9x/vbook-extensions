local url = ...
local request = http:get(url)
local doc = request:html()
local newUrl = request:url()

if text:contains(newUrl, "metruyenchu.com") then
    if doc ~= nil then
        local element = doc:select("div#js-read__content"):first()
        if (string.len(element:text()) < 2000) then
            return response:error(url)
        end
        html:remove(doc, { "script", "div.nh-read__alert", "small.text-muted" })
        local title = doc:select("div.nh-read__title"):first():text()

        local htm = element:html()
        local trash = regexp:find(htm, ".*(<br>.*?<a href=.*?/truyen/.*?)$")
        if string.len(trash) < 1000 and string.len(trash) > 100 then
            htm = text:remove(htm, trash, false)
        end
        return response:success(htm, title)
    end
elseif text:contains(newUrl, "nuhiep.com") then
    if doc ~= nil then
        local element = doc:select("div#js-read__content"):first()
        if (string.len(element:text()) < 2000) then
            return response:error(url)
        end
        html:remove(doc, { "script", "div.nh-read__alert", "small.text-muted" })
        local title = doc:select("div.nh-read__title"):first():text()

        local htm = element:html()
        local trash = regexp:find(htm, ".*(<br>.*?<a href=.*?/truyen/.*?)$")
        if string.len(trash) < 1000 and string.len(trash) > 100 then
            htm = text:remove(htm, trash, false)
        end
        return response:success(htm, title)
    end
elseif text:contains(newUrl, "vtruyen.com") then
    if doc ~= nil then
        local element = doc:select("div#js-read__content"):first()
        if (string.len(element:text()) < 2000) then
            return response:error(url)
        end
        html:remove(doc, { "script", "div.nh-read__alert", "small.text-muted" })
        local title = doc:select("div.nh-read__title"):first():text()

        local htm = element:html()
        local trash = regexp:find(htm, ".*(<br>.*?<a href=.*?/truyen/.*?)$")
        if string.len(trash) < 1000 and string.len(trash) > 100 then
            htm = text:remove(htm, trash, false)
        end
        return response:success(htm, title)
    end
else
    if doc ~= nil then
        local element = doc:select("div.content"):first()
        if (string.len(element:text()) < 2000) then
            return response:error(url)
        end

        html:remove(element, { "div", "script", "font", "center", "button", "a" })
        if (element:select("p"):size() < 20) then
            element:select("p"):remove()
        end

        local title = doc:select("div.header h2.title"):first():text()

        return response:success(element:html(), title)
    end
end

return nil