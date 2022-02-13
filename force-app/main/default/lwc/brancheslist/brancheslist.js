import { LightningElement, wire } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Branch__c.Name';
import STREET_FIELD from '@salesforce/schema/Branch__c.Street__c';
import BUILDING_FIELD from '@salesforce/schema/Branch__c.Building__c';
import CITY_FIELD from '@salesforce/schema/Branch__c.City__c';
import DRIVE_THROUGH_FIELD from  '@salesforce/schema/Branch__c.Drive_Through__c';
import ZIP_CODE_FIELD from  '@salesforce/schema/Branch__c.Zip_Code__c';
import searchForResturants from '@salesforce/apex/Task.searchForResturants';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex'
import createBranch from '@salesforce/apex/Task.createBranch';

const COLUMNS = [
    { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text' },
    { label: 'City', fieldName: CITY_FIELD.fieldApiName, type: 'text' },
    { label: 'Street', fieldName: STREET_FIELD.fieldApiName, type: 'text'}, 
    { label: 'Building', fieldName: BUILDING_FIELD.fieldApiName, type: 'text'}, 
    { label: 'Zip Code', fieldName: ZIP_CODE_FIELD.fieldApiName, type: 'text'},
    { label: 'Drive Through', fieldName: DRIVE_THROUGH_FIELD.fieldApiName, type: 'boolean'}, 

];
const DELAY = 300;

export default class AccountList extends LightningElement {
    columns = COLUMNS;
    // searchKey = '';
     Resturant='';
     searchKey='';
     message='';
     error='';
     rec = {
         Name:'',
         Street__c:'',
         City__c:'',
         Building__c:'',
         Zip_Code__c:'',
         Drive_Through__c:false
       
    }
    branches;

    @wire(searchForResturants,{ Resturant: '$searchKey' })
    fetchAcc(response) {
        this.branches = response;
    }
    
    handleNameChange(event) {
        this.rec.Name = event.target.value;
    }

    handleCityChange(event) {
        this.rec.City__c = event.target.value;
    }
    
    handleStreetChange(event) {
        this.rec.Street__c = event.target.value;
    }
    
    handleBuildingChange(event) {
        this.rec.Building__c = event.target.value;
       
    }   
    handleZipChange(event) {
        this.rec.Zip_Code__c = event.target.value;
       
    } 
    handleDriveChange(event) {
        this.rec.Drive_Through__c = event.target.checked;

       
    } 
    
    handleKeyChange(event) {
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
    }
    handleCreate(){
        console.log("rec")
        this.rec.Resturant__c=this.branches.data.Id
        console.log(this.rec)
        
        console.log(this.branches.data)
        createBranch({ branch : this.rec })
        .then(result => {
            this.message = result;
            this.error = undefined;
            if(this.message !== undefined) {
                this.rec.Name = '';
                this.rec.Street__c = '';
                this.rec.Building__c = '';
                this.rec.Zip_Code__c = '';
                this.rec.DriveThrough__c = false;
                this.rec.City__c='';
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Branch created',
                        variant: 'success',
                    }),
                );
            }
            refreshApex(this.branches);

            console.log(JSON.stringify(result));
            console.log("result", this.message);
        })
        .catch(error => {
            this.message = undefined;
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
            console.log(this.rec);
            console.log("error", JSON.stringify(this.error));
        });
}
}