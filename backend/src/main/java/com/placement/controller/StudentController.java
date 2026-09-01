package com.placement.controller;

import com.placement.dto.StudentProfileDto;
import com.placement.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<StudentProfileDto> getProfile(Authentication auth) {
        return ResponseEntity.ok(studentService.getProfile(auth.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<StudentProfileDto> updateProfile(Authentication auth,
                                                            @RequestBody StudentProfileDto dto) {
        return ResponseEntity.ok(studentService.updateProfile(auth.getName(), dto));
    }

    @PostMapping("/profile/resume")
    public ResponseEntity<Map<String, String>> uploadResume(Authentication auth,
                                                             @RequestParam("file") MultipartFile file) throws IOException {
        String url = studentService.uploadResume(auth.getName(), file);
        return ResponseEntity.ok(Map.of("resumeUrl", url));
    }
}
