function jaegerAvailable(jaeger) {
    console.log("Providing Jaeger object to the agent");
}
jaegerAvailable(require("jaeger-client"));

const port = 8080;
const http = require("http");
const srv = http.createServer((req, res) => {
    console.log(`[server]: obtained request ${res.id}`);
    setTimeout(() => {
        res.write(`OK# ${res.id}`);
        console.log(`[server] replied to request ${res.id}`);
        res.end();
    }, 5);
});

console.log(`running server with PORT ${port}`);
srv.listen(port);
