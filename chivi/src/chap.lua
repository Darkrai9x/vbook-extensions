local url = ...
local doc = http:get(url):html()
doc:select("h1"):remove()
return response:success(doc:select("article"):html())