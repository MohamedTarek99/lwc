public with sharing class Task {
    @AuraEnabled(cacheable=true)
public static Resturant__c searchForResturants(String Resturant){
Resturant__c[] ResturantWithBranches = [SELECT Name,Type__c, (SELECT Name,Building__c,City__c,Location__c,Street__c,Zip_Code__c,Drive_Through__c FROM Branches__r)
                          FROM Resturant__c 
                          WHERE Name =:Resturant];
if(ResturantWithBranches.size()!=0){
return ResturantWithBranches[0];
}else{
    return null;
}

}

@AuraEnabled
    public static Branch__c createBranch(Branch__c branch) {
        system.debug('acc'+branch);
        insert branch;
        return branch;
    }


}
