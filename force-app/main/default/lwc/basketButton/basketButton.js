/**
 * Created by OleksandrZborovskyi on 19.01.2022.
 */

import {LightningElement, track, wire} from 'lwc';
import {MessageContext, subscribe} from "lightning/messageService";
import BASKET_UPDATED_CHANNEL from '@salesforce/messageChannel/Basket_Updated__c';

export default class BasketButton extends LightningElement {
    @track showModal = false;
    @track showBasket = false;
    @track showNegativeButton;
    @track showPositiveButton = true;
    @track positiveButtonLabel = 'Close';
    totalQuantity = 0;
    totalAmount = 0;
    @track data = [];
    @track modalProductName;
    @track modalProductAvailable;
    @track basketLable = 'Basket 0';
    subscription = null;


    openBasket(){
        debugger;
        this.showBasket = true;
    }
    closeBasket() {
        this.showBasket = false;
    }
    connectedCallback() {
        this.subscribeToMessageChannel();
    }
    @wire(MessageContext)
    messageContext;
    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            BASKET_UPDATED_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }
    handleMessage(message) {
        debugger;
        if(message.operator == 'add') {
            //this.product = this.normalizeWireRecord(message.product);
            this.product = message.product;
            this.totalQuantity += message.quantity;
            this.available = this.product.Available__c;
            this.modalProductName = this.product.Name;
            this.modalProductAvailable = this.product.Available__c;
            let newProduct =
                {
                    id: this.product.Id,
                    name: this.product.Name,
                    category: this.product.Category__c,
                    price: this.product.Price__c,
                    quantity: message.quantity,
                    amount: this.product.Price__c * message.quantity,
                    available: this.product.Available__c
                };
            let existingProduct = this.data.find(el => el.id == newProduct.id);
            if(existingProduct){
                const ids = this.data.map(el => el.id);
                let index = ids.indexOf(newProduct.id);
                let tQuantity = this.data[index].quantity + newProduct.quantity;
                debugger;
                if(tQuantity <= this.available){
                    this.data[index].quantity += newProduct.quantity;
                    this.data[index].amount += newProduct.amount;
                    this.data = [...this.data];
                    this.recalcTotalAmount();
                }
                else{
                    this.showModalPopup();
                }
            }
            else{
                if(newProduct.quantity <= this.available){
                    this.data = [...this.data, newProduct];
                    this.recalcTotalAmount();
                }
                else{
                    this.showModalPopup();
                }
            }
            this.basketLable = 'Basket ' + this.totalQuantity;
        }
    }
    recalcTotalAmount(){
        this.totalAmount = 0;
        for(let i = 0; i < this.data.length; i++){
            this.totalAmount += this.data[i].quantity * this.data[i].price;
        }
    }
    closeModalBasket() {
        debugger;
        this.showBasket = false;
    }

    showModalPopup() {
        this.showModal = true;
    }

    changeTotalQuantity(event){
        debugger;
        this.totalQuantity = event.detail.qty;
        this.basketLable = 'Basket ' + this.totalQuantity;
        this.totalAmount = event.detail.amount;
        this.data = [...event.detail.products];
    }
}