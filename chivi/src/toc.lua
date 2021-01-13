local url = ...
local doc = http:get(url .. "/content"):html()
if doc ~= nil then
    local list = {}
    local source = doc:select(".section-content > .chseed > a._active"):text()
    local ubid = regexp:find(doc:html(), 'ubid:\\s*"(.*?)"')
    local json = http:get("https://chivi.xyz/api/chaps/" .. ubid .. "/" .. source .. "?limit=30&offset=0&order=asc"):table()

    local data = json["chaps"]
    local total = json["total"]
    for k, v in ipairs(data) do
        local chap = {
            ["name"] = v["title"],
            ["url"] = url .. "/-" .. v["uslug"] .. "-" .. source .. "-" .. v["scid"],
            ["host"] = "https://chivi.xyz/"
        }
        table.insert(list, chap)
    end

    for i = 30, total, 30 do
        print(i .. " - " .. total)
        local json = http:get("https://chivi.xyz/api/chaps/" .. ubid .. "/" .. source .. "?limit=30&offset=" .. i .. "&order=asc"):table()

        local data = json["chaps"]
        for k, v in ipairs(data) do
            local chap = {
                ["name"] = v["title"],
                ["url"] = url .. "/-" .. v["uslug"] .. "-" .. source .. "-" .. v["scid"],
                ["host"] = "https://chivi.xyz/"
            }
            table.insert(list, chap)
        end
    end

    return response:success(list)
end
return nil
