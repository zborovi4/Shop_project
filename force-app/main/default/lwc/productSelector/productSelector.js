/**
 * Created by OleksandrZborovskyi on 12.01.2022.
 */

import { LightningElement, track, wire, api } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import PRODUCT2_OBJECT from '@salesforce/schema/Product2';
import CATEGORY_FIELD from '@salesforce/schema/Product2.Category__c';
const CATEGORY_RECORD_TYPE_NAME = 'Category';

export default class Selector extends LightningElement {
    selectedProductId;
    error;
    @track categories = [];
    @track listModel = [];
    @track recordTypeId;
    @api valueCategory = '';
    @api valueModel = '';

    handleProductSelected(event) {
        this.selectedProductId = event.detail;
    }

    handleCategoryValueUpdate(event) {
        this.valueCategory = event.detail.value;
        this.selectedProductId = undefined;
    }

    handleModelValueUpdate(event){
        this.valueModel = event.detail.value;
        this.selectedProductId = undefined;
    }

    handleListModelUpdate(event){
        this.listModel = event.detail;
    }

    @wire(getObjectInfo, { objectApiName: PRODUCT2_OBJECT })
    wiredObjectInfo({error, data}) {
        if (data) {
            const rtis = data.recordTypeInfos;
            this.recordTypeId = Object.keys(rtis).find(rti => rtis[rti].name === CATEGORY_RECORD_TYPE_NAME);
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: '$recordTypeId',
        fieldApiName: CATEGORY_FIELD
    })
    getPicklistValues({ error, data }) {
        if (data) {
            this.categories = data.values.map(plValue => {
                return {
                    label: plValue.label,
                    value: plValue.value
                };
            });
        }
    }
}