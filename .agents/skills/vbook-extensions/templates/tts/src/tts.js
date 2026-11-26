// Synthesize one sentence; return the audio bytes as base64.
function execute(text, voiceId) {
    let response = fetch("https://engine.com/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text, voice: voiceId })
    });
    if (!response.ok) return Response.error("HTTP " + response.status);

    return Response.success(response.base64());
}
