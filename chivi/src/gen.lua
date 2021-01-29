local url, page = ...

if text:is_empty(page) then
    page = "0"
end
local data = http:get(url .. "take=24&skip=" .. page):table()

if data ~= nil then
    local el = data["books"]
    local total = num:to_int(data["total"], 0)

    local novelList = {}
    local skip = num:to_int(page, 0)
    local next
    if (skip < total) then
        next = skip + 24
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
            ["description"] = v["vi_genre"],
            ["cover"] = newcv,
            ["host"] = "https://chivi.xyz"
        }
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end

return nil