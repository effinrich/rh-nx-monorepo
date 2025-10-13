package rhsp.opcofin;

import java.util.Collections;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.util.matcher.PathPatternParserServerWebExchangeMatcher;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;

@Configuration
@EnableWebFlux
@EnableCaching
@EnableScheduling
public class OpcofinConfig {

    @Value("${subsidiaries.disallow}")
    private List<Integer> disallowedSubsidiaryIdsFromConfig;

    @Bean
    SecurityWebFilterChain apiHttpSecurity(ServerHttpSecurity http) {
        return http
                .securityMatcher(new PathPatternParserServerWebExchangeMatcher("/api/**"))
                .csrf().disable()
                .build();
    }

    @Bean
    public List<Integer> disallowedSubsidiaryIds() {
        return Collections.unmodifiableList(disallowedSubsidiaryIdsFromConfig);
    }

    @Bean
     public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(); 
     }
}
