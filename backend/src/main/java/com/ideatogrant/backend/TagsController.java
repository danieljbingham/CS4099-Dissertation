package com.ideatogrant.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.hateoas.*;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@BasePathAwareController
public class TagsController {

    @Autowired
    private EntityManager entityManager;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @RequestMapping(method = GET, value = "/opportunities/search/allTags")
    public @ResponseBody ResponseEntity<?> getAllTags() {

        Query query = entityManager.createNativeQuery("SELECT DISTINCT TAG FROM TAGS");
        List<String> results = query.getResultList();

        CollectionModel<String> resources = new CollectionModel<>(results);
        resources.add(linkTo(methodOn(TagsController.class).getAllTags()).withSelfRel());

        return ResponseEntity.ok(resources);
    }

}
