# Cấu trúc của extension

##Thông tin extension
- Tạo một tệp với tên `plugin.json` vào thư mục của extensions, cấu trúc của tệp có dạng như sau
```json
{
  "metadata": {
    "name": "<Tên của extension>",
    "author": "<Tên tác giả>",
    "version": 1,
    "source": "<Địa chỉ trang nguồn>",
    "regexp": "<RegExp khớp với URL của trang truyện>",
    "description": "<Mô tả về extension>",
    "local": "<Quốc gia áp dụng của extension>",
    "language": "javascript",
    "type": "<Thể loại của extension, comic/novel/chinese_novel>"
  },
  "script": {
    "home": "<Tên script trang home (không bắt buộc)>",
    "genre": "<Tên script danh sách thể loại, nếu không có thì không thêm>",
    "detail": "<Tên script thông tin truyện (bắt buộc)>",
    "search": "<Tên script tìm kiếm truyện (không bắt buộc)>",
    "page": "<Tên script danh sách trang của mục luc (không bắt buộc)>",
    "toc": "<Tên script mục lục (bắt buộc)ó>",
    "chap": "<Tên script nội dung chương (bắt buộc)>"
  }
}
```
## Icon extension
- Tạo một ảnh `icon.png` trong thư mục của extension
## Script extension
- Tạo các tệp script đặt tại thư mục `src` của extension

# Cấu trúc script
Xem source code của các extension để tham khảo
# Các funtion bổ trợ

## Javascript
- Http request

```javascript
var request = Http.get(url) // Tạo request GET, return Request object
var request = Http.post(url) // Tạo request POST, return Request object
request.headers(headers) // Truyền tham số header, return Request object
request.params(params) // Truyền tham số FormData, return Request object
request.body(body) // Truyền tham số body payload string, return Request object
request.html() // Trả về response request dạng Document object
request.html(charset) // Trả về response request dạng Document object
request.string() // Trả về response request dạng string
request.string(charset) // Trả về response request dạng string
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

-- Other
```javascript
Console.log() // Log data in tab logcat
load('filename.js') // Load file js
```

# Test extension
- PC cài Java phiên bản 1.8 trở lên
- Kết nối điện thoại và PC cùng 1 mạng lan.
- Trên điện thoại chạm 7 lần vào tên phiên bản để mở tính năng nhà phát triển
  
  ![Version app](tutorial/1.jpg)
- Bật `chế độ nhà phát triển` để lấy IP của điện thoại.

![IP](tutorial/2.jpg)

- Nhập IP vào tool trên PC

![IP](tutorial/3.png)