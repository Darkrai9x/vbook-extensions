local url = ...
local htm = http:get(url):string()
if not text:is_empty(htm) then
    local doc = html:parse(text:replace(htm, "\n", "<br>"))
    if (doc ~= nil) then
        return response:success(doc:select("div.box-chap"):first():html())
    end
end
return nil