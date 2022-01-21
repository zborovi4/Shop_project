/**
 * Created by OleksandrZborovskyi on 12.01.2022.
 */

import { LightningElement, wire, api } from 'lwc';
import getProducts from '@salesforce/apex/ProductControllerLwc.getProducts';

export default class List extends LightningElement {
    searchCategory = '';
    searchModel = '';
    @api listModel = [];
    products = [];
    error;

    connectedCallback() {
        this.invokeLoadAllProducts();
    }

    set category(value) {
        this.searchCategory = value;
        this.searchModel = '';
        this.listModel = [];
        this.invokeLoadProducts();
        this.loadModels();
    }

    @api get category(){
        return this.searchCategory;
    }

    set model(value) {
        this.searchModel = value;
        this.invokeLoadProducts();
    }

    @api get model(){
        return this.searchModel;
    }

    async invokeLoadAllProducts() {
        try {
            debugger;
            this.products = await getProducts({category: '', model: ''});
            this.loadModels();
        } catch(error) {
            console.log('error', error);
        }
    }
    async invokeLoadProducts() {
        try {
            debugger;
            this.products = await getProducts({category: this.searchCategory, model: this.searchModel});
        } catch(error) {
            console.log('error', error);
        }
    }
    loadModels(){
        debugger;
        this.listModel = [];
        if( this.products.length > 0){
            this.selListModels(this.products);
        }
        const changeListModel = new CustomEvent("changelistmodel", {
            detail: this.listModel
        });
        this.dispatchEvent(changeListModel);
    }

    handleTileClick(evt) {
        const event = new CustomEvent('productselected', {
            detail: evt.detail
        });
        this.dispatchEvent(event);
    }

    removeDuplicates(arr){
        let s = new Set(arr);
        let it = s.values();
        return Array.from(it);
    }

    selListModels(data){
        let models = [];
        for(let i = 0; i<data.length; i++){
            if(!!data[i].Model__c){
                models.push(data[i].Model__c);
            }
        }
        models = this.removeDuplicates(models);
        for(let i = 0; i<models.length; i++){
            this.listModel.push({label: models[i], value: models[i]});
        }
    }
}