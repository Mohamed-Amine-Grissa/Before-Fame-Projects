package com.example.Telsa.infrastructure.adapters.storage;

import com.example.Telsa.domain.ports.FileStorage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class LocalFileStorage implements FileStorage {

    private static final Logger log = LoggerFactory.getLogger(LocalFileStorage.class);

    private final String uploadDirectory;

    public LocalFileStorage(@Value("${upload.directory}") String uploadDirectory) {
        this.uploadDirectory = uploadDirectory;
    }

    @Override
    public String store(MultipartFile file, String subfolder) throws IOException {
        try {
            Path targetDir = Paths.get(uploadDirectory, subfolder);
            Files.createDirectories(targetDir);

            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf('.'));
            }

            String filename = UUID.randomUUID() + extension;
            Path targetPath = targetDir.resolve(filename).toAbsolutePath();

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return targetPath.toString();
        } catch (IOException ex) {
            log.error("Failed to store file", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File storage failed", ex);
        }
    }
}

