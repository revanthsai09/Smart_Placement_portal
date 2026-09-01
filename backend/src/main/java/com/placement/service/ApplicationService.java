package com.placement.service;

import com.placement.dto.ApplicationDto;
import com.placement.entity.Application;
import com.placement.entity.ApplicationStatus;
import com.placement.entity.Job;
import com.placement.entity.User;
import com.placement.exception.ResourceNotFoundException;
import com.placement.repository.ApplicationRepository;
import com.placement.repository.JobRepository;
import com.placement.repository.StudentProfileRepository;
import com.placement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;

    public ApplicationDto apply(String studentEmail, Long jobId) {
        User student = userRepository.findByEmail(studentEmail).orElseThrow();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.isActive()) throw new RuntimeException("This job is no longer active");
        if (applicationRepository.existsByStudentIdAndJobId(student.getId(), jobId)) {
            throw new RuntimeException("You have already applied for this job");
        }

        Application application = Application.builder()
                .student(student)
                .job(job)
                .status(ApplicationStatus.APPLIED)
                .build();

        return mapToDto(applicationRepository.save(application));
    }

    public List<ApplicationDto> getMyApplications(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail).orElseThrow();
        return applicationRepository.findByStudentIdOrderByAppliedAtDesc(student.getId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<ApplicationDto> getJobApplicants(Long jobId, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (!job.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        return applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ApplicationDto updateStatus(Long applicationId, String recruiterEmail, ApplicationStatus status) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        if (!app.getJob().getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        app.setStatus(status);
        return mapToDto(applicationRepository.save(app));
    }

    private ApplicationDto mapToDto(Application app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        dto.setStatus(app.getStatus().name());
        dto.setAppliedAt(app.getAppliedAt());
        dto.setJobId(app.getJob().getId());
        dto.setJobTitle(app.getJob().getTitle());
        dto.setJobLocation(app.getJob().getLocation());
        dto.setJobSalary(app.getJob().getSalary());
        dto.setStudentId(app.getStudent().getId());
        dto.setStudentName(app.getStudent().getName());
        dto.setStudentEmail(app.getStudent().getEmail());

        studentProfileRepository.findByUserId(app.getStudent().getId()).ifPresent(profile -> {
            dto.setResumeUrl(profile.getResumeUrl());
            dto.setStudentCgpa(profile.getCgpa());
            dto.setStudentSkills(profile.getSkills());
            dto.setStudentCollege(profile.getCollege());
            dto.setStudentBranch(profile.getBranch());
            dto.setStudentYear(profile.getYear());
        });

        return dto;
    }
}
