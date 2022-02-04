package com.ssafy.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssafy.api.request.ConferencePostReq;
import com.ssafy.db.entity.Conference;
import com.ssafy.db.repository.ConferenceRepository;

@Service("ConferenceService")
public class ConferenceServiceImpl implements ConferenceService {
	
	@Autowired
	ConferenceRepository conferenceRepository;
	
	@Autowired
	UserService userService;

	@Override
	public Conference create(ConferencePostReq c) {
		Conference conference = new Conference(c.getOid(), c.getTitle(), c.getDescription(), false);
		
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
}
