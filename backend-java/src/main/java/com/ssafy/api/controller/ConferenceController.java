package com.ssafy.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.api.request.ConferencePostReq;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.api.service.ConferenceService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Conference;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@Api(value = "회의 API", tags = {"Conference."})
@RestController
@RequestMapping("/conference")
public class ConferenceController {
	
	@Autowired
	ConferenceService conferenceService;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@PostMapping("/create")
	@ApiOperation(value = "방 생성", notes = "<strong>유저 ID</strong>를 주소로 방을 생성한다.") 
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
        @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
        @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
        @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
	public ResponseEntity<? extends BaseResponseBody> create(@RequestBody @ApiParam(value="방 정보", required = true) ConferencePostReq conferenceInfo) {

		if(!conferenceService.checkConferenceDuplicate(conferenceInfo.getOid())){
			Conference conference = conferenceService.create(conferenceInfo);
			
			return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
		}else {
			return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Faild"));
		}
	}
}
