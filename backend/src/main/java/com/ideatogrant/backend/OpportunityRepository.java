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
@RepositoryRestResource(collectionResourceRel = "opportunities", path = "opportunities")
interface OpportunityRepository extends PagingAndSortingRepository<Opportunity, Long> {

    @Query("SELECT DISTINCT o FROM Opportunity o JOIN o.tags t WHERE LOWER(t) IN (:tags) AND o.publicOpportunity = true")
    List<Opportunity> getTagged(@Param("tags") List<String> tags);

    @RestResource(path = "getOpportunities", rel = "getOpportunities")
    public Page<Opportunity> findByPublicOpportunityTrueOrderByIdDesc(Pageable pageable);


}
