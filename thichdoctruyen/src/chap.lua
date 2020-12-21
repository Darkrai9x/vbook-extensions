local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local htm = doc:select("div.boxview"):html()
    if (string.len(htm) < 2000 and text:contains(htm, "login/login")) then
        return nil
    end
    return response:success(text:replace(htm, "&nbsp;", ""))
end
return nil