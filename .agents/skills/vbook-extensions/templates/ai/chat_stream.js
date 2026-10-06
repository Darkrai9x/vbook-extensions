// OpenAI-compatible streaming template. Replace endpoint/request parsing when
// the provider uses another protocol. The app assembles emitted tokens.
function execute(messagesJson, selectedModel) {
    let messages = JSON.parse(messagesJson);
    let response = fetch(base_url + "/chat/completions", {
        method: "POST",
        stream: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_key
        },
        body: JSON.stringify({
            model: selectedModel || model,
            messages: messages,
            stream: true
        })
    });
    if (!response.ok) return Response.error("HTTP " + response.status);

    let line;
    while ((line = response.readLine()) !== null) {
        if (line.indexOf("data: ") !== 0) continue;
        let payload = line.substring(6).trim();
        if (!payload || payload === "[DONE]") continue;
        let json = JSON.parse(payload);
        let token = json.choices && json.choices[0] && json.choices[0].delta
            ? json.choices[0].delta.content
            : "";
        if (token) ai.emitToken(token);
    }
    return Response.success("");
}
