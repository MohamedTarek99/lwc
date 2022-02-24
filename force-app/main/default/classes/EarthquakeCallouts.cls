public with sharing class EarthquakeCallouts {
  public static HttpResponse earthquakeGetCallouts(Integer rows) {
    Http http = new Http();
    HttpRequest request = new HttpRequest();
    request.setEndpoint(
      'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=' +
      rows
    );
    request.setMethod('GET');
    HttpResponse response = http.send(request);

    return response;
  }
}
