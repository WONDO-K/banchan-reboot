package com.__105.Banchan.notice.repository;

import com.__105.Banchan.notice.entitiy.Notice;
import org.springframework.data.jpa.domain.Specification;

public class NoticeSpecification {

    public static Specification<Notice> containsKeyword(String keyword) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.or(
                        criteriaBuilder.like(root.get("title"), "%" + keyword + "%"),
                        criteriaBuilder.like(root.get("content"), "%" + keyword + "%")
                );
    }

    public static Specification<Notice> whereApt(String code) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("apartment").get("code"), code));
    }

    // 관리자가 아닌 경우 자신의 글만 볼 수 있게 설정
    public static Specification<Notice> whereUser(Long userId) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user").get("id"), userId));
    }
}
