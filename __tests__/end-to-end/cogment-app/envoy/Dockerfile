FROM envoyproxy/envoy:v1.15.3

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod 0755 /usr/local/bin/wait-for-it.sh

COPY ./etc/envoy/envoy.yaml /etc/envoy/envoy.yaml

CMD /usr/local/bin/envoy -c /etc/envoy/envoy.yaml
