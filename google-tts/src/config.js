load("voice.js");

function execute() {
    return Response.success({
        voices: voices,
        preload: 5,
        maxLength: 200
    });
}