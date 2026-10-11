package com.ripplerisk.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entities")
@Data
@NoArgsConstructor
public class RiskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntityType type;

    @Column(nullable = false)
    private Double balance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntityStatus status = EntityStatus.HEALTHY;

    public enum EntityType  { LENDER, BORROWER, CENTRAL_BANK }
    public enum EntityStatus { HEALTHY, DISTRESSED, FAILED }
}
