local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local list = {}
    local sources = regexp:find(doc:html(), "href=\"([^ ]+seed=.*?)\"")
    local slug = regexp:find(sources, "~(.*?)\\?")
    local source = regexp:find(sources, "seed=(.*?)$")
    local json = http:get("https://chivi.xyz/_chaps/" .. slug ..  "/" .. source .. "?mode=0"):table()

    local data = json["chlist"]
    for k, v in ipairs(data) do
        local chap = {
            ["name"] = v["vi_title"],
            ["url"] = url .. "/-" .. v["url_slug"] .. "-" ..source .. "-" .. v["scid"],
            ["host"] = "https://chivi.xyz/",
        }
        table.insert(list, chap)
    end

    return response:success(list)
end
return nil