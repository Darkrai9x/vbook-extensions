# Cấu trúc của extension

##Thông tin extension
- Tạo một tệp với tên `plugin.json` vào thư mục của extensions, cấu trúc của tệp có dạng như sau
```json
{
  "metadata": {
    "name": "<Tên của extension>",
    "author": "<Tên tác giả>",
    "version": <Phiên bản của extension dạng integer>,
    "source": "<Địa chỉ trang nguồn>",
    "regexp": "<RegExp khớp với URL của trang truyện>",
    "description": "<Mô tả về extension>",
    "local": "<Quốc gia áp dụng của extension>",
    "language": "<Ngôn ngữ của extension, 2 giá trị lua/javascript>",
    "type": "<Thể loại của extension, comic/novel>"
  },
  "script": {
    "home": "<Tên script trang home (không bắt buộc)>",
    "genre": "<Tên script danh sách thể loại, nếu không có thì không thêm>",
    "detail": "<Tên script thông tin truyện (bắt buộc)>",
    "search": "<Tên script tìm kiếm truyện (không bắt buộc)>",
	"page": "<Tên script danh sách trang của mục luc (không bắt buộc)>",
    "toc": "<Tên script mục lục (bắt buộc)ó>",
    "chap": "<Tên script nội dung chương (bắt buộc)>",
  }
}
```
## Icon extension
- Tạo một ảnh `icon.png` trong thư mục của extension
## Script extension
- Tạo các tệp script dặt tại thư mục `src` của extension

# Cấu trúc script
Xem source code của các extension để tham khảo
# Các funtion bổ trợ
## LUA
- Http request `http:`

```lua
local request = http:get(url) -- Tạo request GET, return Request object
local request = http:post(url) -- Tạo request POST, return Request object
request:header(key, value) -- Truyền tham số vào header key-value, return Request object
request:headers(headers) -- Truyền tham số header dạng lua table, return Request object
request:params(params) -- Truyền tham số FormData dạng lua table, return Request object
request:body(body)  -- Truyền tham số body payload string, return Request object
request:html() -- return response request dạng Document object
request:table() -- return response request dạng lua table object
request:string() -- return response request dạng string
request:code() -- return http status code của response
```

- Html parse `html:`

```lua
html:parse(text) -- Parse html text to  Document object
```
- Json convert to table `json:`

```lua
json:to_table(text) -- Parse json text to lua table object
```
- Number convert `num:`

```lua
num:to_int(input, defaultValue) -- Convert input to Int
num:to_double(input, defaultValue) -- Convert input to Double
num:to_float(input, defaultValue) -- Convert input to Float
num:to_long(input, defaultValue) -- Convert input to Long
```
- Regexp `regexp:`

```lua
regexp:find(text, regex) -- Trả về kết quả tìm kiếm đầu tiên khớp với regexp của group 1
regexp:find(text, regex, group) -- Trả về kết quả tìm kiếm đầu tiên khớp với regexp của group
regexp:find_last(text, regex) -- Trả về kết quả tìm kiếm cuối cùng khớp với regexp của group 1
regexp:find_last(text, regex, group) -- Trả về kết quả tìm kiếm cuối cùng khớp với regexp của group
```
- Text, `text:`

```lua
text:index_of(str, s) -- Trả về vị trí đầu tiên chuỗi `s` trong `str`, không có trả về -1
text:last_index_of(str, s) -- Trả về vị trí cuối cùng chuỗi `s` trong `str`, không có trả về -1
text:matches(str, regexp) -- Kiểm trả `str` khớp với regexp không
text:index_of(str, s, start) -- Trả về vị trí đầu tiên của chuỗi `s` bắt dầu từ vị trí `start` trong `str`, không có trả về -1
text:last_index_of(str, s, start) -- Trả về vị trí cuối cùng của chuỗi `s` bắt đầu từ vị trí `start` trong `str`, không có trả về -1
text:sub(str, start, end) -- Cắt chuỗi `str` từ start -> end
text:split(text, regex) -- Chia chuỗi `text` thành các phần
text:trim(text) -- Xoá các ký tự empty ở đầu, cuối chuỗi
text:is_empty(text) -- Kiểm tra chuỗi rỗng
text:contains(text, value) -- Kiểm tra chuỗi `value` có nằm trong chuỗi `text` không
text:replace(str, regex, e) -- Thay thế chuỗi `regex` bằng `e`, có hỗ trợ regexp
text:remove(str, replace, regex) -- Xoá chuỗi `replace` trong `str`, regex = true/false để xác định replace có dùng regex hay không
```

- Response `ressponse:`

```lua
ressponse:success(data) -- Trả về response thành công với data
ressponse:success(data, data2) -- Trả về response thành công với data, data2
ressponse:error(message) -- Trả về response thất bại với nội dung lỗi
```

-- Browser `engine:browser()`

```lua
local browser = engine:browser() -- Khởi tạo browser
browser:launch(url, timeout) -- Mở trang web với timeout, trả về Document object
browser:call_js(script, waitTime) -- Gọi Javascript function trên trang với waitTime, trả về Document object
browser:urls() -- Trả về các url đã request trên trang
browser:waitUrl(urls,  timeout) -- Đợi urls load với timeout
browser:html() -- Trả về Document object của trang web
browser:close() -- Đóng browser khi đã xử lý xong
```

## Javascript
- Http request

```javascript
var request = Http.get(url) // Tạo request GET, return Request object
var request = Http.post(url) // Tạo request POST, return Request object
request.headers(headers) // Truyền tham số header, return Request object
request.params(params) // Truyền tham số FormData, return Request object
request.body(body) // Truyền tham số body payload string, return Request object
request.html() // Trả về response request dạng Document object
request.string() // Trả về response request dạng string
request.code()// Trả về http status code của response
```

- Html parse

```javascript
Html.parse(text) // Parse html text to  Document object
```

- Response

```javascript
Response.success(data) // Trả về response thành công với data
Response.success(data, data2) // Trả về response thành công với data, data2
Response.error(message) // Trả về response thất bại với nội dung lỗi
```

-- Browser

```javascript
var browser = Engine.newBrowser() // Khởi tạo browser
browser.launch(url, timeout) // Mở trang web với timeout, trả về Document object
browser.callJs(script, waitTime) // Gọi Javascript function trên trang với waitTime, trả về Document object
browser.urls() // Trả về các url đã request trên trang
browser.waitUrl(urls,  timeout) // Đợi urls load với timeout
browser.html() // Trả về Document object của trang web
browser.close() // Đóng browser khi đã xử lý xong
```
