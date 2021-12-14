FROM golang:1.15.2

WORKDIR /go

ARG GO111MODULE=auto
ENV GO111MODULE=${GO111MODULE}
ENV GOPATH=/go

ENV RUN_HTTP_SERVER=true
ENV RUN_TLS_SERVER=false
ENV SERVER_TLS_CERT_FILE=""
ENV SERVER_TLS_KEY_FILE=""
ENV COGMENT_URL=orchestrator:9000

RUN go get github.com/improbable-eng/grpc-web/go/grpcwebproxy

EXPOSE 8080
EXPOSE 8444

CMD grpcwebproxy --backend_addr=${COGMENT_URL} --run_http_server=${RUN_HTTP_SERVER} --allow_all_origins --use_websockets --run_tls_server=${RUN_TLS_SERVER} --server_tls_cert_file=${SERVER_TLS_CERT_FILE} --server_tls_key_file=${SERVER_TLS_KEY_FILE}
