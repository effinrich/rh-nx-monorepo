package com.redesignhealth.company.api.dto.prometheus;

import java.util.List;
import lombok.Getter;

@Getter
public class PrometheusMetricData {
  String resultType;
  List<PrometheusResult> result;
}
