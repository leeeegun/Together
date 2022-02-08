package com.ssafy.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ssafy.api.request.ConferencePostReq;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Conference;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.ConferenceRepository;

@Service("ConferenceService")
public class ConferenceServiceImpl implements ConferenceService {
	
	@Autowired
	ConferenceRepository conferenceRepository;
	
	@Autowired
	UserService userService;

	@Override
	public Conference create(User user) {
		Conference conference = new Conference(user.getUid(), user.getUserId() + "의 Conference", null, false);
		
		return conferenceRepository.save(conference);
	}

	@Override
	public boolean checkConferenceDuplicate(Long oid) {
		return conferenceRepository.existsByOid(oid);
	}

	@Override
	public Conference getConferenceByOid(Long oid) {
		return conferenceRepository.findByOid(oid).get();
	}

	@Override
	public Conference conferenceAddUser(Long oid, Long uid) {
		
		Conference conference = this.getConferenceByOid(oid);
		User user = userService.getUserByUid(uid);
		
		if(oid == uid) {
			conference.addUser(user);
			conference.setActive(true);
				
		}else {
			if(conference.isActive()) {
				conference.addUser(user);
			}
		}
		
		return conferenceRepository.save(conference);
	}

	@Override
	public Conference conferenceLeave(Conference conference, User user) {
	
		conference.removeUser(user);
		
		return conferenceRepository.save(conference);
	}

	@Override
	public Conference conferenceLeaveAll(Conference conference) {
		conference.removUserAll();
		conference.setActive(false);
		
		return conferenceRepository.save(conference);
	}

	@Override
	public boolean conferenceModify(ConferencePostReq conferenceInfo) {

		try {
			User user = userService.getUserByUserId(conferenceInfo.getUserId());
			Conference conference = this.getConferenceByOid(user.getUid());
			
			//수정
			conference.setTitle(conferenceInfo.getTitle());
			conference.setDescription(conferenceInfo.getDescription());
			conferenceRepository.save(conference);
				
			return true;
		}catch(Exception e) {
			return false;
		}
	}
}
