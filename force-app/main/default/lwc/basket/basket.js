/**
 * Created by OleksandrZborovskyi on 14.01.2022.
 */

import {LightningElement, track, api} from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import insertOrderItems from '@salesforce/apex/BasketControllerLwc.insertOrderItems';

const ORDER_STATUS = 'New';
const COLUMNS = [
    { label: 'Name', fieldName: 'name', editable: false },
    { label: 'Category', fieldName: 'category', editable: false },
    { label: 'Price', fieldName: 'price', type: 'currency', editable: false },
    { label: 'Amount', fieldName: 'amount', type: 'currency', editable: false },
    { label: 'Quantity', fieldName: 'quantity', type: 'number', editable: true },
    {type: 'button', typeAttributes: {
            label: 'Delete',
            name: 'Delete',
            title: 'Delete',
            disabled: false,
            value: 'delete',
            iconPosition: 'left'
        }},
];

export default class Basket extends LightningElement {
    @api totalQuantity = 0;
    @api totalAmount = 0;
    dataProducts = [];
    columns = COLUMNS;
    rowOffset = 0;
    product;
    error;
    saveDraftValues;
    available;
    headerModal = '';
    bodyModal = '';

    @track showModal = false;
    @track showNegativeButton;
    @track showPositiveButton = true;
    @track positiveButtonLabel = 'Close';

    @api
    get basketProducts(){
        return this.dataProducts;
    }
    set basketProducts(value){
        debugger;
        this.dataProducts = JSON.parse(JSON.stringify(value));
    }

    recalcTotalQuantity(){
        this.totalQuantity = 0;
        for(let i = 0; i < this.dataProducts.length; i++){
            this.totalQuantity += parseInt(this.dataProducts[i].quantity);
        }
        this.totalQuantityChange();
    }
    recalcTotalAmount(){
        this.totalAmount = 0;
        for(let i = 0; i < this.dataProducts.length; i++){
            this.totalAmount += parseFloat(this.dataProducts[i].quantity * this.dataProducts[i].price);
        }
    }
    callRowAction( event ) {
        const recId =  event.detail.row.id;
        const recQuantity = parseInt(event.detail.row.quantity);
        const recAmount = parseFloat(event.detail.row.amount);
        const actionName = event.detail.action.name;
        if ( actionName === 'Delete' ) {
            this.removeRecordInBasket(recId, recQuantity, recAmount);
        }
    }
    removeRecordInBasket(prodId, prodQuantiy, recAmount){
        this.totalQuantity -= parseInt(prodQuantiy);
        this.totalAmount -= parseFloat(recAmount);
        this.dataProducts = [...this.dataProducts.filter(row => row.id !== prodId)];
        this.totalQuantityChange();
    }

    handleCreateOrder(){
        this.createOrder();
    }

    handleClearBasket(){
        this.clearBasket();
    }

    createOrder(){
        debugger;
        let fields = {'Status__c' : ORDER_STATUS};
        let objOrderInput = {'apiName' : 'Order__c', fields};
        let orderName = '';
        createRecord(objOrderInput).then(response => {
            debugger;
            orderName = response.fields.Name.value;
            let orderItems = this.dataProducts.map(item => {
                return {
                    Order__c: response.id,
                    Product__c: item.id,
                    Quantity__c: parseInt(item.quantity),
                    UnitPrice__c: parseFloat(item.price)
                }
            });
            insertOrderItems({orderProductList: orderItems, orderNumber: orderName})
                .then(result => {
                    this.clearBasket();
                    this.headerModal = 'Successfully';
                    this.bodyModal = 'Order created № '+orderName;
                    this.showModalPopup();
                })
                .catch(error => {
                    this.headerModal = 'Invalid add product to order';
                    this.bodyModal = error.message;
                    this.showModalPopup();
                })
        }).catch(error => {
            this.headerModal = 'Invalid create order';
            this.bodyModal = error.message;
            this.showModalPopup();
        });
    }

    clearBasket(){
        this.dataProducts = [...[]];
        this.totalQuantity = 0;
        this.totalAmount = 0;
        this.totalQuantityChange();
    }

    handleSave(event){
        this.saveDraftValues = JSON.parse(JSON.stringify(event.detail.draftValues));
        this.changeQuantity();
    }

    changeQuantity(){
        debugger;
        let products = [...this.basketProducts];
        for(let i=0; i<this.saveDraftValues.length; i++){
            const ids = products.map(el => el.id);
            let index = ids.indexOf(this.saveDraftValues[i].id);
            if(this.saveDraftValues[i].quantity <= products[index].available){
                products[index].quantity = parseInt(this.saveDraftValues[i].quantity);
                products[index].amount = parseFloat(products[index].quantity * products[index].price);
            } else{
                this.headerModal = 'Invalid quantity';
                this.bodyModal = 'On the product '+products[index].name+' the allowed quantity '+products[index].available+' for the order is exceeded.'
                this.showModalPopup();
            }
        }
        this.dataProducts = [...products];
        this.draftValues = null;
        this.recalcTotalQuantity();
        this.recalcTotalAmount();
    }

    closeModal() {
        this.showModal = false;
    }

    showModalPopup() {
        this.showModal = true;
    }
    totalQuantityChange() {
        debugger;
        this.dispatchEvent(new CustomEvent('changetotalquantity', {
            detail: {
                qty: this.totalQuantity,
                amount: this.totalAmount,
                products: this.dataProducts
            }
        }));
    }
}