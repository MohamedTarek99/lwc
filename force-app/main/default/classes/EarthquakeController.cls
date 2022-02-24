public with sharing class EarthquakeController {
  public static void earthquakePopulate(Integer rows) {
    HttpResponse response = EarthquakeCallouts.earthquakeGetCallouts(rows);
    if (response.getStatusCode() == 200) {
      // Deserializes the JSON string into collections of primitive data types.
      Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(
        response.getBody()
      );
      // Cast the values in the 'animals' key as a list
      List<Object> features = (List<Object>) results.get('features');
      List<Earthquake__c> earthquakesToInsert = new List<Earthquake__c>();
      for (Object feature : features) {
        Map<String, Object> earthquake = (Map<String, Object>) feature;
        Map<String, Object> properties = (Map<String, Object>) earthquake.get(
          'properties'
        );
        Double magnititude = (Double) properties.get('mag');
        String title = (String) properties.get('title');
        String place = (String) properties.get('place');
        DateTime myDateTime = DateTime.newInstance(
          (Long) properties.get('time')
        );
        List<String> placeArray = place.split(',');
        String location = placeArray[placeArray.size() - 1];
        earthquakesToInsert.add(
          new Earthquake__c(
            Name = title,
            Place__c = location,
            Magnitude__c = magnititude,
            Date__c = myDateTime
          )
        );
      }
      insert (earthquakesToInsert);
    }
  }
  @AuraEnabled(cacheable=true)
  public static List<Earthquake__c> getEarthquakesByPlace(String place) {
    String searchKey = '%' + place + '%';
    System.debug(searchKey);
    return [
      SELECT Name, Place__c, Magnitude__c, Date__c
      FROM Earthquake__c
      WHERE Place__c LIKE :searchKey
    ];
  }
}
