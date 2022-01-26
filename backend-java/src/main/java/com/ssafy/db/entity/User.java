package com.ssafy.db.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.api.request.UserRegisterPostReq;

import lombok.Getter;
import lombok.Setter;

/**
 * 유저 모델 정의.
 */
@Entity(name = "user")
@Getter
@Setter
public class User {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UID")
    Long uid;

    @Column(name = "user_id")
    String userId;

    String disability;
    String name;
    String nickname;
    String email;

    @ManyToOne
    @JoinColumn(name = "oid")
    private Conference Conference;
    
    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    String password;
    
    protected User() {
    }

	public User(UserRegisterPostReq u) {
		this.disability = u.getDisability();
		this.name = u.getName();
		this.nickname = u.getNickname();
		this.email = u.getEmail();
		this.userId = u.getUserId();
		this.password = u.getPassword();
	}
    
    
}
