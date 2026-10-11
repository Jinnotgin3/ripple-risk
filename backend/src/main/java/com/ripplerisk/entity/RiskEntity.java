package com.ripplerisk.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "entities")
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

    public RiskEntity() {}

    public RiskEntity(Long id, String name, EntityType type, Double balance, EntityStatus status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.balance = balance;
        this.status = status != null ? status : EntityStatus.HEALTHY;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public EntityType getType() { return type; }
    public void setType(EntityType type) { this.type = type; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }

    public EntityStatus getStatus() { return status; }
    public void setStatus(EntityStatus status) { this.status = status; }

    public enum EntityType { LENDER, BORROWER, CENTRAL_BANK }
    public enum EntityStatus { HEALTHY, DISTRESSED, FAILED }
}
