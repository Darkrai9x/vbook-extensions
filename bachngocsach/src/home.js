load('config.js');
function execute() {
    return Response.success([
        {title: "Đề cử", input: BASE_URL + "/reader/recent-promote", script: "tab.js"},
        {title: "Dịch", input: BASE_URL + "/reader/recent-bns", script: "tab.js"},
        {title: "Convert", input: BASE_URL + "/reader/recent-cv", script: "tab.js"},
        {title: "Sáng Tác", input: BASE_URL + "/reader/recent-sangtac", script: "tab.js"},
        {title: "Hoàn thành", input: BASE_URL + "/reader/recent-hoanthanh", script: "tab.js"}
    ]);
}
