/** google global namespace for Google projects. */
var google = google || {};

/** devrel namespace for Google Developer Relations projects. */
google.devrel = google.devrel || {};

/**
 * Client ID of the application (from the APIs Console).
 * 
 * @type {string}
 */
google.devrel.CLIENT_ID = '667054636067-a7086lvvkj1uvcmmla7ik560d0aecc3e.apps.googleusercontent.com';

/**
 * Scopes used by the application.
 * 
 * @type {string}
 */
google.devrel.SCOPES = 'https://www.googleapis.com/auth/userinfo.email';

/**
 * Whether or not the user is signed in.
 * 
 * @type {boolean}
 */
google.devrel.signedIn = false;

google.devrel.productCategories = {};

google.devrel.previousDiv;

google.devrel.products = {};

google.devrel.productsToSell = [];

google.devrel.totalItems = 0;

google.devrel.totalPrice = 0;

google.devrel.productsForCatProductTable = [];
/**
 * Loads the application UI after the user has completed auth.
 */
google.devrel.userAuthed = function() {
	console.log("Authenticate call");
	var request = gapi.client.oauth2.userinfo.get().execute(
			function(resp) {
				if (!resp.code) {
					console.log(resp);
					google.devrel.signedIn = true;
					document.getElementById('signinButton').innerHTML = 'Hi, '
							+ resp.email;
					// google.devrel.listProducts();
					// google.devrel.getProductCat();
				} else {
					console.log(resp);
					var message = resp.code + " : " + resp.message;
					utils.createMessageDiv(document.getElementById('message'),
							message, false);
				}

			});
};

/**
 * Handles the auth flow, with the given value for immediate mode.
 * 
 * @param {boolean}
 *            mode Whether or not to use immediate mode.
 * @param {Function}
 *            callback Callback to call on completion.
 */
google.devrel.signin = function(mode, callback) {
	gapi.auth.authorize({
		client_id : google.devrel.CLIENT_ID,
		scope : google.devrel.SCOPES,
		immediate : mode
	}, callback);
};

/**
 * Presents the user with the authorization popup.
 */
google.devrel.auth = function() {
	if (!google.devrel.signedIn) {
		google.devrel.signin(false, google.devrel.userAuthed);
	} else {
		google.devrel.signedIn = false;
		document.getElementById('signinButton').innerHTML = 'Sign in';

	}
};

/**
 * Display List of users
 */
google.devrel.saveProfile = function(email, displayName, role) {
	console.log("Initialize User save");
	gapi.client.winestop.saveProfile({
		'email' : email,
		'displayName' : displayName,
		'role' : role
	}).execute(function(resp) {
		console.log(resp);
		if (!resp.code) {
			console.log("user saved");
			console.log(resp);
		}
	});
}

/**
 * Enables the button callbacks in the UI.
 */
google.devrel.enableButtons = function() {

	document.getElementById('signinButton').onclick = function() {
		google.devrel.auth();
	}

	document.getElementById('productsNavButton').onclick = function(event) {
		google.devrel.listProducts();
		google.devrel.getProductCat();

		event.target.parentElement.classList.add("active");
		document.getElementById("productsDiv").classList.remove('hide');
		document.getElementById("productsDiv").classList.add('show');
		document.getElementById("salesDiv").classList.add('hide');
		document.getElementById("salesDiv").classList.remove('show');

	}

	document.getElementById('addProductCatBtn').onclick = function(event) {
		google.devrel.previousDiv = event.target.parentElement.parentElement;
		utils.showNextView(event.target, document
				.getElementById('createProductCatDiv'))
	}

	document.getElementById('createProductCatBtn').onclick = function(event) {
		google.devrel.createProductsCat(event, document
				.getElementById('categoryName').value);
	}

	document.getElementById('updateProductCatBtn').onclick = function(event) {
		google.devrel.updateProductCategory(event);
	}

	document.getElementById('addProductBtn').onclick = function(event) {
		google.devrel.previousDiv = event.target.parentElement.parentElement;

		utils.showNextView(event.target, document
				.getElementById("createProductDiv"));

		var selectDiv = document.getElementById("productCategoriesSel");
		utils.addOptionValuesToSelectDiv(selectDiv,
				google.devrel.productCategories, "id", "categoryName");
	}

	document.getElementById('createProductBtn').onclick = function(event) {
		google.devrel.createProduct(event);
	}

	document.getElementById('updateProductBtn').onclick = function(event) {
		google.devrel.updateProduct(event);
	}

	document.getElementById('salesNavButton').onclick = function(event) {
		event.target.parentElement.classList.add("active");
		document.getElementById("salesDiv").classList.remove('hide');
		document.getElementById("salesDiv").classList.add('show');

		document.getElementById("productsDiv").classList.add('hide');
		document.getElementById("productsDiv").classList.remove('show');
		google.devrel.initProductSellTable(event);
		google.devrel.initCategoriesSellDiv(event);
	}

	document.getElementById('barcodeScanner').addEventListener("keyup",
			function(event) {
				event.preventDefault();
				// Add handler when enter is pressed
				if (event.keyCode == 13) {
					google.devrel.addProductByBarcode(event);
				}
			});

	document.getElementById('discountCode').addEventListener("keyup",
			function(event) {
				event.preventDefault();
				// Add handler when enter is pressed
				if (event.keyCode == 13) {
					google.devrel.getDiscountCode(event);
				}
			});

	document.getElementById('payAmountCashBtn').onclick = function(event) {
		google.devrel.salesTransactionByCash(event);
	}
	/**
	 * Creating button onclick handler for all the Buttons with class cancel
	 * 
	 */
	var cancelButtons = document.getElementsByClassName('cancelBtn');
	console.log(cancelButtons);
	for (i = 0; i < cancelButtons.length; i++) {
		cancelButtons[i].onclick = function(event) {
			utils.cancelButton(event.target, google.devrel.previousDiv);
		}
	}

}

/** Inventory Modules */

/**
 * 
 * 
 * 
 */
google.devrel.createProductsCat = function(event, categoryName) {
	console.log("Intiating Api call");
	gapi.client.winestop.createProductCategory({
		'categoryName' : categoryName
	}).execute(
			function(resp) {
				if (!resp.code) {
					var message = resp.categoryName + ' created successfully.';
					utils.createMessageDiv(document.getElementById('message'),
							message, true);
					utils.showPreviousView(event.target,
							google.devrel.previousDiv);
					google.devrel.productCategories.push(resp);
				} else {
					var message = resp.code + " : " + resp.message;
					utils.createMessageDiv(document.getElementById('message'),
							message, false);
				}
			});
}

google.devrel.showUpdateProductCatDiv = function(event, row) {
	google.devrel.previousDiv = document.getElementById('products');
	document.getElementById('products').classList.add('hide');
	document.getElementById('products').classList.remove('show');
	document.getElementById('updateProductCatDiv').classList.add('show');
	document.getElementById('updateProductCatDiv').classList.remove('hide');

	var c = document.getElementById('updateProductCatForm').elements;
	for ( var key in row) {
		for (var i = 0; i < c.length; i++) {
			if (c[i].tagName === "INPUT" && c[i].name === key) {
				c[i].value = row[key];
			}

		}
	}

}

google.devrel.updateProductCategory = function(event) {
	console.log("Intiating Api call to update category");
	var formElements = event.target.parentElement.elements;

	var data = {
		categoryName : formElements.namedItem('categoryName').value,
		productCategoryId : formElements.namedItem('productCategoryId').value,
	}

	gapi.client.winestop.updateProductCategory(data).execute(
			function(resp) {
				if (!resp.code) {
					utils.showPreviousView(event.target,
							google.devrel.previousDiv);
					var message = resp.categoryName
							+ ' product category updated successfully.';
					utils.createMessageDiv(document.getElementById('message'),
							message, true);
					google.devrel.refreshTableAfterProductCategoryUpdate(
							google.devrel.products, data, document
									.getElementById('productTable'));
				} else {
					var message = resp.code + " : " + resp.message;
					utils.createMessageDiv(document.getElementById('message'),
							message, false);
				}
			});

}

google.devrel.getProductCat = function() {
	console.log("Intiating Product category Api call");
	gapi.client.winestop.getDistinctProductCat().execute(function(resp) {
		console.log(resp.items);
		google.devrel.productCategories = resp.items;

	});
}

google.devrel.createProduct = function(event) {
	console.log("Initiating create product");
	var formElements = event.target.parentElement.elements;

	var s = formElements.namedItem('productCategoriesSel');

	var data = {
		name : formElements.namedItem('name').value,
		barcode : formElements.namedItem('barcode').value,
		price : formElements.namedItem('price').value,
		quantity : formElements.namedItem('quantity').value,
		productCategoryId : s.options[s.selectedIndex].value,
		categoryName : s.options[s.selectedIndex].text,
		discountType : "NONE",
		discountValue : 0
	}

	gapi.client.winestop.createProduct({
		name : formElements.namedItem('name').value,
		barcode : formElements.namedItem('barcode').value,
		price : formElements.namedItem('price').value,
		quantity : formElements.namedItem('quantity').value,
		productCategoryId : s.options[s.selectedIndex].value,
	}).execute(
			function(resp) {
				if (!resp.code) {
					utils.showPreviousView(event.target,
							google.devrel.previousDiv);
					var message = resp.name + ' product created successfully.';
					utils.createMessageDiv(document.getElementById('message'),
							message, true);
					google.devrel.addCreatedProductToTableAndRefresh(data);
				} else {
					var message = resp.code + " : " + resp.message;
					utils.createMessageDiv(document.getElementById('message'),
							message, false);
				}

			});

}

/**
 * Updates the table data in client side after adding product
 */
google.devrel.addCreatedProductToTableAndRefresh = function(data) {
	google.devrel.products.push(data);
	console.log(google.devrel.products);
	var table = document.getElementById('productTable');
	$(table).bootstrapTable('load', google.devrel.products);
}

/**
 * Updates the table data in client side after deleting product
 */
google.devrel.deleteProductAndRefreshTable = function(data) {
	for ( var key in google.devrel.products) {
		if (google.devrel.products[key].productId == data.productId) {
			google.devrel.products.splice(key, 1);
		}
	}
	var table = document.getElementById('productTable');
	$(table).bootstrapTable('load', google.devrel.products);
}
/**
 * Getting the List of products
 */
google.devrel.listProducts = function() {
	console.log("Intiating API call");
	gapi.client.winestop.getProducts().execute(
			function(resp) {
				if (!resp.code) {
					google.devrel.products = resp.items;
					var tableProperties = [ {
						field : "barcode",
						title : "Barcode"
					}, {
						field : "name",
						title : "Item Name"
					}, {
						field : "price",
						title : "Item Price"
					}, {
						field : "quantity",
						title : "Quantity"
					}, {
						field : "discountType",
						title : "Discount Type",

					}, {
						field : "discountValue",
						title : "Discount Value",

					}, {
						field : "categoryName",
						title : "Category Name"
					} ]
					google.devrel.initProductTable(tableProperties, document
							.getElementById('productTable'),
							google.devrel.products);
				}
			});

}

/**
 * Add table properties and data to Table.
 * 
 * @param {String}
 *            Id of the table element
 * @param {array}
 *            Json data to display in table
 * 
 */
google.devrel.initProductTable = function(properties, element, tableData) {
	console.log("calling table");
	$(element).bootstrapTable({
		columns : [ {
			field : 'state',
			checkbox : true,
			align : 'center',
			valign : 'middle'
		}, {
			field : properties[0].field,
			title : properties[0].title,
			sortable : true,
			editable : true,
			align : 'center'
		}, {
			field : properties[1].field,
			title : properties[1].title,
			sortable : true,
			editable : true,
			align : 'center'
		}, {
			field : properties[2].field,
			title : properties[2].title,
			sortable : true,
			editable : true,
			align : 'center',
		}, {
			field : properties[3].field,
			title : properties[3].title,
			sortable : true,
			editable : true,
			align : 'center'
		}, {
			field : properties[4].field,
			title : properties[4].title,
			sortable : true,
			editable : true,
			align : 'center'
		}, {
			field : properties[5].field,
			title : properties[5].title,
			sortable : true,
			editable : true,
			align : 'center'
		}, {
			field : properties[6].field,
			title : properties[6].title,
			sortable : true,
			editable : true,
			align : 'center'
		}, {
			field : 'operate',
			title : 'Item Operate',
			align : 'center',
			events : operateEvents,
			formatter : utils.operateFormatter
		} ],
		data : tableData
	});
}

/**
 * Remove Selected product
 * 
 * @param {object}
 *            row Product object to be removed.
 */
google.devrel.removeProduct = function(row) {
	console.log("Initiating API call to remove product");

	gapi.client.winestop.deleteProduct({
		productId : row.productId,
		productCategoryId : row.productCategoryId
	}).execute(
			function(resp) {
				if (!resp.code) {
					var message = row.name + ' product deleted successfully.';
					utils.createMessageDiv(document.getElementById('message'),
							message, true);
					google.devrel.deleteProductAndRefreshTable(row);
				}
			});
}

google.devrel.showUpdateProductDiv = function(event, row) {
	google.devrel.previousDiv = document.getElementById('products');
	document.getElementById('products').classList.add('hide');
	document.getElementById('products').classList.remove('show');
	document.getElementById('updateProductDiv').classList.add('show');
	document.getElementById('updateProductDiv').classList.remove('hide');

	var c = document.getElementById('updateForm').elements;
	for ( var key in row) {
		for (var i = 0; i < c.length; i++) {
			if (c[i].tagName === "INPUT" && c[i].name === key) {
				c[i].value = row[key];
			}

			if (c[i].tagName === "SELECT") {
				utils.addOptionValuesToSelectDiv(c[i],
						google.devrel.productCategories, "id", "categoryName");
				c[i].value = row.productCategoryId;
			}
		}
	}

}

google.devrel.updateProduct = function(event) {
	console.log("Initiating create product");

	var formElements = event.target.parentElement.elements;

	var s = formElements.namedItem('productCategoriesSel');

	var data = {
		name : formElements.namedItem('name').value,
		barcode : formElements.namedItem('barcode').value,
		price : formElements.namedItem('price').value,
		quantity : formElements.namedItem('quantity').value,
		newProductCategoryId : s.options[s.selectedIndex].value,
		categoryName : s.options[s.selectedIndex].text,
		discountType : "NONE",
		discountValue : 0,
		productId : formElements.namedItem('productId').value,
		productCategoryId : formElements.namedItem('productCategoryId').value,
	}

	gapi.client.winestop.updateProduct(data).execute(
			function(resp) {
				if (!resp.code) {
					utils.showPreviousView(event.target,
							google.devrel.previousDiv);
					var message = resp.name + ' product updated successfully.';
					utils.createMessageDiv(document.getElementById('message'),
							message, true);
					google.devrel.refreshTableAfterProductUpdate(
							google.devrel.products, data, document
									.getElementById('productTable'));
				}
			});

}

google.devrel.refreshTableAfterProductUpdate = function(products, data, table) {
	for ( var key in products) {
		if (products[key].productId == data.productId) {
			products[key].name = data.name;
			products[key].barcode = data.barcode;
			products[key].quantity = data.quantity;
			products[key].categoryName = data.categoryName;
			products[key].discountType = data.discountType;
			products[key].discountValue = data.discountValue;
			products[key].discountType = data.discountType;
			products[key].productCategoryId = data.productCategoryId;
		}
	}
	$(table).bootstrapTable('load', google.devrel.products);
}

google.devrel.refreshTableAfterProductCategoryUpdate = function(products, data,
		table) {
	for ( var key in products) {
		if (products[key].productCategoryId == data.productCategoryId) {
			products[key].categoryName = data.categoryName;
		}
	}
	$(table).bootstrapTable('load', google.devrel.products);
}

/** Product Modules */

/**
 * 
 * 
 * 
 */

google.devrel.initProductSellTable = function(event) {
	var table = document.getElementById('salesTable');
	$(table).bootstrapTable({
		columns : [ {
			field : "name",
			title : "Product",
			sortable : true,
			editable : true,
			align : 'center'
		}, {
			field : "price",
			title : "Unit Price",
			sortable : true,
			editable : true,
			align : 'center'
		}, {
			field : "totalPrice",
			title : "Total Price",
			sortable : true,
			editable : true,
			align : 'center'
		}, {
			field : "saleQuantity",
			title : "Sale Quantity",
			sortable : true,
			editable : true,
			align : 'center'
		}, {
			field : 'operate',
			title : 'Remove Item',
			align : 'center',
			events : operateEventsForSale,
			formatter : utils.operateFormatterForSale
		} ],
		data : google.devrel.productsToSell
	});
}

google.devrel.addProductByBarcode = function(event) {
	console.log(event.target.value);
	gapi.client.winestop.getProductByBarcode({
		barcode : event.target.value
	}).execute(
			function(resp) {
				if (!resp.code) {
					google.devrel.totalItems += 1;
					google.devrel.totalPrice += resp.price;
					resp.saleQuantity = 1;
					resp.totalPrice = resp.price;
					google.devrel.updateproductsinSalesTable(
							google.devrel.productsToSell, resp);

					google.devrel.updateProductSellTable(
							google.devrel.productsToSell, document
									.getElementById('salesTable'));

					google.devrel.updateSalesStats(document
							.getElementById('discountSale').value);
				} else {
					var message = resp.code + " : " + resp.message;
					utils.createMessageDiv(document.getElementById('message'),
							message, false);
				}
			});
}
google.devrel.updateproductsinSalesTable = function(dataList, newdata) {
	var bool = false;
	for (var i = 0; i < dataList.length; i++) {
		if (dataList[i].id == newdata.id) {
			dataList[i].saleQuantity += 1;
			dataList[i].totalPrice += newdata.price;
			bool = true;

		}
	}
	if (!bool) {
		dataList.push(newdata);
	}

}

google.devrel.updateProductSellTable = function(data, table) {
	for (var i = 0; i < data.length; i++)
		$(table).bootstrapTable('load', data);
}

google.devrel.updateSalesStats = function(discount) {
	var q = document.getElementById('totalQuantity');
	q.value = google.devrel.totalItems;
	var p = document.getElementById('totalPrice');
	p.value = google.devrel.totalPrice;
	document.getElementById('payingPrice').value = google.devrel.totalPrice
			- discount;

}

google.devrel.getDiscountCode = function(event) {
	console.log("Initiating API call to get discount");

	gapi.client.winestop
			.getDiscountAmount({
				discountCode : document.getElementById('discountCode').value
			})
			.execute(
					function(resp) {
						if (!resp.code) {
							console.log(resp);
							document.getElementById('discountSale').value = resp.amount;
							google.devrel.updateSalesStats(resp.amount);
							document.getElementById('discountCode').readOnly = true;

						} else {
							var message = resp.code + " : " + resp.message;
							utils.createMessageDiv(document
									.getElementById('message'), message, false);
						}
					})
}

google.devrel.initCategoriesSellDiv = function(event) {
	google.devrel.getProductCat();
	var categoryBtnDiv = document.getElementById('categoriesBtnDiv');
	utils.createBtnAccordingToCategories(google.devrel.productCategories,
			categoryBtnDiv);
	google.devrel.initProductCategoriesTable();

}

google.devrel.getProductByCategories = function(event) {
	console
			.log("Initiating api call for getting products filter by categories")

	gapi.client.winestop.getAllProductsByCategories({
		id : event.target.id,
	}).execute(
			function(resp) {
				if (!resp.code) {
					console.log(resp.items);
					google.devrel.productsForCatProductTable = resp.items;
					var table = document
							.getElementById('categoriesProductTable');
					$(table).bootstrapTable('load',
							google.devrel.productsForCatProductTable);

				} else {
					var message = resp.code + " : " + resp.message;
					utils.createMessageDiv(document.getElementById('message'),
							message, false);
				}
			});
}

google.devrel.initProductCategoriesTable = function(event) {
	var table = document.getElementById('categoriesProductTable');
	$(table).bootstrapTable({
		columns : [ {
			field : 'operate',
			title : 'Add Item',
			align : 'center',
			events : operateEventsForSaleByCat,
			formatter : utils.operateFormatterForSaleByCat
		}, {
			field : "name",
			title : "Product",
			sortable : true,
			editable : true,
			align : 'center'
		}, {
			field : "price",
			title : "Unit Price",
			sortable : true,
			editable : true,
			align : 'center'
		}, {
			field : "quantity",
			title : "Quantity",
			sortable : true,
			editable : true,
			align : 'center'
		} ],
		data : google.devrel.productsForCatProductTable
	});
}

google.devrel.addItemsFromSaleCatTable = function(event, data) {
	console.log(data);
	google.devrel.totalItems += 1;
	google.devrel.totalPrice += data.price;
	if (!data.saleQuantity) {
		console.log("Doesnot exists");
		data.saleQuantity = 1;
	}
	data.totalPrice = data.price;
	google.devrel
			.updateproductsinSalesTable(google.devrel.productsToSell, data);

	google.devrel.updateProductSellTable(google.devrel.productsToSell, document
			.getElementById('salesTable'));

	google.devrel
			.updateSalesStats(document.getElementById('discountSale').value);
}

google.devrel.salesTransactionByCash = function(event) {
	console.log("Inititating Api call for sales transaction");
	gapi.client.winestop.salesTransactionByCash({
		discountCode : document.getElementById('discountCode').value,
		payingPrice : document.getElementById('payingPrice').value,
		productForms : google.devrel.productsToSell

	}).execute(
			function(resp) {
				if (!resp.code) {
					var message ='Sale transaction created successfully.';
					utils.createMessageDiv(document.getElementById('message'),
							message, true);
					
					google.devrel.productsToSell = [];
					google.devrel.totalItems = 0;

					google.devrel.totalPrice = 0;
					var table = document.getElementById('salesTable');
					$(table).bootstrapTable("load",google.devrel.productsToSell);
					document.getElementById('totalPrice').value = 0;
					document.getElementById('totalQuantity').value = 0;
					
				} else {
					var message = resp.code + " : " + resp.message;
					utils.createMessageDiv(document.getElementById('message'),
							message, false);
				}
			});

}
/**
 * 
 * 
 * Initializes the application.
 * 
 * @param {string}
 *            apiRoot Root of the API's path.
 */
google.devrel.init = function(apiRoot) {
	// Loads the OAuth and helloworld APIs asynchronously, and triggers login
	// when they have completed.
	console.log("got called");
	var apisToLoad;
	var callback = function() {
		if (--apisToLoad == 0) {
			google.devrel.enableButtons();
			google.devrel.signin(true, google.devrel.userAuthed);
		}
	}

	apisToLoad = 2; // must match number of calls to gapi.client.load()
	gapi.client.load('winestop', 'v1', callback, apiRoot);
	gapi.client.load('oauth2', 'v2', callback);
};
