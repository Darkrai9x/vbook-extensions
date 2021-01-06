local key, page = ...
if text:is_empty(page) then
    page = "1"
end

local data =http:get("https://chivi.xyz/api/books?word=" .. key .. "&page=" .. page .. "&limit=8&order=weight&type=fuzzy"):table()

if data ~= nil then
    local el = data["items"]
    local total = num:to_int(data["total"], 0)
    local offset = num:to_int(data["query"]["offset"], 0)
    local currentPage = num:to_int(page, 0)
    local novelList = {}
    local next

    if (offset < total) then
        next = currentPage + 1
    end
    for i, v in ipairs(el) do
        local novel = {
            ["name"] = v["vi_title"],
            ["link"] = "~" .. v["slug"],
            ["description"] = v["vi_author"],
            ["cover"] = "/covers/" .. v["ubid"] .. "." .. v["main_cover"],
            ["host"] = "https://chivi.xyz"
        }
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end

return nil
