package com.redesignhealth.company.api.client.prometheus;

import com.redesignhealth.company.api.dto.prometheus.PrometheusMetric;

public interface PrometheusClient {
  PrometheusMetric getCounterValues(String counter);
}
