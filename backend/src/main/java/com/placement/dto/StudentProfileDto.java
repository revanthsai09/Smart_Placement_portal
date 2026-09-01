package com.placement.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter
public class StudentProfileDto {
    private Long id;
    private String name;
    private String email;
    private String college;
    private String branch;
    private Integer year;
    private BigDecimal cgpa;
    private String skills;
    private String resumeUrl;
}
