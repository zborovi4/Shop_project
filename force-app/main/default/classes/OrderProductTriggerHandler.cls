/**
 * Created by OleksandrZborovskyi on 16.01.2022.
 */

public with sharing class OrderProductTriggerHandler {
    public static void onAfterInsert(Map <Id, OrderProduct__c> newOrderProductMap) {
        OrderProductService.updateAvailableQuantityProductsAfterInsert(newOrderProductMap);
    }
    public static void onAfterUpdate(Map <Id, OrderProduct__c> newOrderProductMap, List<OrderProduct__c> oldOrderProductList){
        OrderProductService.updateAvailableQuantityProductsAfterUpdate(newOrderProductMap, oldOrderProductList);
    }

    public static void onAfterDelete(Map <Id, OrderProduct__c> oldOrderProductMap){
        OrderProductService.updateAvailableQuantityProductsAfterDelete(oldOrderProductMap);
    }
}