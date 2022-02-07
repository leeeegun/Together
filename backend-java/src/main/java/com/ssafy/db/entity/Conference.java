package com.ssafy.db.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.transaction.Transactional;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "conference")
@Getter
@NoArgsConstructor
public class Conference {
	
	@Id
    @Column(name = "oid")
    Long oid;

    String title;
    String description;
    
    @Column(name ="is_active")
    boolean active;
    
    @OneToMany(mappedBy = "conferences", cascade = CascadeType.ALL)
    private List<User> users = new ArrayList<>();

    public void addUser(User user) {
    	users.add(user);
    	user.setConferences(this);
    }
    
    public void removeUser(User user) {
    	users.remove(user);
    	user.setConferences(null);
    }
    
    public void removUserAll() {
    	for(User u : users) {
    		u.setConferences(null);
    	}
    	
    	users.clear();
    }
    
	public Conference(Long oid, String title, String description, boolean active) {
		this.oid = oid;
		this.title = title;
		this.description = description;
		this.active = active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}
