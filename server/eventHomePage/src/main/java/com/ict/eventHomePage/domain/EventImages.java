package com.ict.eventHomePage.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table(name = "event_images")
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;

    @Column(name = "event_no")
    private int eventNo;

    @Column(nullable = false, length = 100)
    private String imgName;

    @Column(nullable = false, length =200 , name="origin_imgurl")
    private String originImgurl;

    @Column(nullable = false, length = 200 , name="small_image")
    private String smallImage;
}
