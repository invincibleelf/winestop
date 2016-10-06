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
					google.devrel.listProducts();
					google.devrel.getProductCat();
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
 * Prints a greeting to the greeting log. param {Object} greeting Greeting to
 * print.
 */
google.devrel.print = function(greeting) {
	var element = document.createElement('div');
	element.classList.add('row');
	element.innerHTML = greeting.message;
	document.getElementById('outputLog').appendChild(element);
};

/**
 * Gets a numbered greeting via the API.
 * 
 * @param {string}
 *            id ID of the greeting.
 */
google.devrel.getGreeting = function(id) {
	gapi.client.winestop.winestopApi.getGreeting({
		'id' : id
	}).execute(function(resp) {
		if (!resp.code) {
			google.devrel.print(resp);
		}
	});
};

/**
 * Lists greetings via the API.
 */
google.devrel.listGreeting = function() {
	gapi.client.winestop.winestopApi.listGreeting().execute(function(resp) {
		if (!resp.code) {
			resp.items = resp.items || [];
			for (var i = 0; i < resp.items.length; i++) {
				google.devrel.print(resp.items[i]);
			}
		}
	});
};

/**
 * Gets a greeting a specified number of times.
 * 
 * @param {string}
 *            greeting Greeting to repeat.
 * @param {string}
 *            count Number of times to repeat it.
 */
google.devrel.multiplyGreeting = function(greeting, times) {
	gapi.client.winestop.multiply({
		'message' : greeting,
		'times' : times
	}).execute(function(resp) {
		if (!resp.code) {
			google.devrel.print(resp);
		}
	});
};

/**
 * Greets the current user via the API.
 */
google.devrel.authedGreeting = function(id) {
	gapi.client.winestop.authed().execute(function(resp) {
		google.devrel.print(resp);
	});
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
		document.getElementById("productsDiv").classList.remove('hide');
		document.getElementById("productsDiv").classList.add('show');

	}

	document.getElementById('getproductCatBtn').onclick = function() {
		google.devrel.getProductCat();
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
	$('table').bootstrapTable('load', google.devrel.products);
}

/**
 * Updates the table data in client side after deleting product
 */
google.devrel.deleteProductAndRefreshTable = function(data) {
	for (var key in google.devrel.products) {
		if(google.devrel.products[key].productId == data.productId ) {
			google.devrel.products.splice(key,1);
		}
	}
	$('table').bootstrapTable('load', google.devrel.products);
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
					google.devrel.initTable(tableProperties, $('table'),
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
google.devrel.initTable = function(properties, element, tableData) {
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

google.devrel.removeProduct = function(row) {
	console.log("Initiating API call to remove product");
	
	
	
	gapi.client.winestop.deleteProduct({
		productId : row.productId,
		productCategoryId : row.productCategoryId
	}).execute(function(resp) {
		if (!resp.code) {
			var message = row.name + ' product deleted successfully.';
			utils.createMessageDiv(document.getElementById('message'),
					message, true);
			google.devrel.deleteProductAndRefreshTable(row);
		}
	});
}


/**
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
