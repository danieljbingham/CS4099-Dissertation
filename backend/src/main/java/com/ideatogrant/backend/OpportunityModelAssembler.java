package com.ideatogrant.backend;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

@Component
class OpportunityModelAssembler implements RepresentationModelAssembler<Opportunity, EntityModel<Opportunity>> {

    @Override
    public EntityModel<Opportunity> toModel(Opportunity opportunity) {

        // Unconditional links to single-item resource and aggregate root

        EntityModel<Opportunity> opportunityModel = EntityModel.of(opportunity,
                linkTo(methodOn(OpportunityController.class).one(opportunity.getId())).withSelfRel(),
                linkTo(methodOn(OpportunityController.class).all()).withRel("opportunities"));

        /*
        // Conditional links based on state of the opportunity

        if (opportunity.getStatus() == Status.IN_PROGRESS) {
            opportunityModel.add(linkTo(methodOn(OpportunityController.class).cancel(opportunity.getId())).withRel("cancel"));
            opportunityModel.add(linkTo(methodOn(OpportunityController.class).complete(opportunity.getId())).withRel("complete"));
        }*/

        return opportunityModel;
    }

}
