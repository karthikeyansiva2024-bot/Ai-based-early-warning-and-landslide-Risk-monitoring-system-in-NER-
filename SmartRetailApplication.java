package com.smartretail;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartRetailApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartRetailApplication.class, args);
        System.out.println("==================================================");
        System.out.println(" Smart Retail Spring Boot Enterprise Server Ready ");
        System.out.println(" Edge AI, Inventory & FIFO Queue Services Active  ");
        System.out.println("==================================================");
    }
}
