package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 유저 회원가입 API ([POST] /users) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserRegisterPostRequest")
public class UserRegisterPostReq {
	@ApiModelProperty(name="유저 ID", example="ssafy_web")
	String userId;
	@ApiModelProperty(name="유저 Password", example="your_password")
	String password;
	@ApiModelProperty(name="장애 종류", example="시각장애")
	String disability;
	@ApiModelProperty(name="이름", example="홍길동")
	String name;
	@ApiModelProperty(name="닉네임", example="길동이")
	String nickname;
	@ApiModelProperty(name="이메일", example="abc@naver.com")
	String email;
}
