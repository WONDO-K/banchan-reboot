package com.__105.Banchan.admin.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(name = "ApprovalRequestDto", description = "승인 요청 Dto")
public class ApprovalRequestDto {

        @Schema(description = "유저 이름", example = "test")
        private String username;

        @Schema(description = "승인 여부", example = "true")
        private Boolean isApproval;
}
