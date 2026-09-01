package com.placement.service;

import com.placement.dto.JobDto;
import com.placement.entity.Job;
import com.placement.entity.Role;
import com.placement.entity.User;
import com.placement.exception.ResourceNotFoundException;
import com.placement.repository.JobRepository;
import com.placement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public List<JobDto> getAllActiveJobs(String keyword, String location) {
        List<Job> jobs;
        if ((keyword != null && !keyword.isBlank()) || (location != null && !location.isBlank())) {
            jobs = jobRepository.searchJobs(
                    (keyword != null && keyword.isBlank()) ? null : keyword,
                    (location != null && location.isBlank()) ? null : location
            );
        } else {
            jobs = jobRepository.findByActiveTrueOrderByCreatedAtDesc();
        }
        return jobs.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public JobDto createJob(String recruiterEmail, JobDto dto) {
        User recruiter = userRepository.findByEmail(recruiterEmail).orElseThrow();
        Job job = Job.builder()
                .recruiter(recruiter)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .requiredSkills(dto.getRequiredSkills())
                .salary(dto.getSalary())
                .location(dto.getLocation())
                .deadline(dto.getDeadline())
                .active(true)
                .build();
        return mapToDto(jobRepository.save(job));
    }

    public List<JobDto> getRecruiterJobs(String email) {
        User recruiter = userRepository.findByEmail(email).orElseThrow();
        return jobRepository.findByRecruiterIdOrderByCreatedAtDesc(recruiter.getId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public JobDto updateJob(Long id, String email, JobDto dto) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (!job.getRecruiter().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized: you can only edit your own jobs");
        }
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setRequiredSkills(dto.getRequiredSkills());
        job.setSalary(dto.getSalary());
        job.setLocation(dto.getLocation());
        job.setDeadline(dto.getDeadline());
        return mapToDto(jobRepository.save(job));
    }

    public void deleteJob(Long id, String email) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        User user = userRepository.findByEmail(email).orElseThrow();
        if (user.getRole() != Role.ADMIN && !job.getRecruiter().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        job.setActive(false);
        jobRepository.save(job);
    }

    private JobDto mapToDto(Job job) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setSalary(job.getSalary());
        dto.setLocation(job.getLocation());
        dto.setDeadline(job.getDeadline());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setRecruiterName(job.getRecruiter().getName());
        dto.setRecruiterId(job.getRecruiter().getId());
        dto.setApplicationCount(job.getApplications() != null ? job.getApplications().size() : 0);
        return dto;
    }
}
