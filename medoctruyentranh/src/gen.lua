local url, page = ...
if text:is_empty(page) then
    page = '1'
end

local htm = http:get(url .. "/" .. page):string()

if htm ~= nil then

    local data = json:to_table(regexp:find(htm, "<script.*?type=\"application/json\">(.*?)</script>"))
    local novels = data["props"]["pageProps"]["initialState"]["classify"]["novels"]
    local covers = {}
    for _, v in pairs(novels) do
        table.insert(covers, v["coverimg"])
    end

    local doc = html:parse(htm)
    local el = doc:select(".classifyList a")
    local novelList = {}
    local next

    local last = doc:select(".page_floor > a.focus + a"):text()
    if last ~= nil then
        next = last
    end

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

    return response:success(novelList, next)
end

return nil