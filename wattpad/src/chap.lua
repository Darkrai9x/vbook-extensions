local url = ...
local chapId = regexp:find(url, "wattpad.com/(\\d+)-")
local html = http:get("https://www.wattpad.com/apiv2/storytext?id=" .. chapId):timeout(0):string()
if html ~= nil then
    return response:success(html)
end
return nil