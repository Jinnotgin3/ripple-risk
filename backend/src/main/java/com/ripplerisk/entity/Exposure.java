package com.ripplerisk.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "exposures")
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

    public Exposure() {}

    public Exposure(Long id, RiskEntity fromEntity, RiskEntity toEntity, Double amount) {
        this.id = id;
        this.fromEntity = fromEntity;
        this.toEntity = toEntity;
        this.amount = amount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RiskEntity getFromEntity() { return fromEntity; }
    public void setFromEntity(RiskEntity fromEntity) { this.fromEntity = fromEntity; }

    public RiskEntity getToEntity() { return toEntity; }
    public void setToEntity(RiskEntity toEntity) { this.toEntity = toEntity; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}
