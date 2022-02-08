package com.ssafy.api.service;

import com.ssafy.api.request.ConferencePostReq;
import com.ssafy.db.entity.Conference;
import com.ssafy.db.entity.User;

public interface ConferenceService {
	Conference create(User user);
	Conference getConferenceByOid(Long oid);
	boolean checkConferenceDuplicate(Long oid);
	Conference conferenceAddUser(Long oid, Long uid);
	Conference conferenceLeaveAll(Conference conference);
	Conference conferenceLeave(Conference conference, User user);
	boolean conferenceModify(ConferencePostReq conferenceInfo);
}
