package com.ssafy.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.db.entity.Conference;

@Repository
public interface ConferenceRepository extends JpaRepository<Conference, Long>{

}
