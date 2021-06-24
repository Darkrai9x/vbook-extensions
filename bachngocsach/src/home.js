function execute() {
    return Response.success([
        { title: "Truyện Dịch", input: "https://bachngocsach.com/reader/recent-bns", script: "tab.js" },
        { title: "Truyện Convert", input: "https://bachngocsach.com/reader/recent-cv", script: "tab.js" },
        { title: "Sáng Tác", input: "https://bachngocsach.com/reader/recent-sangtac", script: "tab.js" },
        { title: "Sưu tầm", input: "https://bachngocsach.com/reader/recent-st", script: "tab.js" }
    ]);
}
