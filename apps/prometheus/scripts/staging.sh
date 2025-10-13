#! /bin/bash
export COMPANY_API_HOSTNAME=company-api.staging.redesignhealth.com
export REMOTE_WRITE_PROMETHEUS_URL=https://aps-workspaces.us-east-1.amazonaws.com/workspaces/ws-970892b0-d7aa-416e-b209-0f813f10c48c/api/v1/remote_write

scripts/generate-config.sh
