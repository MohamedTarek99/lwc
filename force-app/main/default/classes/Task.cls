public with sharing class Task {
  @AuraEnabled(cacheable=true)
  public static Resturant__c getResturantByName(String Resturant) {
    Resturant__c[] resturantWithBranches = [
      SELECT
        Name,
        Type__c,
        (
          SELECT
            Name,
            Building__c,
            City__c,
            Location__c,
            Street__c,
            Zip_Code__c,
            Drive_Through__c
          FROM Branches__r
        )
      FROM Resturant__c
      WHERE Name = :Resturant
    ];
    if (resturantWithBranches.size() != 0) {
      return resturantWithBranches[0];
    } else {
      return null;
    }
  }

  @AuraEnabled
  public static Branch__c createBranch(Branch__c branch) {
    insert branch;
    return branch;
  }

  @AuraEnabled
  public static void updateBranches(Object data) {
    List<Branch__c> branchesToUpdate = (List<Branch__c>) JSON.deserialize(
      JSON.serialize(data),
      List<Branch__c>.class
    );
    update branchesToUpdate;
  }
}
