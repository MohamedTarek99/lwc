import {
    LightningElement,
    wire
} from 'lwc';
import NAME_FIELD from '@salesforce/schema/Branch__c.Name';
import STREET_FIELD from '@salesforce/schema/Branch__c.Street__c';
import BUILDING_FIELD from '@salesforce/schema/Branch__c.Building__c';
import CITY_FIELD from '@salesforce/schema/Branch__c.City__c';
import DRIVE_THROUGH_FIELD from '@salesforce/schema/Branch__c.Drive_Through__c';
import ZIP_CODE_FIELD from '@salesforce/schema/Branch__c.Zip_Code__c';
import getResturantByName from '@salesforce/apex/Task.getResturantByName';
import updateBranches from '@salesforce/apex/Task.updateBranches';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
import {
    refreshApex
} from '@salesforce/apex'
import createBranch from '@salesforce/apex/Task.createBranch';

const COLUMNS = [{
        label: 'Name',
        fieldName: NAME_FIELD.fieldApiName,
        type: 'text',
        editable: true
    },
    {
        label: 'City',
        fieldName: CITY_FIELD.fieldApiName,
        type: 'text',
        editable: true
    },
    {
        label: 'Street',
        fieldName: STREET_FIELD.fieldApiName,
        type: 'text',
        editable: true
    },
    {
        label: 'Building',
        fieldName: BUILDING_FIELD.fieldApiName,
        type: 'text',
        editable: true
    },
    {
        label: 'Zip Code',
        fieldName: ZIP_CODE_FIELD.fieldApiName,
        type: 'text',
        editable: true
    },
    {
        label: 'Drive Through',
        fieldName: DRIVE_THROUGH_FIELD.fieldApiName,
        type: 'boolean',
        editable: true
    },

];
const DELAY = 300;
const errorTitleMessage = 'An Error has occured!';
const updateSuccessBodyMessage = 'Branches updated succesfully!'
const insertSuccessBodyMessage = 'Branch added succesfully!'
const successTitleMessage = "Success"
export default class BranchList extends LightningElement {

    columns = COLUMNS;
    draftValues = [];
    resturant = '';
    searchKey = '';
    message = '';
    error = '';
    newRow = false;
    record = {
        Name: '',
        Street__c: '',
        City__c: '',
        Building__c: '',
        Zip_Code__c: '',
        Drive_Through__c: false

    }
    branches

    @wire(getResturantByName, {
        Resturant: '$searchKey'
    })
    fetchResturant(response) {
        this.branches = response


    }


    handleNameChange(event) {
        this.record.Name = event.target.value;

        this.branches = this.branches

    }

    handleCityChange(event) {

        this.record.City__c = event.target.value;
    }

    handleStreetChange(event) {
        this.record.Street__c = event.target.value;
    }

    handleBuildingChange(event) {
        this.record.Building__c = event.target.value;

    }
    handleZipChange(event) {
        this.record.Zip_Code__c = event.target.value;

    }
    handleDriveChange(event) {
        this.record.Drive_Through__c = event.target.checked;


    }
    handleNew(event) {
        this.newRow = true
    }
    handleCancel(event) {
        this.record.Name = '';
        this.record.Street__c = '';
        this.record.Building__c = '';
        this.record.Zip_Code__c = '';
        this.record.Drive_Through__c = false;
        this.record.City__c = '';
        this.newRow = false;
    }
    handleKeyChange(event) {
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
    }
    handleCreate() {
        console.log("record")
        this.record.Resturant__c = this.branches.data.Id

        createBranch({
                branch: this.record
            })
            .then(result => {
                this.message = result;
                this.error = undefined;
                if (this.message) {
                    this.record.Name = '';
                    this.record.Street__c = '';
                    this.record.Building__c = '';
                    this.record.Zip_Code__c = '';
                    this.record.Drive_Through__c = false;
                    this.record.City__c = '';
                    this.newRow = false;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: successTitleMessage,
                            message: insertSuccessBodyMessage,
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
                        title: errorTitleMessage,
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                console.log(this.record);
                console.log("error", JSON.stringify(this.error));
            });
    }

    async handleSave(event) {
        const updatedFields = event.detail.draftValues;



        try {
            const result = await updateBranches({
                data: updatedFields
            });
            this.dispatchEvent(
                new ShowToastEvent({
                    title: successTitleMessage,
                    message: updateSuccessBodyMessage,
                    variant: 'success'
                })
            );



            refreshApex(this.branches).then(() => {
                this.draftValues = [];
            });
        } catch (error) {
            console.log(error)
            this.dispatchEvent(
                new ShowToastEvent({
                    title: errorTitleMessage,
                    message: error.body.message,
                    variant: 'error'
                })
            );
        };
    }

}