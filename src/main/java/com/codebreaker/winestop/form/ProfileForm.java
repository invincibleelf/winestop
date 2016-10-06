package com.codebreaker.winestop.form;

import com.codebreaker.winestop.util.Role;

/**
 * Pojo representing a profile form on the client side.
 */
public class ProfileForm {

	private String email;
	/**
     * Any string user wants us to display him/her on this system.
     */
    private String displayName;
    
    /**
     * Role defined to user
     */
    private Role role;
    
    /**
     * Default Constructor Required for omiting JACKSON Error
     */
    public ProfileForm(){}
    
    /**
     * Constructor for ProfileForm, solely for unit test.
     * @param displayName A String for displaying the user on this system.
     * @param Users Role
     */
    public ProfileForm(String email,String displayName, Role role) {
        this.email = email;
    	this.displayName = displayName;
        this.role = role;
    }

    public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDisplayName() {
        return displayName;
    }

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}
    

	
}
