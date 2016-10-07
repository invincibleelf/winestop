package com.codebreaker.winestop.domain;

import java.util.List;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class SalesTransaction {

	@Id
	private Long id;

	private String discountCode;

	private double payingPrice;
	
	@Index
	private List<Long> productIds;
	
	public SalesTransaction() {
		
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDiscountCode() {
		return discountCode;
	}

	public void setDiscountCode(String discountCode) {
		this.discountCode = discountCode;
	}

	public double getPayingPrice() {
		return payingPrice;
	}

	public void setPayingPrice(double payingPrice) {
		this.payingPrice = payingPrice;
	}

	public List<Long> getProductIds() {
		return productIds;
	}

	public void setProductIds(List<Long> productIds) {
		this.productIds = productIds;
	}

	

	

}
