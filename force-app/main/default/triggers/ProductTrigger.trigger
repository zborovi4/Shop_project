/**
 * Created by OleksandrZborovskyi on 16.01.2022.
 */

trigger ProductTrigger on Product2 (before update) {
    if(Trigger.isBefore){
        if(Trigger.isUpdate){
            ProductTriggerHandler.onBeforeUpdate(Trigger.new, Trigger.oldMap);
        }
    }
}