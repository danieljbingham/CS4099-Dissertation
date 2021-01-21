package com.ideatogrant.backend;

import org.springframework.data.jpa.repository.JpaRepository;

interface ApplicationRepository extends JpaRepository<Application, Long> {

}
