package com.ideatogrant.backend;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "opportunities", path = "opportunities")
interface  OpportunityRepository extends PagingAndSortingRepository<Opportunity, Long> {
}
