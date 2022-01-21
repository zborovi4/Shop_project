/**
 * Created by OleksandrZborovskyi on 18.01.2022.
 */

import {LightningElement, api} from 'lwc';

export default class DeleteAllOrdersAction extends LightningElement {
    @api recordId
    @api invoke(){
        console.log("invoked", recordId);
        console.log("invoked", this.recordId);
    }
}