#! /bin/bash
export COMPANY_API_HOSTNAME=company-api.dev.redesignhealth.com
export REMOTE_WRITE_PROMETHEUS_URL=https://aps-workspaces.us-east-1.amazonaws.com/workspaces/ws-2249b6fe-cfc7-4391-bd94-fa4d1aa9df3a/api/v1/remote_write

scripts/generate-config.sh
