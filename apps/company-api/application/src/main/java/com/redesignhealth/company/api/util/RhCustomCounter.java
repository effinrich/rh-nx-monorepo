package com.redesignhealth.company.api.util;

import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.Counter;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class RhCustomCounter {
  private static Counter buyerViewCustomCounter = null;

  public static final String BUYER_VIEW_COUNTER = "custom_buyer_view_counter";
  public static final String LABEL_BUYER_VIEW_COUNTER = "buyer_view";

  public RhCustomCounter(CollectorRegistry registry) {
    initBuyerViewCounters(registry);
  }

  public static void increment(
      String buyerEmail, String ipMarketplaceApiId, Set<String> existingBuyerViews) {
    uniqueIncrement(buyerEmail, ipMarketplaceApiId, existingBuyerViews);
  }

  public static String sanitizeEmail(String email) {
    return email.replace('@', '_').replace('.', '_');
  }

  private static void initBuyerViewCounters(CollectorRegistry registry) {
    buyerViewCustomCounter =
        Counter.build()
            .name(BUYER_VIEW_COUNTER)
            .help("Buyer view")
            .labelNames(LABEL_BUYER_VIEW_COUNTER)
            .register(registry);
  }

  private static void uniqueIncrement(
      String buyerEmail, String ipMarketplaceApiId, Set<String> existingBuyerViews) {
    var key = sanitizeEmail(buyerEmail) + "_" + ipMarketplaceApiId;
    if (!existingBuyerViews.contains(key)) {
      buyerViewCustomCounter.labels(key).inc();
      existingBuyerViews.add(key);
    }
  }
}
