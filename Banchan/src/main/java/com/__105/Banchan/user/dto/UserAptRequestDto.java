package com.__105.Banchan.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(name = "UserAptRequestDto", description = "아파트 정보 초기 설정 요청 Dto")
public class UserAptRequestDto {

        @Schema(description = "아파트 코드", example = "APT001")
        private String aptCode;

        @Schema(description = "건물 번호", example = "B1")
        private String buildingNo;

        @Schema(description = "유닛 번호", example = "101")
        private String unitNo;


}
