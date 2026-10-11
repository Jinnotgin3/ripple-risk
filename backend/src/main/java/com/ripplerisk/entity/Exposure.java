package com.ripplerisk.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exposures")
@Data
@NoArgsConstructor
public class Exposure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_entity_id", nullable = false)
    private RiskEntity fromEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_entity_id", nullable = false)
    private RiskEntity toEntity;

    @Column(nullable = false)
    private Double amount;
}
