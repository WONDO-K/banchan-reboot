package com.__105.Banchan.ask.repository;

import com.__105.Banchan.ask.entity.Ask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AskRepository extends JpaRepository<Ask, Long>, JpaSpecificationExecutor<Ask> {
}
