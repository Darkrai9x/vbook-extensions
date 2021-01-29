local key, page = ...
if text:is_empty(page) then
    page = "0"
end

local data = http:get("https://chivi.xyz/api/nvinfos?skip=" .. page .. "&take=8&btitle=" .. key):table()

if data ~= nil then
    local el = data["books"]
    local total = num:to_int(data["total"], 0)
    local skip = num:to_int(page, 0) + 8
    local novelList = {}
    local next

    if (skip < total) then
        next = skip
    end
    for i, v in ipairs(el) do
        local cover = v["bcover"]
        local newcv
        if text:contains(cover, "null") then
            newcv = ""
        else
            newcv = "/covers/" .. cover
        end
        local novel = {
            ["name"] = v["btitle_vi"],
            ["link"] = "~" .. v["bslug"],
            ["description"] = v["author_vi"],
            ["cover"] = newcv,
            ["host"] = "https://chivi.xyz"
        }
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end

return nil
