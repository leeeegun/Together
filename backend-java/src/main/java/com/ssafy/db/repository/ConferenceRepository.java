package com.ssafy.db.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.db.entity.Conference;
import com.ssafy.db.entity.User;

@Repository
public interface ConferenceRepository extends JpaRepository<Conference, Long>{

	Optional<Conference> findByOid(Long oid);
	boolean existsByOid(Long oid);
}
