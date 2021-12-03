FROM cogment/orchestrator:v2.0.0-rc1

ADD cogment.yaml .
ADD *.proto .

ENTRYPOINT ["orchestrator_dbg"]
CMD ["--params=cogment.yaml", "--log_level=trace"]