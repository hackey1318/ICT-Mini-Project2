package com.ict.eventHomePage.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;

    private int eventNo;

    @Column(nullable = false, length = 100)
    private String imgName;

    @Column(nullable = false, length =200)
    private String originImgurl;

    @Column(nullable = false, length = 200)
    private String smallImage;
}
