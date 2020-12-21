local url = ...
local list = {}
local browser = engine:browser()

browser:block(".*?api.truyen.onl/v2.*?")

browser:launch(url, 10000)
browser:call_js("document.getElementById('nav-tab-chap').click();", 500)
browser:wait_url(".*?api.truyen.onl/v2.*?")

local urls = browser:urls()
browser:close()
for _, v in ipairs(urls) do
    if text:contains(v, "api.truyen.onl/v2/chapters") then
        local json = http:get(v):table()
        local chapters = json["_data"]["chapters"]
        for _, chap in ipairs(chapters) do
            table.insert(list, {
                ["name"] = chap["name"],
                ["url"] = "chuong-" .. chap["index"],
                ["host"] = url
            })
        end
        return response:success(list)
    end
end
return nil