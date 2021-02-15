package com.ideatogrant.backend;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String title;
    private String url;
    private String date;
    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "TAGS") @Column(name = "TAG")
    private Set<String> tags = new HashSet<>();

    public Opportunity(String title, String url, String date, String description, Set<String> tags) {
        this.title = title;
        this.url = url;
        this.date = date;
        this.description = description;
        this.tags = tags;
    }


}
