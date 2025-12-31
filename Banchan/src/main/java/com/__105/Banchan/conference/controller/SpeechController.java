package com.__105.Banchan.conference.controller;

import com.__105.Banchan.conference.dto.ChatGptResponseDto;
import com.__105.Banchan.conference.service.ChatGptService;
import com.__105.Banchan.conference.service.OpenViduService;
import com.__105.Banchan.conference.service.SpeechService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/speech")
public class SpeechController {

    private final SpeechService speechService;
    private final ChatGptService chatGptService;
    private final OpenViduService openViduService;

    @PostMapping("/{roomId}")
    public ResponseEntity<?> summaryConf(@PathVariable Long roomId) {

        String text = speechService.summaryConf(roomId);
        ChatGptResponseDto responseDto = chatGptService.askQuestion(text);

        String content = responseDto.getChoices()
                .get(0)
                .getMessage()
                .getContent();

        openViduService.saveSummuryRecord(roomId, content);

        return ResponseEntity.ok().body(responseDto);
    }

//    @PostMapping("/{sessionId}")
//    public String convertFile(@PathVariable String sessionId) {
//
//        try {
//            // AudioConvertor 인스턴스 생성
//            AudioConvertor audioConvertor = new AudioConvertor();
//            audioConvertor.convertFile(sessionId);
//            return "Conversion completed for session: " + sessionId;
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "Error occurred during conversion for session: " + sessionId;
//        }
//    }
}