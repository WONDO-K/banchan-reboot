package com.__105.Banchan.notice.repository;

import com.__105.Banchan.notice.entitiy.Notice;
import com.__105.Banchan.notice.entitiy.NoticeImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeImageRepository extends JpaRepository<NoticeImage, Long> {

    List<NoticeImage> findAllByNotice(Notice notice);
}
