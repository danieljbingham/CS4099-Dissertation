package com.ideatogrant.backend;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RepositoryRestResource(collectionResourceRel = "shortlist", path = "shortlist")
interface ShortlistRepository extends PagingAndSortingRepository<Shortlist, Long> {

    @RestResource(path = "getUserShortlist", rel = "getUserShortlist")
    public Page<Shortlist> findByUserOrderByIdDesc(User user, Pageable pageable);

}
