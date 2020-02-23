GRAALVM_HOME=$(JAVA_HOME)

NPM_BIN=$(GRAALVM_HOME)/bin/npm
NODE_BIN=$(GRAALVM_HOME)/bin/node

JAEGER_NAME=jaeger-collector-t-trace

.PHONY: install/jaeger-client
install/jaeger-client:
	$(NPM_BIN) install jaeger-client

.PHONY: run/server
run/server:
	$(NODE_BIN) server.js

.PHONY: run/server/with-agent
run/server/with-agent:
	$(NODE_BIN) --agentscript=agent.js --experimental-options server.js

.PHONY: docker/jaeger-collector/run
docker/jaeger-collector/run:
	docker run -d --name $(JAEGER_NAME) \
	    -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
	    -p 5775:5775/udp   -p 6831:6831/udp   -p 6832:6832/udp \
	    -p 5778:5778   -p 16686:16686   -p 14268:14268   -p 9411:9411 \
	    jaegertracing/all-in-one:latest

.PHONY: docker/jaeger-collector/stop
docker/jaeger-collector/stop:
	docker stop $(JAEGER_NAME)
