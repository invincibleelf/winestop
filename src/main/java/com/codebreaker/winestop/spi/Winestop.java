package com.codebreaker.winestop.spi;

import java.util.ArrayList;

import javax.inject.Named;

import com.codebreaker.winestop.Constants;
import com.codebreaker.winestop.HelloGreeting;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.response.NotFoundException;

/**
 * Defines v1 of a helloworld API, which provides simple "greeting" methods.
 */
@Api(name = "winestop", version = "v1", scopes = { Constants.EMAIL_SCOPE }, clientIds = { Constants.WEB_CLIENT_ID,
		Constants.ANDROID_CLIENT_ID, Constants.IOS_CLIENT_ID }, audiences = { Constants.ANDROID_AUDIENCE })
public class Winestop {

	public static ArrayList<HelloGreeting> greetings = new ArrayList<HelloGreeting>();

	static {
		greetings.add(new HelloGreeting("hello world!"));
		greetings.add(new HelloGreeting("goodbye world!"));
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

	
}
