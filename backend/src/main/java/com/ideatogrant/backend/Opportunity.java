package com.ideatogrant.backend;
import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
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
    private boolean fullEcon;
    private boolean publicOpportunity;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "TAGS") @Column(name = "TAG")
    private Set<String> tags = new HashSet<>();

    public Opportunity(String title, String url, String dates, String description, String fundingDescription,
                       boolean fullEcon, boolean publicOpportunity, Set<String> tags) {
        this.title = title;
        this.url = url;
        this.dates = dates;
        this.description = description;
        this.fundingDescription = fundingDescription;
        this.fullEcon = fullEcon;
        this.publicOpportunity = publicOpportunity;
        this.tags = tags;
    }

}
