TEMPLATE_FILE=prometheus-template.yml
OUTPUT_FILE=prometheus.yml
TEMP_FILE=temp.yml

cp $TEMPLATE_FILE $OUTPUT_FILE

# Make SED Backwards Compatible between GNU and FreeBSD by using -e instead of -i
sed -e "s%{{COMPANY_API_HOSTNAME}}%$COMPANY_API_HOSTNAME%g" \
    -e "s%{{REMOTE_WRITE_PROMETHEUS_URL}}%$REMOTE_WRITE_PROMETHEUS_URL%g" \
    $OUTPUT_FILE > $TEMP_FILE

mv -- $TEMP_FILE $OUTPUT_FILE
echo Generated $OUTPUT_FILE
