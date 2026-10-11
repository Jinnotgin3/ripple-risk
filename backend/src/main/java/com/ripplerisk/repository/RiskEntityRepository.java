package com.ripplerisk.repository;

import com.ripplerisk.entity.RiskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiskEntityRepository extends JpaRepository<RiskEntity, Long> {}
