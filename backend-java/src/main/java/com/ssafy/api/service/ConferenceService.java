package com.ssafy.api.service;

import com.ssafy.api.request.ConferencePostReq;
import com.ssafy.db.entity.Conference;

public interface ConferenceService {
	Conference create(ConferencePostReq conferenceInfo);
	Conference getConferenceByOid(Long oid);
	boolean checkConferenceDuplicate(Long oid);
}
