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
class TagPreset {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String title;

    @ManyToOne
    @JoinColumn(name = "USER_ID", referencedColumnName = "ID")
    @JsonIgnoreProperties("tagPresets")
    private User user;

    @ElementCollection(fetch = FetchType.EAGER)
    //@CollectionTable(name = "TAG_PRESET") @Column(name = "TAG")
    private Set<String> tags = new HashSet<>();

    public TagPreset(String title, User user, Set<String> tags) {
        this.title = title;
        this.user = user;
        this.tags = tags;
    }


}
