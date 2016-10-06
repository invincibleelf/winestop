package com.codebreaker.winestop.util;

import com.codebreaker.winestop.form.ProductForm;

public class ValidationUtilImpl implements ValidationUtil {

	public ValidationUtilImpl() {
	}

	@Override
	public boolean validateRequiredValues(String value) {

		if (value == null || value.isEmpty()) {
			return false;
		}

		return true;
	}

	@Override
	public boolean validateProductFormFields(ProductForm productForm) {
		boolean valid = true;

		if (productForm.getBarcode().isEmpty() || productForm.getName().isEmpty() || productForm.getPrice() == 0
				|| productForm.getQuantity() < 0) {
			valid = false;
		}

		return valid;
	}

	@Override
	public boolean checkDiscountPrice(double price, Double discountValue, Discount discountType) {

		if (discountType == Discount.FLAT && discountValue >= price) {
			return false;
		} else if (discountType == Discount.PERCENTAGE && discountValue.intValue() >=100){
			return false;
		}

		return true;
	}

}
