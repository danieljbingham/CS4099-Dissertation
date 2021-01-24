package com.ideatogrant.backend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

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
    private Status status;


    public Opportunity(String title, String url, String date, String description, Status status) {
        this.title = title;
        this.url = url;
        this.date = date;
        this.description = description;
        this.status = status;
    }

}
