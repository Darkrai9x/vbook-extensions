local key, page = ...

local htm = http:get("https://www.medoctruyentranh.net/search/".. key):string()

if htm ~= nil then

    local data = json:to_table(regexp:find(htm, "<script.*?type=\"application/json\">(.*?)</script>"))
    local novels = data["props"]["pageProps"]["initialState"]["search"]["searchResult"]["storys"]
    local covers = {}
    for _, v in pairs(novels) do
        table.insert(covers, v["coverimg"])
    end

    local doc = html:parse(htm)
    local el = doc:select(".listCon a")
    local novelList = {}

    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local novel = {
            ["name"] = e:select(".storytitle"):text(),
            ["link"] =  e:select("a"):attr("href"),
            ["cover"] = covers[i + 1],
            ["host"] = "https://www.medoctruyentranh.net"
        }
        table.insert(novelList, novel)
    end

    return response:success(novelList)
end

return nil
