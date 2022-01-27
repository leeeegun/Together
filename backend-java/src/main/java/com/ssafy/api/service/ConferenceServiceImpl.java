package com.ssafy.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssafy.api.request.ConferenceRegPostReq;
import com.ssafy.db.entity.Conference;
import com.ssafy.db.repository.ConferenceRepository;

@Service("ConferenceService")
public class ConferenceServiceImpl implements ConferenceService {
	
	@Autowired
	ConferenceRepository conferenceRepository;
	
	@Override
	public Conference createCon(ConferenceRegPostReq conInfo) {
		Conference conf = new Conference(conInfo.getOwner(), conInfo.getTitle(), conInfo.getDescription());
		
		conferenceRepository.save(conf);
		
		return conf;
	}

}
