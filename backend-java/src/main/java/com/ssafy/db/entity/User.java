package com.ssafy.db.entity;

import javax.persistence.Column;
import javax.persistence.Entity;

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
public class User extends BaseEntity{
    String disability;
    String name;
    String nickname;
    String email;
    
    @Column(name = "user_id")
    String userId;

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
