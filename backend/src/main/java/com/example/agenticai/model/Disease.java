// src/main/java/com/example/agenticai/model/Disease.java
package com.example.agenticai.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Disease {
    private String name;
    private List<String> symptoms;
    private List<String> precautions;
    private Prescription prescription;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Prescription {
        private List<String> medications;
        private String dosage;
        private String duration;
    }
}
