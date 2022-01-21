/**
 * Created by OleksandrZborovskyi on 12.01.2022.
 */

public with sharing class ProductControllerLwc {
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts(String category, String model){
        if(category != ''){
            if(model != ''){
                return queryProductsByCategoryAndModel(category, model);
            }
            return queryProductsByCategory(category);
        }
        else if(model != ''){
            return queryProductsByModel(model);
        }
        return queryProductsAll();
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> queryProductsByCategory(String category){
        return [
                SELECT Id, Name, Description, Category__c, Model__c, ProductImageLink__c, Price__c, Available__c
                FROM Product2
                WHERE Category__c = :category
                ORDER BY Name
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> queryProductsByModel(String model){
        return [
                SELECT Id, Name, Description, Category__c, Model__c, ProductImageLink__c, Price__c, Available__c
                FROM Product2
                WHERE Model__c = :model
                ORDER BY Name
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Product2 queryProductById(Id id){
        return [
                SELECT Id, Name, Description, Category__c, Model__c, ProductImageLink__c, Price__c, Available__c
                FROM Product2
                WHERE Id = :id
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> queryProductsAll(){
        return [
                SELECT Id, Name, Description, Category__c, Model__c, ProductImageLink__c, Price__c, Available__c
                FROM Product2
                ORDER BY Name
        ];
    }

    private static List<Product2> queryProductsByCategoryAndModel(String category, String model){
        return [
                SELECT Id, Name, Description, Category__c, Model__c, ProductImageLink__c, Price__c, Available__c
                FROM Product2
                WHERE Category__c = :category AND Model__c =: model
                ORDER BY Name
        ];
    }
}