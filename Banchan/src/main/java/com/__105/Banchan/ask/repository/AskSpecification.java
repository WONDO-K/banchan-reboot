package com.__105.Banchan.ask.repository;

import com.__105.Banchan.ask.entity.Ask;
import org.springframework.data.jpa.domain.Specification;

public class AskSpecification {

    public static Specification<Ask> containsKeyword(String keyword) {
        return (root, query, cb) ->
                cb.or(
                        cb.like(root.get("title"), "%" + keyword + "%"),
                        cb.like(root.get("content"), "%" + keyword + "%")
                );
    }

    public static Specification<Ask> whereApt(String code) {
        return ((root, query, cb) ->
                cb.equal(root.get("apt").get("code"), code));
    }

    public static Specification<Ask> wherUser(Long userId) {
        return ((root, query, cb) ->
                cb.equal(root.get("user").get("id"), userId));
    }
}
