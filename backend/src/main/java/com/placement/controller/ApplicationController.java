package com.placement.controller;

import com.placement.dto.ApplicationDto;
import com.placement.dto.StatusUpdateRequest;
import com.placement.entity.ApplicationStatus;
import com.placement.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/{jobId}")
    public ResponseEntity<ApplicationDto> apply(@PathVariable Long jobId, Authentication auth) {
        return ResponseEntity.ok(applicationService.apply(auth.getName(), jobId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationDto>> myApplications(Authentication auth) {
        return ResponseEntity.ok(applicationService.getMyApplications(auth.getName()));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationDto>> jobApplicants(@PathVariable Long jobId,
                                                               Authentication auth) {
        return ResponseEntity.ok(applicationService.getJobApplicants(jobId, auth.getName()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationDto> updateStatus(@PathVariable Long id,
                                                        @RequestBody StatusUpdateRequest request,
                                                        Authentication auth) {
        ApplicationStatus status = ApplicationStatus.valueOf(request.getStatus().toUpperCase());
        return ResponseEntity.ok(applicationService.updateStatus(id, auth.getName(), status));
    }
}
