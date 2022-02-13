// ContactController.cls
public with sharing class ContactController {    
    @AuraEnabled(cacheable=true)
    public static List<Contact> findContacts(String searchKey) {
        String key = '%' + searchKey + '%';
        return [
            SELECT Id, Name, Title, Phone, Email
            FROM Contact
            WHERE Name LIKE :key
            WITH SECURITY_ENFORCED
            LIMIT 10
        ];
    }
}