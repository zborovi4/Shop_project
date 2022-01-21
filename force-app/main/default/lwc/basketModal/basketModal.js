/**
 * Created by OleksandrZborovskyi on 19.01.2022.
 */

import {LightningElement, api, track} from 'lwc';
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

export default class BasketModal extends LightningElement {
    @api showPositive;
    @api showNegative;
    @api positiveButtonLabel = 'Save';
    @api negativeButtonLabel = 'Cancel';
    @api showBasket;
    @api totalQuantity = 0;
    @api totalAmount = 0;
    @track data = [];
    columns = COLUMNS;
    rowOffset = 0;

    constructor() {
        super();
        this.showNegative = true;
        this.showPositive = true;
        this.showBasket = false;
    }
    @api
    get productsData(){
        return this.data;
    }
    set productsData(value){
        debugger;
        this.data = value;
    }

    handlePositive() {
        this.dispatchEvent(new CustomEvent('positive'));
    }

    handleNegative() {
        this.dispatchEvent(new CustomEvent('negative'));
    }

    handleCloseBasket() {
        this.showBasket = false;
        debugger;
        this.dispatchEvent(new CustomEvent('closebasket'));
    }

    totalQuantityChange(event) {
        debugger;
        this.totalQuantity = event.detail.qty;
        this.totalAmount = event.detail.amount;
        this.data = [...event.detail.products];
        this.dispatchEvent(new CustomEvent('changetotalquantity', {
            detail: {
                qty: event.detail.qty,
                amount: event.detail.amount,
                products: event.detail.products
            }
        }));
    }
}