package com.ideatogrant.backend;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RepositoryRestResource(collectionResourceRel = "opportunities", path = "opportunities")
interface OpportunityRepository extends PagingAndSortingRepository<Opportunity, Long> {

    /*
    @RestResource(path = "findTitle", rel = "findTitle")
    Page<Opportunity> findByTitleContainingIgnoreCase(String title, Pageable pageable);
     */

    @Query("SELECT DISTINCT o FROM Opportunity o JOIN o.tags t WHERE LOWER(t) IN (:tags)")
    List<Opportunity> getTagged(@Param("tags") List<String> tags);

    /*@Query("SELECT DISTINCT(tags) FROM Opportunity ")
    List<String> getAllTags();*/
}
