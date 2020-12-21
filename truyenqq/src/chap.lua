local url = ...

function bypass(doc)
    local cookie = regexp:find(doc:html(), "document.cookie=\"(.*?)\"")
    if not text:is_empty(cookie) then
        doc = http:get(url):header("Cookie", cookie):html()
    end

    return doc
end

local doc = bypass(http:get(url):html())
local imgs = doc:select(".story-see-content img.lazy")
local data = {}
for i = 0, imgs:size() - 1 do
    local e = imgs:get(i)
    table.insert(data, {
        ["link"] = e:attr("src")
    })
end
return response:success(data)