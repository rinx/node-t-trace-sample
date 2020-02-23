node T-Trace sample
===

This is a sample repository to trace node.js server with T-Trace and Jaeger.

## install

install jaeger-client

    $ make install/jaeger-client ## just runs `npm install jaeger-client`

run server.js without agent

    $ make run/server

run jaeger-collector in your docker environment

    $ make docker/jaeger-collector/run

run server.js with agent

    $ make run/server/with-agent

stop jaeger-collector

    $ make docker/jaeger-collector/stop

## References

- https://github.com/oracle/graal/blob/master/tools/docs/T-Trace-Tracing.md
- https://github.com/oracle/graal/blob/master/tools/docs/T-Trace.md
- https://github.com/jaegertracing/jaeger-client-node
