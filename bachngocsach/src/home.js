load('host.js');
function execute() {
    return Response.success([
        {title: "Đề cử", input: HOST + "/reader/recent-promote", script: "tab.js"},
        {title: "Dịch", input: HOST + "/reader/recent-bns", script: "tab.js"},
        {title: "Convert", input: HOST + "/reader/recent-cv", script: "tab.js"},
        {title: "Sáng Tác", input: HOST + "/reader/recent-sangtac", script: "tab.js"},
        {title: "Sưu tầm", input: HOST + "/reader/recent-st", script: "tab.js"},
        {title: "Hoàn thành", input: HOST + "/reader/recent-hoanthanh", script: "tab.js"}
    ]);
}
