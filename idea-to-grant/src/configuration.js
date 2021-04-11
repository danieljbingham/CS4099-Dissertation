// stores urls for accessing rest api
// to use localhost instead, change the API_PATH variable

//export const API_PATH = "https://djb28.host.cs.st-andrews.ac.uk/ideatogrant/api";
export const API_PATH = "http://localhost:50998/ideatogrant/api";
export const USERS_COLLECTION_URL = API_PATH + "/users";
export const OPPORTUNITIES_COLLECTION_URL = API_PATH + "/opportunities/search/getOpportunities";
export const OPPORTUNITIES_COLLECTION_URL_POST = API_PATH + "/opportunities";
export const SHORTLIST_COLLECTION_URL = API_PATH + "/shortlist/search/getUserShortlist";
export const SHORTLIST_COLLECTION_URL_POST = API_PATH + "/shortlist";
export const TAGS_COLLECTION_URL = API_PATH + "/opportunities/search/allTags";
export const TAGPRESET_COLLECTION_URL = API_PATH + "/tagPresets";
export const TAGGED_SEARCH_URL = API_PATH + "/opportunities/search/getTagged";
export const USER_SEARCH_URL = API_PATH + "/users/search/findUser";
