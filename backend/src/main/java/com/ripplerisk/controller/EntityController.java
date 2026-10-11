package com.ripplerisk.controller;

import com.ripplerisk.entity.RiskEntity;
import com.ripplerisk.repository.RiskEntityRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entities")
@RequiredArgsConstructor
public class EntityController {

    private final RiskEntityRepository repo;

    @GetMapping
    public List<RiskEntity> all() {
        return repo.findAll();
    }

    @PostMapping
    public RiskEntity create(@Valid @RequestBody RiskEntity entity) {
        return repo.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RiskEntity> update(@PathVariable Long id, @Valid @RequestBody RiskEntity body) {
        return repo.findById(id).map(e -> {
            e.setName(body.getName());
            e.setType(body.getType());
            e.setBalance(body.getBalance());
            e.setStatus(body.getStatus());
            return ResponseEntity.ok(repo.save(e));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
