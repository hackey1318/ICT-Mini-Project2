package com.ict.eventHomePage.users.repository;

import com.ict.eventHomePage.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {

    Optional<Users> findByUserId(String userId);

    Users findByNameAndEmail(String name, String email);

    Users findByUserIdAndEmail(String userId, String email);

}
