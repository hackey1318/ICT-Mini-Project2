package com.ict.eventHomePage.users.repository.impl;

import com.ict.eventHomePage.users.controller.response.UserResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsersRepositoryImpl {

    private final EntityManager entityManager;

    public List<UserResponse> getUserInRegion(List<String> cities) {

        if (cities == null || cities.isEmpty()) {
            return entityManager.createQuery("SELECT new com.ict.eventHomePage.users.controller.response.UserResponse(u.no AS no) FROM Users AS u", UserResponse.class)
                    .getResultList();
        }
        String jpql = "SELECT new com.ict.eventHomePage.users.controller.response.UserResponse(u.no AS no) FROM Users AS u WHERE " +
                cities.stream().map(city -> "u.addr LIKE :city" + cities.indexOf(city))
                        .collect(Collectors.joining(" OR "));

        TypedQuery<UserResponse> query = entityManager.createQuery(jpql, UserResponse.class);

        for (int i = 0; i < cities.size(); i++) {
            query.setParameter("city" + i, cities.get(i) + "%");
        }
        return query.getResultList();
    }
}
