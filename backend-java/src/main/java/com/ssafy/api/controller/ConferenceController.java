package com.ssafy.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.api.request.ConferencePostReq;
import com.ssafy.api.response.ConferenceRes;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.api.response.UserRes;
import com.ssafy.api.service.ConferenceService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Conference;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.ConferenceRepository;

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
	ConferenceRepository conferenceRepository;
	
	@Autowired
	UserService userService;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@GetMapping("/create/{userId}")
	@ApiOperation(value = "방 생성", notes = "<strong>유저 ID</strong>를 주소로 방을 생성한다.") 
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
        @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
        @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
        @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
	public ResponseEntity<? extends BaseResponseBody> create(@PathVariable String userId) {

		User user = userService.getUserByUserId(userId);
		
		if(!conferenceService.checkConferenceDuplicate(user.getUid())){
			Conference conference = conferenceService.create(user);
			
			return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
		}else {
			return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Faild"));
		}
	}
	
	@GetMapping("/join/{userId}/{uid}")
	@ApiOperation(value = "방 입장", notes = "<strong>해당 oid 방에</strong>참가한다.") 
    @ApiResponses({
        @ApiResponse(code = 200, message = "게스트 참가", response = UserLoginPostRes.class),
        @ApiResponse(code = 201, message = "호스트 참가", response = UserLoginPostRes.class),
        @ApiResponse(code = 401, message = "방 비활성화 상태", response = BaseResponseBody.class),
        @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
        @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
	public ResponseEntity<? extends BaseResponseBody> join(@PathVariable String userId, @PathVariable Long uid){
		
		User user = userService.getUserByUserId(userId);
		Conference conference = conferenceService.conferenceAddUser(user.getUid(), uid);
		
		if(user.getUid() == uid) {
			return ResponseEntity.status(201).body(BaseResponseBody.of(201, "Host participation"));			
		}else if(conference.isActive()){
			return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Guest participation"));						
		}else {
			return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Conference disabled"));				
		}
	}
	
	@GetMapping("/leave/{userId}/{uid}")
	@ApiOperation(value = "방 종료", notes = "<strong>해당 uid</strong>를 방에서 퇴장시킨다.") 
    @ApiResponses({
        @ApiResponse(code = 200, message = "게스트 퇴장", response = UserLoginPostRes.class),
        @ApiResponse(code = 201, message = "호스트 퇴장", response = UserLoginPostRes.class),
        @ApiResponse(code = 401, message = "퇴장 실패", response = BaseResponseBody.class),
        @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
        @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
	public ResponseEntity<? extends BaseResponseBody> leave(@PathVariable String userId, @PathVariable Long uid){
		
		User u = userService.getUserByUserId(userId);
		
		Conference conference = conferenceService.getConferenceByOid(u.getUid());
		User user = userService.getUserByUid(uid);
		
		if(u.getUid() == uid) {
			conference = conferenceService.conferenceLeaveAll(conference);
			return ResponseEntity.status(201).body(BaseResponseBody.of(201, "Host leave"));
		}else if(conference.getUsers().contains(user)){
			conference = conferenceService.conferenceLeave(conference, user);
			return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Guest leave"));
		}else {
			return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Conference disabled"));
		}
	}
	
	@PostMapping("/update")
	@ApiOperation(value = "방 수정", notes = "<strong>해당 oid</strong>방 제목, 설명을 수정한다.") 
    @ApiResponses({
    	@ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
        @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
        @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
        @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
	public ResponseEntity<? extends BaseResponseBody> update(@RequestBody @ApiParam(value="방 정보", required = true) ConferencePostReq conferenceInfo){
	
		if(conferenceService.conferenceModify(conferenceInfo)) {
			return ResponseEntity.status(200).body(BaseResponseBody.of(201, "Success"));
		}else {
			return ResponseEntity.status(200).body(BaseResponseBody.of(401, "Fail"));
		}
	}
	
	@GetMapping("/info/{userId}")
	@ApiOperation(value = "방 조회", notes = "<strong>해당 userId</strong>방의 정보를 반환시킨다.") 
    @ApiResponses({
        @ApiResponse(code = 201, message = "조회 성공", response = UserLoginPostRes.class),
        @ApiResponse(code = 401, message = "조회 실패", response = BaseResponseBody.class),
        @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
        @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
	public ResponseEntity<ConferenceRes> info(@PathVariable String userId){
		
		User user = userService.getUserByUserId(userId);
		Conference conference = conferenceService.getConferenceByOid(user.getUid());
		
		return ResponseEntity.status(200).body(ConferenceRes.of(conference));
	}
}
