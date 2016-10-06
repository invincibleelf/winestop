var utils = utils || {};

utils.createForm = function() {
	var formElement = document.createElement("form");
	formElement.setAttribute('method', "post");

	var inputUsername = document.createElement("input"); // input element,
	// text
	inputUsername.setAttribute('type', "text");
	inputUsername.setAttribute('name', "username");

	var submitButton = document.createElement("input"); // input element, Submit
	// button
	submitButton.setAttribute('type', "submit");
	submitButton.setAttribute('value', "Submit");
	submitButton.setAttribute('onclick', "");

	formElement.appendChild(inputUsername);
	formElement.appendChild(submitButton);

	console.log("Form Created");
	return formElement;

}

utils.operateFormatter = function(value, row, index) {
	return [ '<a class="update" href="javascript:void(0)" title="update">',
			'<i class="glyphicon glyphicon-pencil"></i>', '</a>  ',
			'<a class="remove" href="javascript:void(0)" title="delete">',
			'<i class="glyphicon glyphicon-remove-circle"></i>', '</a>' ]
			.join('');
}

window.operateEvents = {
	'click .update' : function(e, value, row, index) {
		alert('You click like action, row: ' + JSON.stringify(row));
	},
	'click .remove' : function(e, value, row, index) {
		google.devrel.removeProduct(row);
		
		/*$('#table').bootstrapTable('remove', {
			field : 'id',
			values : [ row.id ]
		});*/
	}
};

/**
 * Handler of all cancel buttons
 * 
 * @Param {element}
 *            button clicked
 */
utils.cancelButton = function(element, previousDiv) {
	console.log("Called");
	element.parentElement.parentElement.classList.remove('show');
	element.parentElement.parentElement.classList.add('hide');
	previousDiv.classList.add('show');
}

utils.showPreviousView = function(element, previousDiv) {
	element.parentElement.parentElement.classList.remove('show');
	element.parentElement.parentElement.classList.add('hide');
	previousDiv.classList.add('show');
}

utils.showNextView = function(element, nextDiv) {
	element.parentElement.parentElement.classList.remove("show");
	element.parentElement.parentElement.classList.add("hide");
	nextDiv.classList.add("show");
	nextDiv.classList.remove("hide");
}

/**
 * Creating a dynamic alert box
 * 
 * @Param {element}
 *            button clicked
 */
utils.createMessageDiv = function(element, message, isSuccess) {
	if (isSuccess) {
		element.innerHTML = '<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
				+ message + '</div>';
	} else {
		element.innerHTML = '<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
				+ message + '</div>';
	}

}

utils.addOptionValuesToSelectDiv = function(select, objects, valueOption,
		valueDisplay) {
	utils.removeOptionsFromSelect(select);
	for ( var key in objects) {
		// skip loop if the property is from prototype
		if (!objects.hasOwnProperty(key))
			continue;
		var option = document.createElement('option');
		var obj = objects[key];
		for ( var prop in obj) {
			if (!obj.hasOwnProperty(prop))
				continue;

			if (prop == valueOption) {
				option.value = obj[prop];
			}

			if (prop == valueDisplay) {
				option.innerHTML = obj[prop];
				select.appendChild(option);
			}

		}
	}

}

utils.removeOptionsFromSelect = function(selectbox) {
	var i;
	for (i = selectbox.options.length - 1; i >= 0; i--) {
		selectbox.remove(i);
	}
}
