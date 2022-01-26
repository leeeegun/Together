package com.ssafy.api.service;

import com.ssafy.api.request.ConferenceRegPostReq;
import com.ssafy.db.entity.Conference;

public interface ConferenceService {
	Conference createCon(ConferenceRegPostReq conInfo);
}
