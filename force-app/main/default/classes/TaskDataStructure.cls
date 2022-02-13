public with sharing class TaskDataStructure {
    private  Map<String, Resturant__c> Branches_To_Resturant;

    public TaskDataStructure() {
        Branches_To_Resturant = new Map<String, Resturant__c>(); // Define a new map
    }

    public void AddBranchToResturant(String branch,Resturant__c resturant){
        Branches_To_Resturant.put(branch,resturant); 
    }
    public Resturant__c GetResturantByBranch(String branch){
       return Branches_To_Resturant.get(branch);
    }
    
    public override String toString(){
        String result='';
        for(String Branch: Branches_To_Resturant.keySet()){
          result=result+'Branch: ' + Branch + '  Resturant: ' + Branches_To_Resturant.get(Branch)+'\n';
          
       }
       return result;

    }

}
