FROM orchestrator/local:latest

ADD cogment.yaml .
ADD *.proto .

ENTRYPOINT ["orchestrator_dbg"]
CMD ["--log_level=trace", "--params=cogment.yaml"]