package com.__105.Banchan.conference.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.speech.v1.SpeechClient;
import com.google.cloud.speech.v1.SpeechSettings;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.io.IOException;

@Configuration
@Profile("prod")
public class GoogleCloudConfig {

    @Bean
    public SpeechClient speechClient() throws IOException {

        GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();

        SpeechSettings speechSettings = SpeechSettings.newBuilder()
                .setCredentialsProvider(() -> credentials)
                .build();

        return SpeechClient.create(speechSettings);
    }
}
