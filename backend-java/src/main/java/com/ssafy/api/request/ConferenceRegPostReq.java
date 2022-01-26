package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 화상회의 생성 API ([POST] /conferences) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("ConferenceRegisterPostRequest")
public class ConferenceRegPostReq {
	
	@ApiModelProperty(name="방장", example="1")
	Long owner;
	
	@ApiModelProperty(name="방 제목", example="홍길동의 화상회의")
	String title;
	
	@ApiModelProperty(name="방 설명", example="설명 내용")
	String description;
	
	@ApiModelProperty(name="방 유뮤", example="owner가 방에 있으면 true, 없으면 false")
	boolean active = false;
}
