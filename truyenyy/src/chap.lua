local url = ...
local doc = http:get(text:replace(url, "truyenyy.com", "truyenyy.vn")):timeout(0):html()
if doc ~= nil then
    local txt = doc:select("div.inner"):html()
    if (txt == nil or string.len(txt) < 1000) then
        if (text:contains(doc:html(), "btn_buy")) then
            return response:error(url)
        end
        if (text:contains(txt, "/login/")) then
            return response:error(url)
        end
        local id = regexp:find(doc:html(), "chap_id=(.*?)&")
        local localId = regexp:find(doc:html(), "chapter-content-get/(.*?)/")
        local loadUrl = "https://truyenyy.vn/web-api/novel/chapter-content-get/" .. localId .. "/?chap_id=" .. id .. "&part=0"
        local content = http:get(loadUrl):timeout(0):table()
        txt = ""
        if (content ~= nil) then
            txt = txt .. text:remove(content['content'], { "<style>.*?</style>", "<[a-z]{2,} style=.*?>.*?</[a-z]{2,}>", "</?[a-z]{2,}>" })
            if (content['ok']) then
                loadUrl = "https://truyenyy.vn/web-api/novel/chapter-content-get/" .. localId .. "/?chap_id=" .. id .. "&part=1"
                content = http:get(loadUrl):timeout(0):table()
                if (content ~= nil) then
                    txt = txt .. text:remove(content['content'], { "<style>.*?</style>", "<[a-z]{2,} style=.*?>.*?</[a-z]{2,}>", "</?[a-z]{2,}>" })
                    if (content['ok']) then
                        loadUrl = "https://truyenyy.vn/web-api/novel/chapter-content-get/" .. localId .. "/?chap_id=" .. id .. "&part=2"
                        content = http:get(loadUrl):timeout(0):table()
                        if (content ~= nil) then
                            txt = txt .. text:remove(content['content'], { "<style>.*?</style>", "<[a-z]{2,} style=.*?>.*?</[a-z]{2,}>", "</?[a-z]{2,}>" })
                        end
                    end
                end
            end
        end

    end

    return response:success(txt)
end
return nil