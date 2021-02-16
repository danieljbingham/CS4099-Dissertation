package com.ideatogrant.backend;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
class Shortlist {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    //@ManyToOne(fetch=FetchType.LAZY)
    @ManyToOne
    @JoinColumn(name = "USER_ID", referencedColumnName = "ID")
    @JsonIgnoreProperties("applications")
    private User user;

    //@ManyToOne(fetch=FetchType.LAZY)
    @ManyToOne
    @JoinColumn(name = "OPPORTUNITY_ID", referencedColumnName = "ID")
    private Opportunity opportunity;

    public Shortlist(User user, Opportunity opportunity) {
        this.user = user;
        this.opportunity = opportunity;
    }
}