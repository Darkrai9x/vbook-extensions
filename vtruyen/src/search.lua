local key, page = ...
if text:is_empty(page) then
    page = '1'
end
local browser = engine:browser()

browser:block(".*?api.truyen.onl/v2/books/search.*?")

browser:launch("https://nuhiep.com/tim-kiem?q=" .. key .. "&page=" .. page, 10000)
browser:wait_url(".*?api.truyen.onl/v2/books/search.*?")
local urls = browser:urls()
browser:close()
for _, v in pairs(urls) do
    if text:contains(v, "api.truyen.onl/v2/books/search") then
        local json = http:get(v):table()
        local chapters = json["_data"]
        local next = json["_extra"]["_pagination"]["_next"]
        local list = {}
        for _, novel in pairs(chapters) do
            table.insert(list, {
                ["name"] = novel["name"],
                ["link"] = "/truyen/" .. novel["slug"],
                ["description"] = novel["author_name"],
                ["cover"] = novel["poster"]["default"],
                ["host"] = "https://vtruyen.com"
            })
        end
        return response:success(list, next)
    end
end
return nil