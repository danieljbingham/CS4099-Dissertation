package com.ideatogrant.backend;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
class ApplicationController {

    private final ApplicationRepository repository;
    private final ApplicationModelAssembler assembler;

    ApplicationController(ApplicationRepository repository, ApplicationModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }


    // Aggregate root
    // tag::get-aggregate-root[]
    @CrossOrigin
    @GetMapping("/applications")
    CollectionModel<EntityModel<Application>> all() {

        List<EntityModel<Application>> applications = repository.findAll().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(applications, linkTo(methodOn(ApplicationController.class).all()).withSelfRel());
    }
    // end::get-aggregate-root[]

    @CrossOrigin
    @PostMapping("/applications")
    Application newApplication(@RequestBody Application newApplication) {
        return repository.save(newApplication);
    }

    // Single item
    @CrossOrigin
    @GetMapping("/applications/{id}")
    EntityModel<Application> one(@PathVariable Long id) {

        Application application = repository.findById(id) //
                .orElseThrow(() -> new ApplicationNotFoundException(id));

        return assembler.toModel(application);
    }

    @CrossOrigin
    @PutMapping("/applications/{id}")
    Application replaceApplication(@RequestBody Application newApplication, @PathVariable Long id) {

        return repository.findById(id)
                .map(application -> {
                    application.setUser(newApplication.getUser());
                    application.setOpportunity(newApplication.getOpportunity());
                    return repository.save(application);
                })
                .orElseGet(() -> {
                    newApplication.setId(id);
                    return repository.save(newApplication);
                });
    }

    @CrossOrigin
    @DeleteMapping("/applications/{id}")
    void deleteApplication(@PathVariable Long id) {
        repository.deleteById(id);
    }
}