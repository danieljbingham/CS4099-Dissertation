package com.ideatogrant.backend;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "applications", path = "applications")
interface ApplicationRepository extends PagingAndSortingRepository<Application, Long> {

}
