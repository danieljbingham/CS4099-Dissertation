package com.ideatogrant.backend;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.lang.Nullable;

import java.util.List;
import java.util.Objects;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String name;
    @Column(unique=true)
    private String email;
    private String role;

    @OneToMany(mappedBy = "user", cascade={CascadeType.ALL})
    @JsonIgnoreProperties("user")
    private List<Application> applications;

    @OneToMany(mappedBy = "user", cascade={CascadeType.ALL})
    @JsonIgnoreProperties("user")
    private List<TagPreset> tagPresets;

    public User(String name, String email, String role) {

        this.name = name;
        this.email = email;
        this.role = role;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
