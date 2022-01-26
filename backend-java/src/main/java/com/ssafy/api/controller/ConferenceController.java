package com.ssafy.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.api.request.ConferenceRegPostReq;
import com.ssafy.api.service.ConferenceService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Conference;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@Api(value = "컨퍼런스 API", tags = {"Conference"})
@RestController
@RequestMapping("/conference")
public class ConferenceController {
	
	@Autowired
	ConferenceService confService;
	
	@PostMapping("/create")
	@ApiOperation(value = "방 생성", notes = "<strong>owner_id와 제목, 설명</strong>을 통해 방을 생성한다.") 
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 400, message = "인증 실패"),
        @ApiResponse(code = 500, message = "서버 오류")
    })
	public ResponseEntity<? extends BaseResponseBody> create(
			@RequestBody @ApiParam(value = "방 정보", required = true) ConferenceRegPostReq confInfo) {
		try {
			
			Conference conference = confService.createCon(confInfo);
			
			return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseEntity.status(200).body(BaseResponseBody.of(400, "Faild"));
	}

}
