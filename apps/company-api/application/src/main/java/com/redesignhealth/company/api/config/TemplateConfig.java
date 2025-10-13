package com.redesignhealth.company.api.config;

import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.spring6.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.templatemode.TemplateMode;

@Configuration
public class TemplateConfig {

  public TemplateConfig(
      ApplicationContext context,
      TemplateEngine templateEngine,
      ThymeleafProperties thymeleafProperties) {
    SpringResourceTemplateResolver textResolver = new SpringResourceTemplateResolver();
    textResolver.setApplicationContext(context);
    textResolver.setPrefix(thymeleafProperties.getPrefix());
    textResolver.setSuffix(".txt");
    textResolver.setTemplateMode(TemplateMode.TEXT);
    templateEngine.addTemplateResolver(textResolver);
  }
}
