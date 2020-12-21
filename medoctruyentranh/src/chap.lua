local url = ...

local htm = http:get(url):string()
if htm ~= nil then
    local data = json:to_table(regexp:find(htm, "<script.*?type=\"application/json\">(.*?)</script>"))
    local imgs = data["props"]["pageProps"]["initialState"]["read"]["detail_item"]["elements"]

    local imgsList = {}

    for _, v in pairs(imgs) do
        table.insert(imgsList, v["content"])
    end
    return response:success(imgsList)
end
return nil