local url = ...
local storyId = regexp:find(url, "/(\\d+)-")
local data = http:get("https://www.wattpad.com/api/v3/stories/" .. storyId):table()
if data ~= nil then
    local book = {}
    book["name"] = data["title"]
    book["cover"] = data["cover"]
    book["host"] = "https://www.wattpad.com"
    book["author"] = data["user"]["name"]
    book["description"] = data["description"]
    book["url"] = data["url"]
    book["detail"] = data["user"]["name"]
    return response:success(book)
end
return nil