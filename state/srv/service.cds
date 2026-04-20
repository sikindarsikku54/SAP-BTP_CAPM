service LocationService {

  type District {
    name : String;
  }

  function getDistricts(state : String) returns array of District;

}