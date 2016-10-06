package com.codebreaker.winestop.domain;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class ProductCategory {

	@Id
	private Long productCategoryId;

	@Index
	private String categoryName = "Default";

	public ProductCategory() {

	}

	public ProductCategory(String categoryName) {
		this.categoryName = categoryName;

	}

	public Long getId() {
		return productCategoryId;
	}

	public void setId(Long id) {
		this.productCategoryId = id;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

}
