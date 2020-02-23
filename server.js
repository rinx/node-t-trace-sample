function jaegerAvailable(jaeger) {
    console.log("Providing Jaeger object to the agent");
}
jaegerAvailable(require("jaeger-client"));

const port = 8080;
const http = require("http");
const srv = http.createServer((req, res) => {
    console.log(`[server]: obtained request ${res.id}`);
    setTimeout(() => {
        res.write(`OK (reqId: #${res.id}, traceId: ${res.traceId})`);
        console.log(`[server] replied to request (req: #${res.id}, traceId: ${res.traceId})`);
        res.end();
    }, 5);
});

console.log(`running server with PORT ${port}`);
srv.listen(port);
