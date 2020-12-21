local url, page = ...

if text:is_empty(page) then
    page = "0"
end
local data = http:get(url):params({
    ["query"] = key,
    ["fields"] = "stories(id,title,url,cover,user(name))",
    ["offset"] = page,
    ["limit"] = "10"
}):table()

if data ~= nil then
    local next

    local last = data["nextUrl"]
    if last ~= nil then
        next = regexp:find(last, "offset=(\\d+)")
    end

    local stories = data["stories"]
    local novelList = {}
    for _, value in ipairs(stories) do
        local novel = {}
        novel["name"] = value["title"]
        novel["link"] = value["url"]
        novel["cover"] = value["cover"]
        novel["description"] = value["user"]["name"]
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end

return nil