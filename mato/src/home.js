load('config.js');

function execute() {
    return Response.success([
        {
            title: 'MatoDex',
            input: BASE_URL,
            script: 'homecontent.js'
        }
    ]);
}
