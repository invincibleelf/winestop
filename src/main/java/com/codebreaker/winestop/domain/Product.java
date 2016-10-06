package com.codebreaker.winestop.domain;

import com.codebreaker.winestop.util.Discount;
import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Parent;

@Entity
public class Product {

	@Parent
	private
	Key<ProductCategory> theCategory;

	@Id
	private Long productId;

	@Index
	private String barcode;

	@Index
	private String name;

	private double price;

	private int quantity;

	private Discount discountType = Discount.NONE;

	private double discountValue;

	public Product() {

	}

	public Product(Long category, Long id, String barcode, String name, double price, int quantity,
			Discount discountType, double discountValue) {
		this.setTheCategory(Key.create(ProductCategory.class, category));
		this.productId = id;
		this.barcode = barcode;
		this.name = name;
		this.price = price;
		this.quantity = quantity;
		this.discountType = discountType;
		this.discountValue = discountValue;
	}
	
	@ApiResourceProperty(ignored = AnnotationBoolean.TRUE) 
	public Key<ProductCategory> getTheCategory() {
		return theCategory;
	}
	
	@ApiResourceProperty(ignored = AnnotationBoolean.TRUE) 
	public String getWebsafeKeyTheCategory() {
		return theCategory.getString();
	}
	
	@ApiResourceProperty(ignored = AnnotationBoolean.TRUE) 
	public void setTheCategory(Key<ProductCategory> theCategory) {
		this.theCategory = theCategory;
	}

	public Long getId() {
		return productId;
	}

	public void setId(Long id) {
		this.productId = id;
	}

	public String getBarcode() {
		return barcode;
	}

	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public Discount getDiscountType() {
		return discountType;
	}

	public void setDiscountType(Discount discountType) {
		this.discountType = discountType;
	}

	public double getDiscountValue() {
		return discountValue;
	}

	public void setDiscountValue(double discountValue) {
		this.discountValue = discountValue;
	}

}
