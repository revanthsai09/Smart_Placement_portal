package com.placement.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
public class ApplicationDto {
    private Long id;
    private String status;
    private LocalDateTime appliedAt;
    private Long jobId;
    private String jobTitle;
    private String jobLocation;
    private String jobSalary;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String resumeUrl;
    private BigDecimal studentCgpa;
    private String studentSkills;
    private String studentCollege;
    private String studentBranch;
    private Integer studentYear;
}
