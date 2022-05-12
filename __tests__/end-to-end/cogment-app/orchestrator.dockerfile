FROM cogment/cogment:v2.3.0

ADD cogment.yaml .
ADD *.proto .

CMD ["services", "orchestrator", "--params=cogment.yaml", "--log_level=trace", "--actor_http_port=8081"]