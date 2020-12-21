local url = ...
local list = {}
table.insert(list, url .. "/muc-luc?page=all")
return response:success(list)