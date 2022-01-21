/**
 * Created by OleksandrZborovskyi on 12.01.2022.
 */

import { LightningElement, api, wire} from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { publish, MessageContext } from 'lightning/messageService';
import BASKET_UPDATED_CHANNEL from '@salesforce/messageChannel/Basket_Updated__c';

const MAX_QUANTITY_ORDER_PRODUCT = 1000;
const MIN_QUANTITY_ORDER_PRODUCT = 1;
const FIELDS = [
    'Product2.Id',
    'Product2.Name',
    'Product2.Description',
    'Product2.Price__c',
    'Product2.Category__c',
    'Product2.Model__c',
    'Product2.Available__c',
    'Product2.ProductImageLink__c'
];
const URL_IMAGE = 'https://icdn.lenta.ru/images/2021/08/27/12/20210827122227084/pic_ccca80c2bff2b16d37486c172a022f00.jpg';

export default class Detail extends LightningElement {
    product;
    error;
    _productId = undefined;
    quantityToOrder = 1;
    available = 0;
    productImageLink = URL_IMAGE;

    @wire(getRecord, { recordId: '$_productId', fields: FIELDS})
    wiredProduct({ error, data }) {
        if (data) {
            this.product = data;
            this.available = this.product.fields.Available__c.value;
            this.error = undefined;
            if(this.product.fields.ProductImageLink__c.value != ''){
                this.productImageLink = this.product.fields.ProductImageLink__c.value;
            }
        } else if (error) {
            this.error = error;
            this.product = undefined;
        }
    }
    set productId(value) {
        this._productId = value;
        this.quantityToOrder = 1;
    }

    @api get productId(){
        return this._productId;
    }

    checkQuantityToOrder(){
        if(this.quantityToOrder > this.available){
            this.quantityToOrder = this.available;
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
    handleAddProductToBasket(){
        const prod = {
            operator: 'add',
            product: this.product,
            quantity: this.quantityToOrder
        };
        publish(this.messageContext, BASKET_UPDATED_CHANNEL, prod);
    }

}