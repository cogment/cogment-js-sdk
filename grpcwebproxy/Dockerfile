FROM golang:1.15.2 as dev

WORKDIR /go

ARG GO111MODULE=auto
ENV GO111MODULE=${GO111MODULE}
ENV GOPATH=/go

ENV COGMENT_URL=orchestrator:9000

#RUN apt-get update \
#  && apt-get install -y protobuf-compiler \
#  && rm -rf /var/lib/apt/lists/*

RUN go get github.com/improbable-eng/grpc-web/go/grpcwebproxy
#RUN go install github.com/chrusty/protoc-gen-jsonschema/cmd/protoc-gen-jsonschema

#RUN go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger

#FROM golang:1.15.2 as production
#
#RUN apt-get update \
#  && apt-get install -y protobuf-compiler \
#  && rm -rf /var/lib/apt/lists/*
#
#COPY --from=dev /go/bin /go/bin

EXPOSE 8080

CMD ["grpcwebproxy", "--backend_addr=orchestrator:9000", "--run_tls_server=false", "--allow_all_origins"]
