#!/bin/bash

attempt_counter=0
max_attempts=5

until $(curl --output /dev/null --silent --head --fail $BASE_URL/actuator/health); do
    if [ ${attempt_counter} -eq ${max_attempts} ];then
      echo "Error connecting to API after multiple attempts. Exiting."
      exit 1
    fi

    echo 'Waiting for API to respond...🐢'
    attempt_counter=$(($attempt_counter+1))
    sleep 5
done
