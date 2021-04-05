// stores urls for accessing rest api

class Configuration {
  USERS_COLLECTION_URL = "https://djb28.host.cs.st-andrews.ac.uk/api/users";
  OPPORTUNITIES_COLLECTION_URL = "https://djb28.host.cs.st-andrews.ac.uk/api/opportunities/search/getOpportunities";
  OPPORTUNITIES_COLLECTION_URL_POST = "https://djb28.host.cs.st-andrews.ac.uk/api/opportunities";
  APPLICATIONS_COLLECTION_URL = "https://djb28.host.cs.st-andrews.ac.uk/api/users/1/applications";
  SHORTLIST_COLLECTION_URL = "https://djb28.host.cs.st-andrews.ac.uk/api/shortlist/search/getUserShortlist";
  TAGS_COLLECTION_URL = "https://djb28.host.cs.st-andrews.ac.uk/api/opportunities/search/allTags";
  TAGPRESET_COLLECTION_URL = "https://djb28.host.cs.st-andrews.ac.uk/api/tagPresets";
  TAGGED_SEARCH_URL = "https://djb28.host.cs.st-andrews.ac.uk/api/opportunities/search/getTagged";
  USER_SEARCH_URL = "https://djb28.host.cs.st-andrews.ac.uk/api/users/search/findUser";
}

export default Configuration;