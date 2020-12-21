local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    html:remove(doc, { "noscript", "script", "iframe", "[style=font-size:0px;]", "a", "div.ads-responsive" })
    local txt = text:remove(doc:select("div.chapter-c"):html(), { "<em>.*?Chương này có nội dung ảnh.*?</em>", "</?em>" })
    return response:success(txt)
end
return nil