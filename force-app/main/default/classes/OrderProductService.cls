/**
 * Created by OleksandrZborovskyi on 16.01.2022.
 */

public with sharing class OrderProductService {
    public static void updateAvailableQuantityProductsAfterInsert(Map <Id, OrderProduct__c> newOrderProductMap){
        Set<Id> productIds = new Set<Id>();
        for(OrderProduct__c op : newOrderProductMap.values()){
            productIds.add(op.Product__c);
        }
        Map<Id, Product2> productMap = getProductMap(productIds);
        List<Product2> updateProductList = new List<Product2>();
        for(OrderProduct__c op : newOrderProductMap.values()){
            Product2 prod = productMap.get(op.Product__c);
            prod.Available__c -= op.Quantity__c;
            updateProductList.add(prod);
        }
        if(updateProductList.size() > 0){
            update updateProductList;
        }
    }

    public static void updateAvailableQuantityProductsAfterUpdate(Map <Id, OrderProduct__c> newOrderProductMap, List<OrderProduct__c> oldOrderProductList){
        Map<Id, Double> updateProductsMap = new Map<Id, Double>();
        for(OrderProduct__c opOld : oldOrderProductList){
            OrderProduct__c opNew = newOrderProductMap.get(opOld.Id);
            Double differentQuantity = opOld.Quantity__c - opNew.Quantity__c;
            if(differentQuantity != 0){
                updateProductsMap.put(opOld.Product__c, differentQuantity);
            }
            if(updateProductsMap.size() > 0){
                List<Product2> updateProductList = getProductList(updateProductsMap.keySet());
                for(Product2 prod : updateProductList){
                    prod.Available__c += updateProductsMap.get(prod.Id);
                }
                update updateProductList;
            }
        }
    }

    public static void updateAvailableQuantityProductsAfterDelete(Map <Id, OrderProduct__c> oldOrderProductMap){
        Set<Id> productIds = new Set<Id>();
        List<Product2> updateProductList = new List<Product2>();
        for(OrderProduct__c opOld : oldOrderProductMap.values()){
            productIds.add(opOld.Product__c);
        }
        Map<Id, Product2> productMap = getProductMap(productIds);
        for(OrderProduct__c opOld : oldOrderProductMap.values()){
            Product2 prod = productMap.get(opOld.Product__c);
            prod.Available__c += opOld.Quantity__c;
            updateProductList.add(prod);
        }
        if(updateProductList.size() > 0){
            System.debug('updateProductList :' + updateProductList);
            Database.SaveResult [] updateResult = Database.update(updateProductList, false);
            System.debug('updateProductList = ' + updateResult);
        }

    }

    private static Map<Id, Product2> getProductMap(Set<Id> productIds){
        return new Map<Id, Product2> ([
                SELECT Id, Available__c
                FROM Product2
                WHERE Id IN :productIds
        ]);
    }

    private static List<Product2> getProductList(Set<Id> productIds){
        return [
                SELECT Id, Available__c
                FROM Product2
                WHERE Id IN :productIds
        ];
    }
}