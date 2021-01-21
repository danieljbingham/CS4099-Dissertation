package com.ideatogrant.backend;

class ApplicationNotFoundException extends RuntimeException {

    ApplicationNotFoundException(Long id) {
        super("Could not find application " + id);
    }
}