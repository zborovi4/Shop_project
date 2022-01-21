/**
 * Created by OleksandrZborovskyi on 20.01.2022.
 */

public with sharing class OrderDeleteListController {
    @InvocableMethod(label='Delete List Orders' description='Delete selected order records')
    public static void deleteOrderList(List<DeleteOrdersRequest> request){
        List<Order__c> orderList = new List<Order__c>();
        String[] orderIds = request.get(0).orderIds;
        Set<Id> orderIdsSet = new Set<Id>();

        for(Integer i = 0; i < orderIds.size(); i++){
            orderIdsSet.add(orderIds[i]);
        }
        orderList = getOrdersForId(orderIdsSet);
        if(orderList.size() > 0){
            delete orderList;
        }
    }

    public class DeleteOrdersRequest{
        @InvocableVariable
        public List<Order__c> orderList;

        @InvocableVariable
        public String[] orderIds;

    }

    private static List<Order__c> getOrdersForId( Set<Id> orderIds){
        return [
                SELECT Id, Name
                FROM Order__c
                WHERE Id IN :orderIds
        ];
    }

}