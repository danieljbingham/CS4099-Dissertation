package com.ideatogrant.backend;

import org.springframework.data.jpa.repository.JpaRepository;

interface  OpportunityRepository extends JpaRepository<Opportunity, Long> {
}
