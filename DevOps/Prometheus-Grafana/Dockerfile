FROM prom/alertmanager:latest

ARG ALERT_PASS

COPY alertmanager.yml /etc/alertmanager/

RUN sed -i 's|\${ALERT_PASS}|'"$ALERT_PASS"'|g' /etc/alertmanager/alertmanager.yml

EXPOSE 9093

CMD ["--config.file=/etc/alertmanager/alertmanager.yml"]