import {
    LightningElement,
    wire
} from 'lwc';
import NAME_FIELD from '@salesforce/schema/Earthquake__c.Name';
import PLACE_FIELD from '@salesforce/schema/Earthquake__c.Place__c';
import MAGNITUDE_FIELD from '@salesforce/schema/Earthquake__c.Magnitude__c';
import DATE_FIELD from '@salesforce/schema/Earthquake__c.Date__c';
import getEarthquakesByPlace from '@salesforce/apex/EarthquakeController.getEarthquakesByPlace';
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
    },
    {
        label: 'Place',
        fieldName: PLACE_FIELD.fieldApiName,
        type: 'text'
    },
    {
        label: 'Date',
        fieldName: DATE_FIELD.fieldApiName,
        type: 'date'
    },
    {
        label: 'Magnitude',
        fieldName: MAGNITUDE_FIELD.fieldApiName,
        type: 'number',
    }


];
const DELAY = 300;
export default class Earthquakelist extends LightningElement {
    searchKey = '';
    columns = COLUMNS;


    @wire(getEarthquakesByPlace, {
        place: '$searchKey'
    })
    earthquakes;
    handleKeyChange(event) {
        try {
            window.clearTimeout(this.delayTimeout);
            const searchKey = event.target.value;
            console.log(this.earthquakes)
            console.log(searchKey)
            this.delayTimeout = setTimeout(() => {
                this.searchKey = searchKey;
            }, DELAY);
        } catch (error) {
            console.log(error)
        }
    }

}