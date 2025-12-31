package com.__105.Banchan.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL) // DTO 를 JSON으로 변환 시 null값인 field 제외
public class StatusResponseDto {

    private Integer status;
    private String message; // 메시지 필드 추가
    private Object data;

    // 기본 생성자
    public StatusResponseDto(Integer status) {
        this.status = status;
    }

    // 메시지와 함께 상태 코드를 설정하는 생성자
    public StatusResponseDto(Integer status, String message) {
        this.status = status;
        this.message = message;
    }

    // 메시지와 데이터와 함께 상태 코드를 설정하는 생성자
    public StatusResponseDto(Integer status, String message, Object data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    // 상태 코드와 메시지를 포함한 응답을 생성하는 메서드
    public static StatusResponseDto addStatus(Integer status, String message) {
        return new StatusResponseDto(status, message);
    }

    // 상태 코드와 메시지, 데이터를 포함한 응답을 생성하는 메서드
    public static StatusResponseDto addStatus(Integer status, String message, Object data) {
        return new StatusResponseDto(status, message, data);
    }
}