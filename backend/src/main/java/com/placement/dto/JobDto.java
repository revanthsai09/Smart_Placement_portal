package com.placement.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
public class JobDto {
    private Long id;
    private String title;
    private String description;
    private String requiredSkills;
    private String salary;
    private String location;
    private LocalDate deadline;
    private LocalDateTime createdAt;
    private String recruiterName;
    private Long recruiterId;
    private int applicationCount;
}
