local url = ...
local storyId = regexp:find(url, "/(\\d+)-")
local data = http:get("https://www.wattpad.com/api/v3/stories/" .. storyId):table()
if data ~= nil then
    local list = {}
    local parts = data["parts"]
    for _, value in ipairs(parts) do
        local chap = {}
        chap["name"] = value["title"]
        chap["url"] =  value["url"]
        table.insert(list, chap)
    end
    return response:success(list)
end
return nil