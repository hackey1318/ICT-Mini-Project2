package com.ict.eventHomePage.users.repository;

import com.ict.eventHomePage.domain.Users;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {

    Optional<Users> findByUserId(String userId);

    Users findByNameAndEmail(String name, String email);

    Users findByUserIdAndEmail(String userId, String email);

    @Transactional
    @Modifying
    @Query(value="UPDATE Users u SET u.email = :email, u.tel = :tel, u.postal_code = :postal_code, u.addr = :addr WHERE u.no = :no", nativeQuery = true)
    int joinUpdate(@Param("no") int no, @Param("email") String email, @Param("tel") String tel, @Param("postal_code") String postal_code, @Param("addr") String addr);
}
