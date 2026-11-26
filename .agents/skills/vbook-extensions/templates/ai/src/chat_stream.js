// OpenAI-compatible SSE. Errors use "ai_error:<code> - <detail>" so the chat shows a localized label.
function errorCode(status) {
    if (status === 401 || status === 403) return "key";
    if (status === 429) return "quota";
    if (status === 404) return "model_not_found";
    if (status >= 500) return "server";
    return "bad_request";
}

function execute(messagesJson, selectedModel) {
    if (!api_key) return Response.error("ai_error:no_key");

    let response = fetch(base_url + "/chat/completions", {
        method: "POST",
        stream: true,   // lines arrive as sent; without it the body is buffered first
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_key
        },
        body: JSON.stringify({ model: selectedModel || model, messages: JSON.parse(messagesJson), stream: true })
    });
    if (!response.ok) return Response.error("ai_error:" + errorCode(response.status) + " - HTTP " + response.status);

    let emitted = false;
    let line;
    while ((line = response.readLine()) !== null) {
        if (line.indexOf("data:") !== 0) continue;
        let payload = line.substring(5).trim();
        if (payload === "[DONE]") break;
        let json;
        try {
            json = JSON.parse(payload);
        } catch (e) {
            continue;
        }
        let delta = json.choices && json.choices[0] && json.choices[0].delta;
        if (delta && delta.content) {
            ai.emitToken(delta.content);
            emitted = true;
        }
    }
    return emitted ? Response.success("") : Response.error("ai_error:empty");
}
