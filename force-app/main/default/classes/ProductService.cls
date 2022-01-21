/**
 * Created by OleksandrZborovskyi on 16.01.2022.
 */

public with sharing class ProductService {
    public static void addAvailableQuantityProduct( List<Product2> newProductList, Map<Id, Product2> oldProductMap){
        for(Product2 newProduct : newProductList){
            if(newProduct.Available__c != oldProductMap.get(newProduct.Id).Available__c){
                if(newProduct.Available__c < 3){
                    newProduct.Available__c += 5;
                }
            }
        }
    }
}