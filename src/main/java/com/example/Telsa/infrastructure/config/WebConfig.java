package com.example.Telsa.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS Configuration for Frontend-Backend Communication
 *
 * ARCHITECTURAL RATIONALE:
 * ========================
 *
 * Problem: Spring Security blocks requests from frontend (different port)
 * Solution: Explicitly define allowed origins and methods
 *
 * Why This Approach:
 * - Centralized CORS policy (single source of truth)
 * - Easy to update for different environments
 * - More secure than @CrossOrigin on each controller
 * - Follows Spring best practices
 *
 * @author Senior Full-Stack Architect
 * @version 1.0
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // ALLOWED ORIGINS: Where requests can come from
                .allowedOrigins(
                    "http://localhost:3000",      // Standard React dev server port
                    "http://localhost:5173",      // Vite dev server port
                    "http://127.0.0.1:3000",      // Localhost alias (IPv4)
                    "http://127.0.0.1:5173",      // Localhost alias (IPv4) - Vite
                    "http://localhost:4173"       // Vite preview mode
                )
                // ALLOWED METHODS: What HTTP verbs are permitted
                .allowedMethods(
                    "GET",      // Read data
                    "POST",     // Create data
                    "PUT",      // Update data
                    "DELETE",   // Remove data
                    "PATCH",    // Partial update
                    "OPTIONS"   // CORS preflight
                )
                // ALLOWED HEADERS: What headers client can send
                .allowedHeaders(
                    "Content-Type",      // JSON payloads
                    "Authorization",     // Future JWT tokens
                    "Accept",           // Response format preference
                    "X-Requested-With"  // AJAX requests
                )
                // CREDENTIALS: Allow cookies/auth headers in requests
                .allowCredentials(true)
                // CACHE: Browser can cache preflight for 1 hour
                .maxAge(3600);
    }
}

