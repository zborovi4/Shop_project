/**
 * Created by OleksandrZborovskyi on 12.01.2022.
 */

import {LightningElement, api, wire} from 'lwc';
import {MessageContext, publish} from "lightning/messageService";
import BASKET_UPDATED_CHANNEL from '@salesforce/messageChannel/Basket_Updated__c';

const URL_IMAGE = 'https://icdn.lenta.ru/images/2021/08/27/12/20210827122227084/pic_ccca80c2bff2b16d37486c172a022f00.jpg';
const MAX_QUANTITY_ORDER_PRODUCT = 1000;
const MIN_QUANTITY_ORDER_PRODUCT = 1;

export default class Tile extends LightningElement {
    quantityToOrder = 1;
    @api product;
    @api productImage = URL_IMAGE;


    checkQuantityToOrder(){
        debugger;
        if(this.quantityToOrder > this.product.Available__c){
            this.quantityToOrder = this.product.Available__c;
        }
        if(this.quantityToOrder > MAX_QUANTITY_ORDER_PRODUCT)
            this.quantityToOrder = MAX_QUANTITY_ORDER_PRODUCT;
        if(this.quantityToOrder < MIN_QUANTITY_ORDER_PRODUCT)
            this.quantityToOrder = MIN_QUANTITY_ORDER_PRODUCT;
    }
    handleQuantityToOrderChange(event) {
        this.quantityToOrder = parseInt(event.target.value);
        this.checkQuantityToOrder();
    }

    handleDecrement(){
        this.quantityToOrder --;
        this.checkQuantityToOrder();
    }
    handleIncrement(){
        this.quantityToOrder ++;
        this.checkQuantityToOrder();
    }

    @wire(MessageContext)
    messageContext;
    addToBasketClick(){
        const prod = {
            operator: 'add',
            product: this.product,
            quantity: this.quantityToOrder
        };
        publish(this.messageContext, BASKET_UPDATED_CHANNEL, prod);
    }
}