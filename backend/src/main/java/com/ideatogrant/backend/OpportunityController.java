package com.ideatogrant.backend;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.MediaTypes;
import org.springframework.hateoas.mediatype.problem.Problem;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
public class OpportunityController {

    private final OpportunityRepository opportunityRepository;
    private final OpportunityModelAssembler assembler;

    OpportunityController(OpportunityRepository opportunityRepository, OpportunityModelAssembler assembler) {

        this.opportunityRepository = opportunityRepository;
        this.assembler = assembler;
    }

    @CrossOrigin
    @GetMapping("/opportunities")
    CollectionModel<EntityModel<Opportunity>> all() {

        List<EntityModel<Opportunity>> opportunities = opportunityRepository.findAll().stream() //
                .map(assembler::toModel) //
                .collect(Collectors.toList());

        return CollectionModel.of(opportunities, //
                linkTo(methodOn(OpportunityController.class).all()).withSelfRel());
    }

    @CrossOrigin
    @GetMapping("/opportunities/{id}")
    EntityModel<Opportunity> one(@PathVariable Long id) {

        Opportunity opportunity = opportunityRepository.findById(id) //
                .orElseThrow(() -> new OpportunityNotFoundException(id));

        return assembler.toModel(opportunity);
    }

    @CrossOrigin
    @PostMapping("/opportunities")
    ResponseEntity<EntityModel<Opportunity>> newOpportunity(@RequestBody Opportunity opportunity) {

        opportunity.setStatus(Status.IN_PROGRESS);
        Opportunity newOpportunity = opportunityRepository.save(opportunity);

        return ResponseEntity //
                .created(linkTo(methodOn(OpportunityController.class).one(newOpportunity.getId())).toUri()) //
                .body(assembler.toModel(newOpportunity));
    }

    /*
    @CrossOrigin
    @DeleteMapping("/opportunities/{id}/cancel")
    ResponseEntity<?> cancel(@PathVariable Long id) {

        Opportunity opportunity = opportunityRepository.findById(id) //
                .orElseThrow(() -> new OpportunityNotFoundException(id));

        if (opportunity.getStatus() == Status.IN_PROGRESS) {
            opportunity.setStatus(Status.CANCELLED);
            return ResponseEntity.ok(assembler.toModel(opportunityRepository.save(opportunity)));
        }

        return ResponseEntity //
                .status(HttpStatus.METHOD_NOT_ALLOWED) //
                .header(HttpHeaders.CONTENT_TYPE, MediaTypes.HTTP_PROBLEM_DETAILS_JSON_VALUE) //
                .body(Problem.create() //
                        .withTitle("Method not allowed") //
                        .withDetail("You can't cancel an order that is in the " + opportunity.getStatus() + " status"));
    }*/

    /*
    @CrossOrigin
    @PutMapping("/opportunities/{id}/complete")
    ResponseEntity<?> complete(@PathVariable Long id) {

        Opportunity opportunity = opportunityRepository.findById(id) //
                .orElseThrow(() -> new OpportunityNotFoundException(id));

        if (opportunity.getStatus() == Status.IN_PROGRESS) {
            opportunity.setStatus(Status.COMPLETED);
            return ResponseEntity.ok(assembler.toModel(opportunityRepository.save(opportunity)));
        }

        return ResponseEntity //
                .status(HttpStatus.METHOD_NOT_ALLOWED) //
                .header(HttpHeaders.CONTENT_TYPE, MediaTypes.HTTP_PROBLEM_DETAILS_JSON_VALUE) //
                .body(Problem.create() //
                        .withTitle("Method not allowed") //
                        .withDetail("You can't complete an order that is in the " + opportunity.getStatus() + " status"));
    }*/
}
