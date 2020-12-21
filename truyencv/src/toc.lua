local url = ...
local list = {}

local htm = http:get(url)
local doc = htm:html()

local newUrl = htm:url()

if text:contains(newUrl, "metruyenchu.com") then
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
                    ["host"] = newUrl
                })
            end
            return response:success(list)
        end
    end
elseif text:contains(newUrl, "nuhiep.com") then
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
                    ["host"] = newUrl
                })
            end
            return response:success(list)
        end
    end
elseif text:contains(newUrl, "vtruyen.com") then
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
                    ["host"] = newUrl
                })
            end
            return response:success(list)
        end
    end
else
    if doc ~= nil then
        local hash = regexp:find(doc:select("div.truyencv-detail-tab"):html(), "showChapter\\((.*?)\\)")
        if (text:is_empty(hash)) then
            return list
        end
        hash = text:remove(hash, { "'" })
        local tbl = text:split(hash, ",")

        local params = { ["showChapter"] = 1, ["media_id"] = tbl[1], ["number"] = 1, ["page"] = 1, ["type"] = tbl[4] }

        doc = http:post("https://truyencv.com/index.php"):params(params):html()
        local el = doc:select("div.item a")
        html:remove(el, { "span.text-muted" })

        if (doc:select("div.panel-vip"):isEmpty()) then
            for i = el:size() - 1, 0, -1 do
                local e = el:get(i)
                local chap = {}
                chap["name"] = e:text()
                chap["url"] = e:attr("href")
                chap["host"] = "http://truyencv.com"
                table.insert(list, chap)
            end
        else
            for i = 0, el:size() - 1 do
                local e = el:get(i)
                local chap = {}
                chap["name"] = e:text()
                chap["url"] = e:attr("href")
                chap["host"] = "http://truyencv.com"
                table.insert(list, chap)
            end
        end
        return response:success(list)
    end
end

return nil