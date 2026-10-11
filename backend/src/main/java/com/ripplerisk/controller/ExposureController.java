package com.ripplerisk.controller;

import com.ripplerisk.entity.Exposure;
import com.ripplerisk.repository.ExposureRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exposures")
public class ExposureController {

    private final ExposureRepository repo;

    public ExposureController(ExposureRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Exposure> all() {
        return repo.findAll();
    }

    @PostMapping
    public Exposure create(@RequestBody Exposure exposure) {
        return repo.save(exposure);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
