package com.ideatogrant.backend;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

@Component
class ApplicationModelAssembler implements RepresentationModelAssembler<Application, EntityModel<Application>> {

    @Override
    public EntityModel<Application> toModel(Application application) {

        return EntityModel.of(application, //
                linkTo(methodOn(ApplicationController.class).one(application.getId())).withSelfRel(),
                linkTo(methodOn(ApplicationController.class).all()).withRel("applications"));
    }
}