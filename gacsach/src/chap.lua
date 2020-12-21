local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local e = doc:select("div.field-item.even")
    html:remove(e, {"p[style=text-align: center; line-height: 1.1;]"})
    return response:success(e:html())
end
return nil