package com.ideatogrant.backend;

class OpportunityNotFoundException extends RuntimeException {

    OpportunityNotFoundException(Long id) {
        super("Could not find opportunity " + id);
    }
}