/**
 * Created by OleksandrZborovskyi on 16.01.2022.
 */

trigger OrderProductTrigger on OrderProduct__c (after insert, after update, after delete) {
    if(Trigger.isAfter){
        if(Trigger.isInsert){
            OrderProductTriggerHandler.onAfterInsert(Trigger.newMap);
        }
        if(Trigger.isUpdate){
            OrderProductTriggerHandler.onAfterUpdate(Trigger.newMap, Trigger.old);
        }
        if(Trigger.isDelete){
            System.debug('OrderProductTriggerHandler.onAfterDelete(Trigger.oldMap); = '+ Trigger.oldMap);
            OrderProductTriggerHandler.onAfterDelete(Trigger.oldMap);
        }
    }
}