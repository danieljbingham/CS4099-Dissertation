package com.ideatogrant.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

@Configuration
class LoadDatabase {

    private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, OpportunityRepository opportunityRepository,
                                   ApplicationRepository applicationRepository) {

        return args -> {
            User u = new User("Jack Bauer", "researcher");
            log.info("Preloading " + userRepository.save(u));
            log.info("Preloading " + userRepository.save(new User("David Palmer", "bdm")));

            log.info("Preloading " + opportunityRepository.save(new Opportunity("AI Systems Hardware/Software Co-Design",
                    "https://research.fb.com/programs/research-awards/proposals/ai-systems-hardware-software-co-design-request-for-proposals/",
                    "15/04/2021",
                    "This supports research in the area of artificial intelligence hardware and algorithm codesign. " +
                            "A total of six awards are available, worth up to USD 50,000 each.")));
            log.info("Preloading " + opportunityRepository.save(new Opportunity("AI Exploration Program",
                    "https://beta.sam.gov/opp/667875ba2f464ccfa38688ea1a718fe7/view",
                    "19/08/2021",
                    "This supports exploratory research on a range of artificial intelligence related topics that will be " +
                            "periodically solicited as artificial intelligence exploration opportunities through publication of " +
                            "pre-solicitation notices. Multiple awards are anticipated.")));

            Optional<User> u1 = userRepository.findById(1L);
            User u2 = u1.get();
            Optional<Opportunity> o1 = opportunityRepository.findById(3L);
            Opportunity o2 = o1.get();

            Application a = new Application(u2, o2, "WOWW");
            log.info("Preloading " + applicationRepository.save(a));

            Optional<Opportunity> o3 = opportunityRepository.findById(4L);
            Opportunity o4 = o3.get();

            Application a1 = new Application(u2, o2, "WOWW");
            //log.info("Preloading " + applicationRepository.save(a1));

        };
    }
}