/**
 * Created by OleksandrZborovskyi on 16.01.2022.
 */

public with sharing class ProductTriggerHandler {
    public static void onBeforeUpdate(List<Product2> newProductList, Map<Id, Product2> oldProductMap){
        ProductService.addAvailableQuantityProduct(newProductList, oldProductMap);
    }
}