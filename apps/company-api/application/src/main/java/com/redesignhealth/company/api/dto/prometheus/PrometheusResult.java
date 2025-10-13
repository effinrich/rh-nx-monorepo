package com.redesignhealth.company.api.dto.prometheus;

import java.util.List;
import java.util.Map;
import lombok.Getter;

@Getter
public class PrometheusResult {
  Map<String, String> metric;
  List<Object> value;
}
