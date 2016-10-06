package com.codebreaker.winestop.form;

import com.codebreaker.winestop.util.Discount;
import com.google.api.server.spi.config.Named;

public class ProductForm {

	private Long productCategoryId;
	
	private String categoryName;
	
	private Long productId;
	
	private String barcode;
	
	private String name;
	
	private double price;

	private int quantity;

	private Discount discountType = Discount.NONE;

	private double discountValue;

	/**
     * Default Constructor Required for omiting JACKSON Error
     */
    public ProductForm(){}
    
	/**
     * Constructor for ProfileForm, solely for unit test.
     * @param categoryName A String for category name of products.
     */
    public ProductForm(String categoryName) {
        this.categoryName = categoryName;
    }
    
	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public Long getProductCategoryId() {
		return productCategoryId;
	}

	public void setProductCategoryId(Long productCategoryId) {
		this.productCategoryId = productCategoryId;
	}

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
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
