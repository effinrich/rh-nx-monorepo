#!/bin/bash

case $1 in
  core)
    echo "082533342824"
    ;;
  dev)
    echo "743449432646"
    ;;
  staging)
    echo "262075340325"
    ;;
  prod)
    echo "745072323837"
    ;;
  *)
    echo "unknown"
    ;;
esac
