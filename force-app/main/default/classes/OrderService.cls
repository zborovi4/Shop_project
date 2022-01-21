/**
 * Created by OleksandrZborovskyi on 16.01.2022.
 */

public with sharing class OrderService {
    public static void deleteRelatedOrderProducts(List<Order__c> orderList){
        Set<Id> orderIds = new Set<Id>();
        for(Order__c order : orderList){
            orderIds.add(order.Id);
        }
        List<OrderProduct__c> deleteOrderProductList = getOrderProductList(orderIds);
        if(deleteOrderProductList.size() > 0){
            System.debug('deleteOrderProductList: ' + deleteOrderProductList);
            Database.DeleteResult[] drList = Database.delete(deleteOrderProductList, false);
            System.debug('deleteOrderProductList = '+drList);
        }

    }

    private static List<OrderProduct__c> getOrderProductList(Set<Id> orderIds){
        return [
                SELECT Id, Product__c
                FROM OrderProduct__c
                WHERE Order__c IN :orderIds
        ];
    }
}