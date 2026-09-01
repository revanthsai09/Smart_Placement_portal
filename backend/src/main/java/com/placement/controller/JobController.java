package com.placement.controller;

import com.placement.dto.JobDto;
import com.placement.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<JobDto>> getAllJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(jobService.getAllActiveJobs(keyword, location));
    }

    @GetMapping("/my")
    public ResponseEntity<List<JobDto>> getMyJobs(Authentication auth) {
        return ResponseEntity.ok(jobService.getRecruiterJobs(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<JobDto> createJob(Authentication auth, @RequestBody JobDto dto) {
        return ResponseEntity.ok(jobService.createJob(auth.getName(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobDto> updateJob(@PathVariable Long id,
                                             Authentication auth,
                                             @RequestBody JobDto dto) {
        return ResponseEntity.ok(jobService.updateJob(id, auth.getName(), dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, Authentication auth) {
        jobService.deleteJob(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
