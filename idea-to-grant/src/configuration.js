// stores urls for accessing rest api

class Configuration {
  USERS_COLLECTION_URL = "http://localhost:8080/api/users";
  OPPORTUNITIES_COLLECTION_URL = "http://localhost:8080/api/opportunities/search/getOpportunities";
  OPPORTUNITIES_COLLECTION_URL_POST = "http://localhost:8080/api/opportunities";
  APPLICATIONS_COLLECTION_URL = "http://localhost:8080/api/users/1/applications";
  SHORTLIST_COLLECTION_URL = "http://localhost:8080/api/shortlist";
  TAGS_COLLECTION_URL = "http://localhost:8080/api/opportunities/search/allTags";
  TAGPRESET_COLLECTION_URL = "http://localhost:8080/api/tagPresets";
  TAGGED_SEARCH_URL = "http://localhost:8080/api/opportunities/search/getTagged";
  USER_SEARCH_URL = "http://localhost:8080/api/users/search/findUser";
}

export default Configuration;