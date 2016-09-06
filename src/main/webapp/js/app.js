/** google global namespace for Google projects. */
var google = google || {};

/** devrel namespace for Google Developer Relations projects. */
google.devrel = google.devrel || {};

/** samples namespace for DevRel sample code. */
google.devrel.winestop = google.devrel.winestop || {};

/**
 * Client ID of the application (from the APIs Console).
 * 
 * @type {string}
 */
google.devrel.winestop.CLIENT_ID = '667054636067-a7086lvvkj1uvcmmla7ik560d0aecc3e.apps.googleusercontent.com';

/**
 * Scopes used by the application.
 * 
 * @type {string}
 */
google.devrel.winestop.SCOPES = 'https://www.googleapis.com/auth/userinfo.email';

/**
 * Whether or not the user is signed in.
 * 
 * @type {boolean}
 */
google.devrel.winestop.signedIn = false;

/**
 * Prints a greeting to the greeting log. param {Object} greeting Greeting to
 * print.
 */
google.devrel.winestop.print = function(greeting) {
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
google.devrel.winestop.getGreeting = function(id) {
	gapi.client.winestop.winestop.getGreeting({
		'id' : id
	}).execute(function(resp) {
		if (!resp.code) {
			google.devrel.winestop.print(resp);
		}
	});
};

/**
 * Lists greetings via the API.
 */
google.devrel.winestop.listGreeting = function() {
	gapi.client.winestop.winestop.listGreeting().execute(function(resp) {
		if (!resp.code) {
			resp.items = resp.items || [];
			for (var i = 0; i < resp.items.length; i++) {
				google.devrel.winestop.print(resp.items[i]);
			}
		}
	});
};

/**
 * Enables the button callbacks in the UI.
 */
google.devrel.winestop.enableButtons = function() {
	document.getElementById('getGreeting').onclick = function() {
		google.devrel.winestop.getGreeting(document.getElementById('id').value);
	}

	document.getElementById('listGreeting').onclick = function() {
		google.devrel.winestop.listGreeting();
	}
}

/**
 * Initializes the application.
 * 
 * @param {string}
 *            apiRoot Root of the API's path.
 */
google.devrel.winestop.init = function(apiRoot) {
	// Loads the OAuth and helloworld APIs asynchronously, and triggers login
	// when they have completed.
	var apisToLoad;
	var callback = function() {
		if (--apisToLoad == 0) {
			google.devrel.winestop.enableButtons();
			// google.devrel.samples.hello.signin(true,
			// google.devrel.samples.hello.userAuthed);
		}
	}

	apisToLoad = 2; // must match number of calls to gapi.client.load()
	// gapi.client.load('helloworld', 'v1', callback, apiRoot);
	gapi.client.load('winestop', 'v1', callback, apiRoot);
	gapi.client.load('oauth2', 'v2', callback);
};