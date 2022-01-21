/**
 * Created by OleksandrZborovskyi on 20.01.2022.
 */

public with sharing class OrderDeleteAllController {
    @InvocableMethod(label='Delete All Orders' description='Delete all order records')
    public static void deleteAllOrders(){
        List<Order__c> orderList = getAllOrders();
        if(orderList.size() > 0){
            delete orderList;
        }
    }
    private static List<Order__c> getAllOrders(){
        return [
                SELECT Id, Name
                FROM Order__c
        ];
    }
}