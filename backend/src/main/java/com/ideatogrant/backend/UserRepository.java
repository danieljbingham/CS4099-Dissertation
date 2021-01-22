package com.ideatogrant.backend;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "users", path = "users")
interface UserRepository extends PagingAndSortingRepository<User, Long> {

}
