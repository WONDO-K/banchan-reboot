package com.__105.Banchan.notice.dto;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class SearchCondition {

    private String keyword;
    private String sortBy;
    private String sortDirection;
    private int page;
    private int size;
}
