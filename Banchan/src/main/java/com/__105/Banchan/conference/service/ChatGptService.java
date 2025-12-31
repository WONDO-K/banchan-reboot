package com.__105.Banchan.conference.service;

import com.__105.Banchan.conference.config.ChatGptConfig;
import com.__105.Banchan.conference.dto.ChatGptRequestDto;
import com.__105.Banchan.conference.dto.ChatGptResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class ChatGptService {

    private static final RestTemplate restTemplate = new RestTemplate();

    private final ChatGptConfig chatGptConfig;

    public HttpEntity<ChatGptRequestDto> buildHttpEntity(ChatGptRequestDto requestDto) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(chatGptConfig.getMediaType()));
        headers.add(chatGptConfig.getAUTHORIZATION(), chatGptConfig.getBEARER() + chatGptConfig.getApiKey());
        return new HttpEntity<>(requestDto, headers);
    }

    public ChatGptResponseDto getResponse(HttpEntity<ChatGptRequestDto> chatGptRequestDtoHttpEntity) {
        ResponseEntity<ChatGptResponseDto> responseEntity = restTemplate.postForEntity(
                chatGptConfig.getUrl(),
                chatGptRequestDtoHttpEntity,
                ChatGptResponseDto.class);

        return responseEntity.getBody();
    }

    public ChatGptResponseDto askQuestion(String text) {
        ChatGptRequestDto.Message systemMessage = new ChatGptRequestDto.Message("system", "You are a helpful assistant.");
        String prompt = String.format("다음은 아파트 반상회의 회의 내용입니다.\n" +
                        "회의 내용:\n%s" +
                        " \n주어진 회의 내용을 아래의 양식에 맞춰서 요약해 주세요:\n\n" +
                        "회의 요약\n\n" +
                        "1. \n" +
                        "    a. \n" +
                        "    b. \n\n" +
                        "2. \n" +
                        "    a. \n" +
                        "    b. \n" +
                        "    c. \n\n" +
                        "3. \n" +
                        "    a. \n" +
                        "    b. \n" +
                        "    c. \n\n" +
                        "4. \n.......",
                text);
        ChatGptRequestDto.Message userMessage = new ChatGptRequestDto.Message("user", prompt);

        ChatGptRequestDto request = new ChatGptRequestDto(
                chatGptConfig.getModel(),
                Arrays.asList(systemMessage, userMessage),
                chatGptConfig.getMaxToken(),
                chatGptConfig.getTemperature(),
                chatGptConfig.getTopP()
        );

        return this.getResponse(this.buildHttpEntity(request));
    }
}