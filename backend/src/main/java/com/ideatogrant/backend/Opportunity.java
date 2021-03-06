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
    @Column(columnDefinition = "TEXT")
    private String dates;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(columnDefinition = "TEXT")
    private String fundingDescription;
    private boolean isFullEcon;
    private boolean isPublic;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "TAGS") @Column(name = "TAG")
    private Set<String> tags = new HashSet<>();

    public Opportunity(String title, String url, String dates, String description, String fundingDescription,
                       boolean isFullEcon, boolean isPublic, Set<String> tags) {
        this.title = title;
        this.url = url;
        this.dates = dates;
        this.description = description;
        this.fundingDescription = fundingDescription;
        this.isFullEcon = isFullEcon;
        this.isPublic = isPublic;
        this.tags = tags;
    }
}
