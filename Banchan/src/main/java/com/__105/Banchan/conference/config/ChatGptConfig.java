package com.__105.Banchan.conference.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "chatgpt")
@Getter
@Setter
public class ChatGptConfig {
    private final String AUTHORIZATION = "Authorization";
    private final String BEARER = "Bearer ";
    private String apiKey;
    private String model;
    private Integer maxToken;
    private Double temperature;
    private Double topP;
    private String mediaType;
    private String url;
}
