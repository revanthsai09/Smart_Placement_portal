package com.placement.service;

import com.placement.dto.StudentProfileDto;
import com.placement.entity.StudentProfile;
import com.placement.entity.User;
import com.placement.exception.ResourceNotFoundException;
import com.placement.repository.StudentProfileRepository;
import com.placement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    public StudentProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        return mapToDto(profile);
    }

    public StudentProfileDto updateProfile(String email, StudentProfileDto dto) {
        User user = userRepository.findByEmail(email).orElseThrow();
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElse(StudentProfile.builder().user(user).build());

        profile.setCollege(dto.getCollege());
        profile.setBranch(dto.getBranch());
        profile.setYear(dto.getYear());
        profile.setCgpa(dto.getCgpa());
        profile.setSkills(dto.getSkills());

        studentProfileRepository.save(profile);
        return mapToDto(profile);
    }

    public String uploadResume(String email, MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new RuntimeException("File is empty");
        String originalName = file.getOriginalFilename();
        if (originalName == null || !originalName.toLowerCase().endsWith(".pdf")) {
            throw new RuntimeException("Only PDF files are allowed");
        }

        User user = userRepository.findByEmail(email).orElseThrow();
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        String filename = "resume_" + user.getId() + "_" + System.currentTimeMillis() + ".pdf";
        Path uploadPath = Paths.get("uploads");
        Files.createDirectories(uploadPath);
        Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

        profile.setResumeUrl("/uploads/" + filename);
        studentProfileRepository.save(profile);
        return profile.getResumeUrl();
    }

    private StudentProfileDto mapToDto(StudentProfile profile) {
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(profile.getId());
        dto.setName(profile.getUser().getName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setCollege(profile.getCollege());
        dto.setBranch(profile.getBranch());
        dto.setYear(profile.getYear());
        dto.setCgpa(profile.getCgpa());
        dto.setSkills(profile.getSkills());
        dto.setResumeUrl(profile.getResumeUrl());
        return dto;
    }
}
