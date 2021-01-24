package com.ideatogrant.backend;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

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
    private String role;

    @OneToMany(mappedBy = "user", cascade={CascadeType.ALL})
    @JsonIgnoreProperties("user")
    private List<Application> applications;

    public User(String name, String role) {

        this.name = name;
        this.role = role;
    }

    @Override
    public String toString() {
        return "User{" + "id=" + this.id + ", name='" + this.name + '\'' + ", role='" + this.role + '\'' + '}';
    }

}
