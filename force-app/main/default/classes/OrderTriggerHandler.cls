/**
 * Created by OleksandrZborovskyi on 16.01.2022.
 */

public with sharing class OrderTriggerHandler {
    public static void onBeforeDelete(List<Order__c> orderList){
        OrderService.deleteRelatedOrderProducts(orderList);
    }
}