package com.ripplerisk.repository;

import com.ripplerisk.entity.Exposure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExposureRepository extends JpaRepository<Exposure, Long> {
    List<Exposure> findByFromEntityId(Long fromId);
    List<Exposure> findByToEntityId(Long toId);
}
