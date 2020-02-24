function jaegerAvailable(jaeger) {
    console.log("Providing Jaeger object to the agent");
}
jaegerAvailable(require("jaeger-client"));

function internalCall(res) {
    console.log(`[server]: internalCall function has been executed: ${res.traceId}`);
}

const port = 8080;
const http = require("http");
const srv = http.createServer((req, res) => {
    console.log(`[server]: obtained request (reqId: #${res.id}, traceId: ${res.traceId})`);
    internalCall({context: res.context, traceId: res.traceId});
    setTimeout(() => {
        res.write(`OK (reqId: #${res.id}, traceId: ${res.traceId})`);
        console.log(`[server] replied to request (req: #${res.id}, traceId: ${res.traceId})`);
        res.end();
    }, 5);
});

console.log(`running server with PORT ${port}`);
srv.listen(port);
