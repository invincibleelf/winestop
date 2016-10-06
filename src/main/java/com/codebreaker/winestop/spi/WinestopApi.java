package com.codebreaker.winestop.spi;

import static com.codebreaker.winestop.service.OfyService.ofy;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Named;

import com.codebreaker.winestop.Constants;
import com.codebreaker.winestop.HelloGreeting;
import com.codebreaker.winestop.domain.Product;
import com.codebreaker.winestop.domain.ProductCategory;
import com.codebreaker.winestop.domain.Profile;
import com.codebreaker.winestop.form.ProductForm;
import com.codebreaker.winestop.form.ProfileForm;
import com.codebreaker.winestop.util.CustomException;
import com.codebreaker.winestop.util.Discount;
import com.codebreaker.winestop.util.Role;
import com.codebreaker.winestop.util.ValidationUtil;
import com.codebreaker.winestop.util.ValidationUtilImpl;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.response.NotFoundException;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.google.appengine.labs.repackaged.com.google.common.collect.Iterables;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.QueryKeys;

/**
 * Defines v1 of a helloworld API, which provides simple "greeting" methods.
 */
@Api(name = "winestop", version = "v1", scopes = { Constants.EMAIL_SCOPE }, clientIds = { Constants.WEB_CLIENT_ID,
		Constants.ANDROID_CLIENT_ID, Constants.IOS_CLIENT_ID }, audiences = { Constants.ANDROID_AUDIENCE })
public class WinestopApi {

	private static final Logger LOG = Logger.getLogger(WinestopApi.class.getName());

	public static ArrayList<HelloGreeting> greetings = new ArrayList<HelloGreeting>();

	private ValidationUtil validationForm = new ValidationUtilImpl();

	static {
		greetings.add(new HelloGreeting("hello world!"));
		greetings.add(new HelloGreeting("goodbye world!"));
	}

	private static String extractDefaultDisplayNameFromEmail(String email) {
		return email == null ? null : email.substring(0, email.indexOf("@"));
	}

	public HelloGreeting getGreeting(@Named("id") Integer id) throws NotFoundException {
		try {
			return greetings.get(id);
		} catch (IndexOutOfBoundsException e) {
			throw new NotFoundException("Greeting not found with an index: " + id);
		}
	}

	public ArrayList<HelloGreeting> listGreeting() {
		return greetings;
	}

	// [START multiplygreetings]

	@ApiMethod(name = "multiply", httpMethod = "post")
	public HelloGreeting insertGreeting(@Named("times") Integer times, HelloGreeting greeting) {
		HelloGreeting response = new HelloGreeting();
		StringBuilder responseBuilder = new StringBuilder();
		for (int i = 0; i < times; i++) {
			responseBuilder.append(greeting.getMessage());
		}
		response.setMessage(responseBuilder.toString());
		return response;
	}
	// [END multiplygreetings]
	// [START auth]

	@ApiMethod(name = "authed", httpMethod = "get")
	public HelloGreeting authedGreeting(final User user) throws UnauthorizedException {
		// If the user is not logged in, throw an UnauthorizedException
		if (user == null) {
			throw new UnauthorizedException(
					"Authorization required. Please Login to your google account and allow access.");
		}
		HelloGreeting response = new HelloGreeting("hello " + user.getEmail());
		return response;
	}
	// [END auth]

	// Declare this method as a method available externally through Endpoints
	@ApiMethod(name = "saveProfile", path = "profile", httpMethod = HttpMethod.POST)

	// The request that invokes this method should provide data that
	// conforms to the fields defined in ProfileForm

	// TODO 1 Pass the ProfileForm parameter
	// TODO 2 Pass the User parameter
	public Profile saveProfile(final User user, final ProfileForm profileForm) throws UnauthorizedException {

		String email = "";
		String displayName = "";
		Role role = Role.CASHIER;

		// If the user is not logged in, throw an UnauthorizedException
		if (user == null) {
			throw new UnauthorizedException(
					"Authorization required. . Please Login to your google account and allow access.");
		}

		/*
		 * Profile profile = ofy().load().key(Key.create(Profile.class,
		 * user.getEmail())).now();
		 * 
		 * if(profile == null && profile.getRole() != Role.ADMIN){ throw new
		 * UnauthorizedException("User Authentication Needed"); }
		 */

		// Set the Role to the value sent by the ProfileForm
		if (profileForm.getRole() != null) {
			role = profileForm.getRole();
		}

		// Set the displayName to the value sent by the ProfileForm
		displayName = profileForm.getDisplayName();

		// TODO 2
		// Get the userId and mainEmail
		email = user.getEmail();

		// TODO 2
		// If the displayName is null, set it to the default value based on the
		// user's email
		// by calling extractDefaultDisplayNameFromEmail(...)
		if (displayName == null) {
			displayName = extractDefaultDisplayNameFromEmail(user.getEmail());
		}

		// Create a new Profile entity from the
		// email, displayName and role
		Profile newProfile = new Profile(email, displayName, role);

		// Save the entity in the datastore
		ofy().save().entity(newProfile).now();

		// Return the profile
		return newProfile;
	}

	/**
	 * Returns a Profile object associated with the given user object. The cloud
	 * endpoints system automatically inject the User object.
	 *
	 * @param user
	 *            A User object injected by the cloud endpoints.
	 * @return Profile object.
	 * @throws UnauthorizedException
	 *             when the User object is null.
	 */
	@ApiMethod(name = "getProfile", path = "profile", httpMethod = HttpMethod.GET)
	public Profile getProfile(final User user) throws UnauthorizedException {
		if (user == null) {
			throw new UnauthorizedException(
					"Authorization required. Please Login to your google account and allow access.");
		}

		String userName = user.getEmail();

		Profile profile = ofy().load().key(Key.create(Profile.class, userName)).now();

		if (profile == null) {
			throw new UnauthorizedException("No user found");
		}

		return profile;
	}

	

	/**
	 * Returns a ProductCategory object. The cloud endpoints system
	 * automatically inject the User object.
	 *
	 * @param user
	 *            A User object injected by the cloud endpoints.
	 * @return ProductForm productForm.
	 * @throws UnauthorizedException
	 *             when the User object is null.
	 * @throws NullpointerException
	 *             when the categoryName of Profile object is null
	 */
	@ApiMethod(name = "createProductCategory", path = "productCategory", httpMethod = HttpMethod.POST)
	public ProductCategory createProductCategory(final User user, final ProductForm productForm)
			throws UnauthorizedException {
		if (user == null) {
			throw new UnauthorizedException(
					"Authorization required. Please Login to your google account and allow access.");
		}

		if (productForm.getCategoryName().isEmpty()) {
			throw new NullPointerException("Name of product Categories is Required");
		}

		Iterable<Key<ProductCategory>> productCategoriesKeys = queryproductCategoriesByCategoryName(productForm);

		if (Iterables.size(productCategoriesKeys) > 0) {
			// throw new NullPointerException(productForm.getCategoryName()+ "
			// already exists.");
		}
		for (Key<ProductCategory> key : productCategoriesKeys) {
			System.out.println(key.getId());
			break;
		}

		ProductCategory productCategory = new ProductCategory(productForm.getCategoryName());
		ofy().save().entity(productCategory).now();

		return productCategory;
	}

	private QueryKeys<ProductCategory> queryproductCategoriesByCategoryName(final ProductForm productForm) {
		return ofy().load().type(ProductCategory.class).filter("categoryName", productForm.getCategoryName()).keys();
	}

	@ApiMethod(name = "getDistinctProductCat", path = "productCategory", httpMethod = HttpMethod.GET)
	public List<ProductCategory> getAvailableProductCategoriesNames(final User user) {
		return ofy().load().type(ProductCategory.class).project("categoryName").distinct(true).list();
	}

	public List<ProductCategory> getAllProductCategories() {
		return ofy().load().type(ProductCategory.class).list();
	}

	/**
	 * Returns a Product object. The cloud endpoints system automatically inject
	 * the User object.
	 *
	 * @param user
	 *            A User object injected by the cloud endpoints.
	 * @return ProductForm productForm.
	 * @throws UnauthorizedException
	 *             when the User object is null.
	 * @throws CustomException
	 * 				when field discountValue is greater than the price
	 * @throws NullpointerException
	 *             when the required fields in productfrom  object from client is null
	 *             when supplied id of productcategory is not available in datastore
	 */
	@ApiMethod(name = "createProduct", path = "product", httpMethod = HttpMethod.POST)
	public Product createProduct(final User user, final ProductForm productForm)
			throws UnauthorizedException, CustomException {
		if (user == null) {
			LOG.info("User is not authorised");
			throw new UnauthorizedException(
					"Authorization required. Please Login to your google account and allow access.");
		}

		if (!validationForm.validateProductFormFields(productForm)) {
			throw new NullPointerException("Required Fields are missing.");
		}

		LOG.info("Set categoryname if categoryId is not supplied");
		if (productForm.getProductCategoryId() == 0) {
			productForm.setCategoryName("Default");
		}

		productForm.setDiscountType(Discount.NONE);
		productForm.setDiscountValue(0);

		if (productForm.getDiscountType() == null) {
			productForm.setDiscountType(Discount.NONE);
		}

		if (productForm.getDiscountType() != Discount.NONE) {
			LOG.info("Check for Discount input values");
			if (validationForm.checkDiscountPrice(productForm.getPrice(), new Double(productForm.getDiscountValue()),
					productForm.getDiscountType())) {
				if (productForm.getDiscountType() == Discount.FLAT) {
					throw new CustomException("Discount Price is Higher that actual price");
				}

				if (productForm.getDiscountType() == Discount.PERCENTAGE) {
					throw new CustomException("Percentage cannot be greater than 100");
				}

			}
		}

		Product product = new Product();

		if (productForm.getProductCategoryId() == 0) {
			LOG.info("Get categoryId for Default category");
			productForm.setCategoryName("Default");
			Iterable<Key<ProductCategory>> productCategoriesKeys = queryproductCategoriesByCategoryName(productForm);
			if (Iterables.size(productCategoriesKeys) <= 0) {
				throw new NullPointerException("Product category not found");
			}
			for (Key<ProductCategory> key : productCategoriesKeys) {
				product.setTheCategory(Key.create(ProductCategory.class, key.getId()));
				break;
			}

		} else {
			LOG.info("Check product category " + productForm.getProductCategoryId() + " Exists");
			ProductCategory productCategory = ofy().load()
					.key(Key.create(ProductCategory.class, productForm.getProductCategoryId())).now();

			if (productCategory == null) {
				throw new NullPointerException(
						"Product category for id " + productForm.getProductCategoryId() + " not found");
			}
			product.setTheCategory(Key.create(ProductCategory.class, productForm.getProductCategoryId()));

		}

		product.setBarcode(productForm.getBarcode());
		product.setName(productForm.getName());
		product.setPrice(productForm.getPrice());
		product.setQuantity(productForm.getQuantity());
		product.setDiscountType(productForm.getDiscountType());
		product.setDiscountValue(productForm.getDiscountValue());

		LOG.info("Persist product" + product);
		ofy().save().entities(product).now();

		System.out.println(product.getTheCategory());
		return product;

	}
	
	/**
	 * Returns a List of Product object. The cloud endpoints system automatically inject
	 * the User object.
	 *
	 * @param user
	 *            A User object injected by the cloud endpoints.
	 * @return ProductForm productForm.
	 * @throws UnauthorizedException
	 *             when the User object is null.
	 * @throws CustomException
	 * 				when field discountValue is greater than the price
	 * @throws NullpointerException
	 *             when the required fields in productfrom  object from client is null
	 *             when supplied id of productcategory is not available in datastore
	 */
	@ApiMethod(name = "getProducts", path = "product", httpMethod = HttpMethod.GET)
	public List<ProductForm> getProducts(final User user) throws UnauthorizedException {
		if (user == null) {
			throw new UnauthorizedException(
					"Authorization required. Please Login to your google account and allow access.");
		}
		
		List<Product> products = ofy().load().type(Product.class).list();
		
		List<ProductForm> productForms = new ArrayList<>();
		for (Product product : products) {
			ProductForm productForm = new ProductForm();
			productForm.setProductId(product.getId());
			productForm.setName(product.getName());
			productForm.setBarcode(product.getBarcode());
			productForm.setPrice(product.getPrice());
			productForm.setQuantity(product.getQuantity());
			productForm.setProductCategoryId(product.getTheCategory().getId());
			productForm.setName(product.getName());
			productForm.setCategoryName(ofy().load().key(product.getTheCategory()).now().getCategoryName());
			productForms.add(productForm);
		}
		
		return productForms;

	}
	
	@ApiMethod(name = "deleteProduct", path="deleteproduct" ,httpMethod = HttpMethod.POST)
	public void deleteProduct(final User user,final ProductForm productForm) throws UnauthorizedException {
		if (user == null) {
			throw new UnauthorizedException(
					"Authorization required. Please Login to your google account and allow access.");
		}
		
		if(productForm.getProductId() == 0 || productForm.getProductCategoryId() == 0){
			throw new NullPointerException("Prodcut Id and Category  is required");
		}
		
		LOG.info("Find product in datastore by ID:"+productForm.getProductId());
		Product product = ofy().load().key(Key.create(Key.create(ProductCategory.class,productForm.getProductCategoryId()),Product.class,productForm.getProductId())).now();
		
		if(product == null){
			throw new NullPointerException("Prodcut is not found");
		}
		
		
		ofy().delete().entity(product).now();
		
	}
}