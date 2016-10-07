package com.codebreaker.winestop.form;

import java.util.List;

public class SalesTransactionForm {

	private String discountCode;
	
	private double payingPrice;
	
	private List<SalesProductForm> productForms;
	
	public  SalesTransactionForm() {
		// TODO Auto-generated constructor stub
	}

	public double getPayingPrice() {
		return payingPrice;
	}

	public String getDiscountCode() {
		return discountCode;
	}

	public void setDiscountCode(String discountCode) {
		this.discountCode = discountCode;
	}

	public void setPayingPrice(double payingPrice) {
		this.payingPrice = payingPrice;
	}

	public List<SalesProductForm> getProductForms() {
		return productForms;
	}

	public void setProductForms(List<SalesProductForm> productForms) {
		this.productForms = productForms;
	}
	
	
}
