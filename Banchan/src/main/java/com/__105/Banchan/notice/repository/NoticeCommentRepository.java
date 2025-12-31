package com.__105.Banchan.notice.repository;

import com.__105.Banchan.notice.entitiy.Notice;
import com.__105.Banchan.notice.entitiy.NoticeComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeCommentRepository extends JpaRepository<NoticeComment, Long> {

    List<NoticeComment> findAllByNotice(Notice notice);
}
