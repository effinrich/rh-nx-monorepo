#!/bin/bash
cd apps/company-api/
fileFormatted=($(mvn com.spotify.fmt:fmt-maven-plugin:format | grep -i -E 'Processed [0-9]{3} files \([1-9]+' | wc -l))
if [[ "$fileFormatted" -ne 0 ]];
then
    echo "Format Failed validation"
    cd ../../
    exit 1
fi;
cd ../../
