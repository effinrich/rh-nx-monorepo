package com.redesignhealth.ff4jrh.service;

import com.redesignhealth.ff4jrh.config.FF4jConfig;
import org.ff4j.FF4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

@Service
public class FF4jService {
    private FF4j ff4j;
    public FF4jService(FF4j ff4j) {
        this.ff4j = ff4j;
    }
    @Bean
    public CommandLineRunner commandLineRunner() {
        return args -> {
            while (true) {
                if (ff4j.check(FF4jConfig.HELLO_FEATURE)) {
                    System.out.println("Hello TechPrimers");
                } else {
                    System.out.println("Hello World");
                }
                Thread.sleep(5000);
            }
        };
    }
}
