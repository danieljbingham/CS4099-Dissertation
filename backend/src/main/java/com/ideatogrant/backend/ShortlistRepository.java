package com.ideatogrant.backend;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RepositoryRestResource(collectionResourceRel = "shortlist", path = "shortlist")
interface ShortlistRepository extends PagingAndSortingRepository<Shortlist, Long> {

    // get users shortlist, newest first
    @RestResource(path = "getUserShortlist", rel = "getUserShortlist")
    public Page<Shortlist> findByUserOrderByIdDesc(User user, Pageable pageable);

    // get shortlisted opportunities containing one or more of the given tags
    @Query("SELECT DISTINCT s FROM Shortlist s JOIN Opportunity o ON s.opportunity=o " +
            "JOIN o.tags t WHERE LOWER(t) IN (:tags) AND s.user = (:user)")
    public Page<Shortlist> getShortlistTagged(@Param("tags") List<String> tags, User user, Pageable pageable);

    // gets shortlisted opportunities with one of the given statuses
    @Query("SELECT DISTINCT s FROM Shortlist s WHERE LOWER(s.status) IN (:status) AND s.user = (:user)")
    public Page<Shortlist> getShortlistStatus(List<String> status, User user, Pageable pageable);

}
