package com.ideatogrant.backend;

import javax.persistence.*;

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

    public Opportunity() {}

    public Opportunity(String title, String url, String date, String description, Status status) {
        this.title = title;
        this.url = url;
        this.date = date;
        this.description = description;
        this.status = status;
    }

    public String getDescription() {
        return this.description;
    }

    public Status getStatus() {
        return this.status;
    }

    public String getTitle() {
        return title;
    }

    public String getUrl() {
        return url;
    }

    public String getDate() {
        return date;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setDate(String date) {
        this.date = date;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Opportunity that = (Opportunity) o;

        if (id != that.id) return false;
        if (title != null ? !title.equals(that.title) : that.title != null) return false;
        if (url != null ? !url.equals(that.url) : that.url != null) return false;
        if (date != null ? !date.equals(that.date) : that.date != null) return false;
        if (description != null ? !description.equals(that.description) : that.description != null) return false;
        return status == that.status;
    }

    @Override
    public int hashCode() {
        int result = (int) (id ^ (id >>> 32));
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (url != null ? url.hashCode() : 0);
        result = 31 * result + (date != null ? date.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (status != null ? status.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Opportunity{" + "id=" + this.id + ", description='" + this.description + '\'' + ", status=" + this.status + '}';
    }

}
