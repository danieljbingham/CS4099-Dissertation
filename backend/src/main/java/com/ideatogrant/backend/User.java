package com.ideatogrant.backend;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.Objects;

import javax.persistence.*;

@Entity
class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String name;
    private String role;

    @OneToMany(mappedBy = "user")
    @JsonIgnoreProperties("user")
    private List<Application> applications;

    public User() {}

    public User(String name, String role) {

        this.name = name;
        this.role = role;
    }

    public String getName() {
        return this.name;
    }

    public String getRole() {
        return this.role;
    }

    public List<Application> getApplications() {
        return applications;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o)
            return true;
        if (!(o instanceof User))
            return false;
        User user = (User) o;
        return Objects.equals(this.id, user.id) && Objects.equals(this.name, user.name)
                && Objects.equals(this.role, user.role);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id, this.name, this.role);
    }

    @Override
    public String toString() {
        return "User{" + "id=" + this.id + ", name='" + this.name + '\'' + ", role='" + this.role + '\'' + '}';
    }

}
