package com.codebreaker.winestop.domain;

import com.codebreaker.winestop.util.Role;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class Profile {
    /**
     *  Use userId as the datastore key 
     *  Google Email.
     */
    
    @Id
    private String email;

    /**
     * Any string user wants us to display him/her on this system.
     */
    private String displayName;

    /**
     * User's Role.
     */
    private Role role;
    
    public Profile() {
	
    }
    
    public Profile(String email, String displayName, Role role) {
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

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}
    
    
    
    
}
