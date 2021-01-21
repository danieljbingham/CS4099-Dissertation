package com.ideatogrant.backend;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

@Entity
class Application {

    @Id @GeneratedValue
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "USER_ID", referencedColumnName = "ID")
    @JsonIgnoreProperties("applications")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "OPPORTUNITY_ID", referencedColumnName = "ID")
    private Opportunity opportunity;

    public Application() {}

    public Application(User user, Opportunity opportunity) {
        this.user = user;
        this.opportunity = opportunity;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Opportunity getOpportunity() {
        return opportunity;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setOpportunity(Opportunity opportunity) {
        this.opportunity = opportunity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Application that = (Application) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (user != null ? !user.equals(that.user) : that.user != null) return false;
        return opportunity != null ? opportunity.equals(that.opportunity) : that.opportunity == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (user != null ? user.hashCode() : 0);
        result = 31 * result + (opportunity != null ? opportunity.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Application{" +
                "id=" + id +
                ", user=" + user +
                ", opportunity=" + opportunity +
                '}';
    }
}