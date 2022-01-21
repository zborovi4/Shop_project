/**
 * Created by OleksandrZborovskyi on 16.01.2022.
 */

trigger OrderTrigger on Order__c (before delete) {
    if(Trigger.isBefore){
        if(Trigger.isDelete){
            System.debug('OrderTriggerHandler.onBeforeDelete(Trigger.old) = '+ Trigger.old);
            OrderTriggerHandler.onBeforeDelete(Trigger.old);
        }
    }
}