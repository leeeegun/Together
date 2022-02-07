package com.ssafy.api.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

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
public class UserModifyPostReq {

	@ApiModelProperty(name="유저 Password", example="your_password")
    @NotBlank(message = "Password size invaalid")
	@Pattern(regexp = "(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!%*#?&]).+", message = "Password Pattern invalid")
    @Size(min = 8, max = 24, message = "Password size invalid")
	String password;
	
	@ApiModelProperty(name="장애 종류", example="시각장애")
    @NotBlank(message = "disability size invaild")
    @Size(min = 1, max = 5, message = "disability size invaild")
	String disability;
	
	@ApiModelProperty(name="닉네임", example="길동이")
    @NotBlank(message = "Nickname size invalid")
    @Size(min = 2, max = 10, message = "Nickname size invalid")
	String nickname;
}
