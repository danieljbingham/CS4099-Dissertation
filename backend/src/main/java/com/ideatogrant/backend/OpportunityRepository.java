package com.ideatogrant.backend;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RepositoryRestResource(collectionResourceRel = "opportunities", path = "opportunities")
interface  OpportunityRepository extends PagingAndSortingRepository<Opportunity, Long> {

    @RestResource(path = "findTitle", rel = "findTitle")
    List<Opportunity> findByTitleContainingIgnoreCase(String title);
}
