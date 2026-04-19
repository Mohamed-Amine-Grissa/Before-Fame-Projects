package com.example.Telsa.domain.ports;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorage {
    String store(MultipartFile file, String subfolder) throws IOException;
}

