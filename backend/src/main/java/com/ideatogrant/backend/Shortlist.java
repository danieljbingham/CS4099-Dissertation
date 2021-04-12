package com.ideatogrant.backend;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
class Shortlist {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    // a user can have many shortlisted items, a shortlisted item can only belong to one user
    @ManyToOne
    @JoinColumn(name = "USER_ID", referencedColumnName = "ID")
    @JsonIgnoreProperties("shortlist")
    private User user;

    // an opportunity can be in many shortlists, a shortlisted item only refers to one opportunity
    @ManyToOne
    @JoinColumn(name = "OPPORTUNITY_ID", referencedColumnName = "ID")
    private Opportunity opportunity;

    @Column(columnDefinition = "TEXT")
    private String urls;

    @Column(columnDefinition = "TEXT")
    private String status;

    //@Column(columnDefinition="TEXT default '[{\"title\":\"\",\"checked\":false}]'")
    @Column(columnDefinition="TEXT default '[]'")
    private String checklist;

    // constructor for all fields except id (it is autogenerated)
    public Shortlist(User user, Opportunity opportunity, String urls, String status, String checklist) {
        this.user = user;
        this.opportunity = opportunity;
        this.urls = urls;
        this.status = status;
        this.checklist = checklist;
    }
}
