let initializeAgent = function (tracer) {
    var counter = 0;

    agent.on('enter', function (ctx, frame) {
        const args = frame.args;
        if ('request' !== frame.type || args.length !== 2 || typeof args[0] !== 'object' || typeof args[1] !== 'object') {
            return;
        }
        const req = args[0];
        const res = args[1];
        const span = tracer.startSpan("request");
        span.setTag("span.kind", "server");
        span.setTag("http.url", req.url);
        span.setTag("http.method", req.method);
        res.id = ++counter;
        res.span = span;
        res.context = span.context();
        res.traceId = res.context.traceIdStr;
        console.log(`[agent] handling #${res.id} request for ${req.url}`);
    }, {
        roots: true,
        rootNameFilter: name => name === 'emit',
        sourceFilter: src => src.name === 'events.js'
    });

    agent.on('return', function (ctx, frame) {
        var res = frame['this'];
        if (res.span) {
            res.span.finish();
            console.log(`[agent] finished #${res.id} request`);
        } else {
            // OK, caused for example by Tracer itself connecting to Jaeger server
        }
    }, {
        roots: true,
        rootNameFilter: name => name === 'end',
        sourceFilter: src => src.name === '_http_outgoing.js'
    });
    console.log('[agent] ready');

    agent.on('enter', function (ctx, frame) {
        let res = frame.res;
        let parentContext = res.context;
        let traceId = res.traceId;
        console.log(`[agent] start internalCall (traceId: ${traceId})`)
        const span = tracer.startSpan("internalCall", {childOf: parentContext});
        res.span = span;
    }, {
        roots: true,
        rootNameFilter: name => name === 'internalCall'
    });

    agent.on('return', function (ctx, frame) {
        var res = frame.res;
        let span = res.span;
        let traceId = span.context().traceIdStr;
        console.log(`[agent] return internalCall (traceId: ${traceId})`)
        if (res.span) {
            res.span.finish();
        }
    }, {
        roots: true,
        rootNameFilter: name => name === 'internalCall'
    });
};

let initializeJaeger = function (ctx, frame) {
    agent.off('enter', initializeJaeger);

    let jaeger = frame.jaeger;

    var initTracer = jaeger.initTracer;
    console.log('[agent] Jaeger tracer obtained');

    // See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37
    var config = {
        serviceName: 'node-t-trace-sample',
        reporter: {
            // Provide the traces endpoint; this forces the client to connect directly to the Collector and send
            // spans over HTTP
            collectorEndpoint: 'http://localhost:14268/api/traces',
            // Provide username and password if authentication is enabled in the Collector
            // username: '',
            // password: '',
        },
        sampler: {
            type: 'const',
            param: 1
        }
    };
    var options = {
        tags: {
            'node-t-trace-sample.version': '1.1.2',
        },
        //  metrics: metrics,
        logger: console,
        sampler: {
            type: 'const',
            param: 1
        }
    };

    var tracer = initTracer(config, options);
    initializeAgent(tracer);
};

agent.on('return', initializeJaeger, {
    roots: true,
    rootNameFilter: name => name === 'jaegerAvailable'
});
