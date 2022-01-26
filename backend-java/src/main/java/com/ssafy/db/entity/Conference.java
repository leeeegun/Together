package com.ssafy.db.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.Getter;
import lombok.Setter;

@Entity(name = "conference")
@Getter
@Setter
public class Conference {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OID")
    Long oid;

    String title;
    String description;
    boolean is_active = false;

    @OneToMany(mappedBy = "conferences")
    private List<User> users = new ArrayList<>();

	public Conference(Long oid, String title, String description, boolean is_active) {
		this.oid = oid;
		this.title = title;
		this.description = description;
		this.is_active = is_active;
	}
}
