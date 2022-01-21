/**
 * Created by OleksandrZborovskyi on 15.01.2022.
 */

public with sharing class BasketControllerLwc {
    @AuraEnabled
    public static void insertOrderItems(List<OrderProduct__c> orderProductList, String orderNumber){
        try{
            if(validQuantity(orderProductList)){
                insert orderProductList;
                sendMessageEmail(orderNumber);
            }
        } catch (Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

    private static void sendMessageEmail(String orderNumber){
        List<String> sendTo = new List<String>();
        sendTo.add('zborovi4@gmail.com');
        Messaging.SingleEmailMessage mail =
                new Messaging.SingleEmailMessage();
        mail.setToAddresses(sendTo);
        mail.setSenderDisplayName('Salesforce');
        mail.setSubject('Created order');
        String body = 'Created new order № ' + orderNumber;
        mail.setHtmlBody(body);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }

    private static Boolean validQuantity(List<OrderProduct__c> orderProductList){
        Map<Id, Product2> productMap = getProductMap(orderProductList);
        for(OrderProduct__c op : orderProductList){
            if(op.Quantity__c > productMap.get(op.Product__c).Available__c){
                String message = 'On the product '+productMap.get(op.Product__c).Name+' the allowed quantity '+productMap.get(op.Product__c).Available__c+' for the order is exceeded.';
                throw new AuraHandledException(message);
            }
        }
        return true;
    }

    private static Map<Id, Product2> getProductMap(List<OrderProduct__c> orderProductList){
        Set<Id> productIds = new Set<Id>();
        for(OrderProduct__c op : orderProductList){
            productIds.add(op.Product__c);
        }
        return new Map <Id, Product2>([
                SELECT Id, Available__c, Name
                FROM Product2
                WHERE Id IN :productIds
        ]);
    }
}