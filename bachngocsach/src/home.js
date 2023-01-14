load('host.js');
function execute() {
    return Response.success([
        {title: "Truyện Dịch", input: HOST + "/reader/recent-bns", script: "tab.js"},
        {title: "Truyện Convert", input: HOST + "https://truyenbns.com/reader/recent-cv", script: "tab.js"},
        {title: "Sáng Tác", input: HOST + "/reader/recent-sangtac", script: "tab.js"},
        {title: "Sưu tầm", input: HOST + "/reader/recent-st", script: "tab.js"}
    ]);
}
