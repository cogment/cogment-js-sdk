FROM cogment/orchestrator:v2.0.0-rc1

ADD cogment.yaml .
ADD *.proto .

ENTRYPOINT ["orchestrator"]
CMD ["--params=cogment.yaml"]