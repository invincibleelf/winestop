package com.codebreaker.winestop.service;

import com.codebreaker.winestop.domain.DiscountCopoun;
import com.codebreaker.winestop.domain.Product;
import com.codebreaker.winestop.domain.ProductCategory;
import com.codebreaker.winestop.domain.Profile;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;

public class OfyService {
	 /**
     * This static block ensure the entity registration.
     */
    static {
        factory().register(Profile.class);
        factory().register(ProductCategory.class);
        factory().register(Product.class);
        factory().register(DiscountCopoun.class);
    }
    
    public static Objectify ofy() {
        return ObjectifyService.ofy();
    }
    
    public static ObjectifyFactory factory() {
        return ObjectifyService.factory();
    }
}
