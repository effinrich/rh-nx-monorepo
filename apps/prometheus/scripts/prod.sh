#! /bin/bash
export COMPANY_API_HOSTNAME=company-api.redesignhealth.com
export REMOTE_WRITE_PROMETHEUS_URL=https://aps-workspaces.us-east-1.amazonaws.com/workspaces/ws-1ce2da05-4638-4027-91e5-5c92373cd8ea/api/v1/remote_write

scripts/generate-config.sh
