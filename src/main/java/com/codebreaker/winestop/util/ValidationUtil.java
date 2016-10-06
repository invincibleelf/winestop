package com.codebreaker.winestop.util;

import com.codebreaker.winestop.form.ProductForm;

public interface ValidationUtil {

	public boolean validateRequiredValues(String value);
	
	//TODO make method generic to accept all kinds of form
	public boolean validateProductFormFields(ProductForm productForm);

	public boolean checkDiscountPrice(double price, Double discountValue, Discount discountType);

}
