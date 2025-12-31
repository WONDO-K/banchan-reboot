package com.__105.Banchan.conference.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatGptResponseDto implements Serializable {

    private List<Choice> choices;

    @Builder
    public ChatGptResponseDto(List<Choice> choices) {
        this.choices = choices;
    }

}