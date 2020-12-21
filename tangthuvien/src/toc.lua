local url = ...

local doc = http:get(url):html()
if doc ~= nil then
    local id = doc:select("input[name=story_id]"):attr("value")
    doc = http:get("https://truyen.tangthuvien.vn/story/chapters?story_id=" .. id):html()
    if (doc ~= nil) then
        local list = {}
        local el = doc:select("li a")
        for i = 0, el:size() - 1 do
            local e = el:get(i)
            local chap = {}
            chap["name"] = e:text()
            chap["url"] = e:attr("href")
            chap["host"] = "http://truyen.tangthuvien.vn"
            table.insert(list, chap)
        end
        return response:success(list)
    end
end
return nil