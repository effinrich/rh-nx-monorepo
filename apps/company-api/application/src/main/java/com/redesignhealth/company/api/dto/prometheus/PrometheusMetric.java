package com.redesignhealth.company.api.dto.prometheus;

import lombok.Getter;

@Getter
public class PrometheusMetric {
  String status;
  PrometheusMetricData data;
}
