#! /bin/bash
export COMPANY_API_HOSTNAME=company-api.dev.redesignhealth.com
export REMOTE_WRITE_PROMETHEUS_URL=https://aps-workspaces.us-east-1.amazonaws.com/workspaces/ws-8943f929-6c32-43a6-83ff-068611ca1db3/api/v1/remote_write

scripts/generate-config.sh
