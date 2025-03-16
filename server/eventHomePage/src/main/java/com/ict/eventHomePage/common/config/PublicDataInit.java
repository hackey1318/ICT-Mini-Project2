package com.ict.eventHomePage.common.config;

import com.ict.eventHomePage.domain.EventImages;
import com.ict.eventHomePage.domain.Events;
import com.ict.eventHomePage.events.repository.EventImagesRepository;
import com.ict.eventHomePage.events.repository.EventsRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class PublicDataInit {

    private final EventsRepository eventsRepository;
    private final EventImagesRepository eventImagesRepository;

    private final RestTemplate restTemplate;

    private final String url = "https://apis.data.go.kr/B551011/KorService1/";
    private final String countAndDataPath = "searchFestival1";
    private final String iamgePath = "detailImage1";
    private final String overviewPath = "detailCommon1";

    // 2In7XP6j53%2Fqnli9d7cmRsoX4s3GYFHZe3kms3jarWbx56fdrlNb7Q6nO%2Bfb%2FT9Dpl3klEFlnlIOHwQoN%2FNsSg%3D%3D
    // v5Lal5dhI1w%2BZVTpt1w4BZuV0rtjZD9EO0hmS%2Bt%2FW814Rr3HxbXlbTIs3yysY8730Xdpdz0UT8rQx1812sLAwg%3D%3D
    private final String serviceKey = "?serviceKey=v5Lal5dhI1w%2BZVTpt1w4BZuV0rtjZD9EO0hmS%2Bt%2FW814Rr3HxbXlbTIs3yysY8730Xdpdz0UT8rQx1812sLAwg%3D%3D";
    private final String dataType = "&_type=json";
    private final String os = "&MobileOS=ETC";
    private final String pageNo = "&pageNo=1";
    private final String app = "&MobileApp=AppTest";
    private final String eventStartDate = "&eventStartDate=20241101";

    private URI makeUrl(String path, boolean eventStartDateYn, String contentId, String listYN, String arrange, String numOfRows, String imageYn, String subImageYn, String defaultYn, String addrinfoYn, String overviewYN) throws UnsupportedEncodingException, URISyntaxException {

        String fullUrl = url + path + serviceKey + os + app + dataType + ((listYN == null) ? "" : listYN) + ((eventStartDateYn) ? eventStartDate : "") + pageNo;
        fullUrl += (contentId == null) ? "" : contentId;
        fullUrl += (arrange == null) ? "" : arrange;
        fullUrl += (numOfRows == null) ? "" : numOfRows;
        fullUrl += (imageYn == null) ? "" : imageYn;
        fullUrl += (subImageYn == null) ? "" : subImageYn;
        fullUrl += (defaultYn == null) ? "" : defaultYn;
        fullUrl += (addrinfoYn == null) ? "" : addrinfoYn;
        fullUrl += (overviewYN == null) ? "" : overviewYN;
        return new URI(fullUrl);
    }

//    @PostConstruct
//    @Transactional
//    public void initDataSetting() throws UnsupportedEncodingException, URISyntaxException {
//
//        URI countUrl = makeUrl(countAndDataPath, true, null, "&listYN=N", "&arrange=O", "&numOfRows=10", null, null, null, null, null);
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Accept", "application/json");
//        headers.set("User-Agent", "Mozilla/5.0");
//
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        ResponseEntity<String> response = restTemplate.exchange(countUrl, HttpMethod.GET, entity, String.class);
//        if (response.getStatusCode().is2xxSuccessful()) {
//            System.out.println("JSON 응답: " + response.getBody());
//
//            int count = new JSONObject(response.getBody()).getJSONObject("response").getJSONObject("body").getJSONObject("items").getJSONArray("item").getJSONObject(0).getInt("totalCnt");
//            System.out.println(count);
//            // db 조회 데이터랑 비교해서 더 많으면 insert
//            long dbCount = eventsRepository.count();
//            if (count != dbCount) {
//                insertData();
//            }
//
//        } else {
//            System.out.println("HTTP 요청 실패, 응답 코드: " + response.getStatusCodeValue());
//        }
//    }
//
//    @Transactional
//    private void insertData() throws UnsupportedEncodingException, URISyntaxException {
//
//        URI dataUrl = makeUrl(countAndDataPath, true, null, "&listYN=Y", "&arrange=O", "&numOfRows=1000", null, null, null, null, null);
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Accept", "application/json");
//        headers.set("User-Agent", "Mozilla/5.0");
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        ResponseEntity<String> response = restTemplate.exchange(dataUrl, HttpMethod.GET, entity, String.class);
//        if (response.getStatusCode().is2xxSuccessful()) {
//            System.out.println("JSON 응답: " + response.getBody());
//
//            JSONArray eventList = new JSONObject(response.getBody()).getJSONObject("response").getJSONObject("body").getJSONObject("items").getJSONArray("item");
//            // db 조회 데이터랑 비교해서 더 많으면 insert
//
//            List<Events> events = new ArrayList<>();
//            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
//
//            for (int i = 0; i < eventList.length(); i++) {
//                JSONObject event = eventList.getJSONObject(i);
//
//                events.add(
//                        Events.builder()
//                                .contentId(event.getString("contentid"))
//                                .title(event.getString("title"))
//                                .addr(event.getString("addr1") + " " + event.getString("addr2"))
//                                .areaCode(Integer.parseInt(event.getString("areacode")))
//                                .sigunguCode(Integer.parseInt(event.getString("sigungucode")))
//                                .tel(event.getString("tel"))
//                                .lat(event.getString("mapy"))
//                                .lng(event.getString("mapx"))
//                                .startDate(LocalDate.parse(event.getString("eventstartdate"), formatter).atStartOfDay())
//                                .endDate(LocalDate.parse(event.getString("eventenddate"), formatter).plusDays(1).atStartOfDay())
//                                .build()
//                );
//            }
//
//            // saveAll
//            List<Events> saveEventList = eventsRepository.saveAll(events);
////            getImage(saveEventList);
//            getOverView(saveEventList);
//
//        } else {
//            System.out.println("HTTP 요청 실패, 응답 코드: " + response.getStatusCodeValue());
//        }
//    }
//
//    @Transactional
//    private void getImage(List<Events> events) throws UnsupportedEncodingException, URISyntaxException {
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Accept", "application/json");
//        headers.set("User-Agent", "Mozilla/5.0");
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        for (Events event : events) {
//
//            URI imageUrl = makeUrl(iamgePath, false, "&contentId=" + event.getContentId(), null, null, "&numOfRows=1000", "&imageYN=Y", "&subImageYN=Y", null, null, null);
//
//            ResponseEntity<String> response = restTemplate.exchange(imageUrl, HttpMethod.GET, entity, String.class);
//            if (response.getStatusCode().is2xxSuccessful()) {
//                System.out.println("JSON 응답: " + response.getBody());
//
//                // items가 없을 수 있다.
//
//                JSONObject eventImageItems = new JSONObject(response.getBody()).getJSONObject("response").getJSONObject("body").optJSONObject("items");
//                if (eventImageItems != null) {
//
//                    JSONArray eventImageList = eventImageItems.getJSONArray("item");
//
//                    List<EventImages> eventImages = new ArrayList<>();
//                    for (int i = 0; i < eventImageList.length(); i++) {
//                        JSONObject eventObj = eventImageList.getJSONObject(i);
//                        eventImages.add(
//                                EventImages.builder()
//                                        .eventNo(1)
//                                        .imgName(eventObj.getString("imgname"))
//                                        .originImgurl(eventObj.getString("originimgurl"))
//                                        .smallImage(eventObj.getString("smallimageurl")).build()
//                        );
//                    }
//
//                    // saveAll
//                    eventImagesRepository.saveAll(eventImages);
//                }
//            } else {
//                System.out.println("HTTP 요청 실패, 응답 코드: " + response.getStatusCodeValue());
//            }
//        }
//    }

//    @Transactional
//    private void getOverView(List<Events> events) throws UnsupportedEncodingException, URISyntaxException {
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Accept", "application/json");
//        headers.set("User-Agent", "Mozilla/5.0");
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        List<EventImages> eventImages = new ArrayList<>();
//        for (Events event : events) {
//
//            URI overViewUrl = makeUrl(overviewPath, false, "&contentId=" + event.getContentId(), null, null, "&numOfRows=1000", "&firstImageYN=Y", null, "&defaultYN=Y", "&addrinfoYN=Y", "&overviewYN=Y");
//
//            ResponseEntity<String> response = restTemplate.exchange(overViewUrl, HttpMethod.GET, entity, String.class);
//            if (response.getStatusCode().is2xxSuccessful()) {
//                System.out.println("JSON 응답: " + response.getBody());
//                try {
//                    JSONObject eventCommon = new JSONObject(response.getBody()).getJSONObject("response").getJSONObject("body").getJSONObject("items").getJSONArray("item").getJSONObject(0);
//                    event.setTelName(eventCommon.getString("telname"));
//                    event.setHomePage(eventCommon.getString("homepage"));
//                    event.setOverView(eventCommon.getString("overview"));
//
////                    if (eventCommon.getString("firstimage").isEmpty())
//                    // 이미지 등록
//                    eventImages.add(
//                            EventImages.builder()
//                                    .eventNo(event.getNo())
//                                    .imgName(eventCommon.getString("title") + " 대표이미지")
//                                    .originImgurl(eventCommon.getString("firstimage"))
//                                    .smallImage(eventCommon.getString("firstimage2")).build());
//                } catch (Exception e) {
//                    try {
//                        Thread.sleep(30000);
//                        response = restTemplate.exchange(overViewUrl, HttpMethod.GET, entity, String.class);
//                        if (response.getStatusCode().is2xxSuccessful()) {
//                            System.out.println("JSON 응답: " + response.getBody());
//                            JSONObject eventCommon = new JSONObject(response.getBody()).getJSONObject("response").getJSONObject("body").getJSONObject("items").getJSONArray("item").getJSONObject(0);
//                            event.setTelName(eventCommon.getString("telname"));
//                            event.setHomePage(eventCommon.getString("homepage"));
//                            event.setOverView(eventCommon.getString("overview"));
//
//                            // 이미지 등록
//                            eventImages.add(
//                                    EventImages.builder()
//                                            .eventNo(event.getNo())
//                                            .imgName(eventCommon.getString("title") + " 대표이미지")
//                                            .originImgurl(eventCommon.getString("firstimage"))
//                                            .smallImage(eventCommon.getString("firstimage2")).build());
//                        }
//                    } catch (InterruptedException ex) {
//                        throw new RuntimeException(ex);
//                    }
//                }
//                    } else {
//                System.out.println("HTTP 요청 실패, 응답 코드: " + response.getStatusCodeValue());
//            }
//        }
//        eventImagesRepository.saveAll(eventImages);
//    }

    @Transactional
//    @PostConstruct
    private void rewriteOverView() throws UnsupportedEncodingException, URISyntaxException {

        List<Events> events = eventsRepository.findAll();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json");
        headers.set("User-Agent", "Mozilla/5.0");
        HttpEntity<String> entity = new HttpEntity<>(headers);

//        List<EventImages> eventImages = new ArrayList<>();
        for (Events event : events) {

            URI overViewUrl = makeUrl(overviewPath, false, "&contentId=" + event.getContentId(), null, null, "&numOfRows=1000", "&firstImageYN=Y", null, "&defaultYN=Y", "&addrinfoYN=Y", "&overviewYN=Y");

            ResponseEntity<String> response = restTemplate.exchange(overViewUrl, HttpMethod.GET, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("JSON 응답: " + response.getBody());
                try {
                    JSONObject eventCommon = new JSONObject(response.getBody()).getJSONObject("response").getJSONObject("body").getJSONObject("items").getJSONArray("item").getJSONObject(0);
                    event.setTelName(eventCommon.getString("telname"));
                    event.setHomePage(eventCommon.getString("homepage"));
                    event.setOverView(eventCommon.getString("overview"));

//                    if (eventCommon.getString("firstimage").isEmpty())
                    // 이미지 등록
//                    eventImages.add(
//                            EventImages.builder()
//                                    .eventNo(event.getNo())
//                                    .imgName(eventCommon.getString("title") + " 대표이미지")
//                                    .originImgurl(eventCommon.getString("firstimage"))
//                                    .smallImage(eventCommon.getString("firstimage2")).build());
                } catch (Exception e) {
                    try {
                        Thread.sleep(30000);
                        response = restTemplate.exchange(overViewUrl, HttpMethod.GET, entity, String.class);
                        if (response.getStatusCode().is2xxSuccessful()) {
                            System.out.println("JSON 응답: " + response.getBody());
                            JSONObject eventCommon = new JSONObject(response.getBody()).getJSONObject("response").getJSONObject("body").getJSONObject("items").getJSONArray("item").getJSONObject(0);
                            event.setTelName(eventCommon.getString("telname"));
                            event.setHomePage(eventCommon.getString("homepage"));
                            event.setOverView(eventCommon.getString("overview"));

                            // 이미지 등록
//                            eventImages.add(
//                                    EventImages.builder()
//                                            .eventNo(event.getNo())
//                                            .imgName(eventCommon.getString("title") + " 대표이미지")
//                                            .originImgurl(eventCommon.getString("firstimage"))
//                                            .smallImage(eventCommon.getString("firstimage2")).build());
                        }
                    } catch (InterruptedException ex) {
                        throw new RuntimeException(ex);
                    }
                }
            } else {
                System.out.println("HTTP 요청 실패, 응답 코드: " + response.getStatusCodeValue());
            }
        }
        eventsRepository.saveAllAndFlush(events);
//        eventImagesRepository.saveAll(eventImages);
    }

//    @Transactional
//    @PostConstruct
//    private void reWriteImage() throws UnsupportedEncodingException, URISyntaxException {
//
//        List<Events> events = eventsRepository.findAll();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Accept", "application/json");
//        headers.set("User-Agent", "Mozilla/5.0");
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        for (Events event : events) {
//
//            URI imageUrl = makeUrl(iamgePath, false, "&contentId=" + event.getContentId(), null, null, "&numOfRows=1000", "&imageYN=Y", "&subImageYN=Y", null, null, null);
//
//            ResponseEntity<String> response = restTemplate.exchange(imageUrl, HttpMethod.GET, entity, String.class);
//            if (response.getStatusCode().is2xxSuccessful()) {
//                System.out.println("JSON 응답: " + response.getBody());
//
//                // items가 없을 수 있다.
//
//                JSONObject eventImageItems = new JSONObject(response.getBody()).getJSONObject("response").getJSONObject("body").optJSONObject("items");
//                if (eventImageItems != null) {
//
//                    JSONArray eventImageList = eventImageItems.getJSONArray("item");
//
//                    List<EventImages> eventImages = new ArrayList<>();
//                    for (int i = 0; i < eventImageList.length(); i++) {
//                        JSONObject eventObj = eventImageList.getJSONObject(i);
//                        eventImages.add(
//                                EventImages.builder()
//                                        .eventNo(event.getNo())
//                                        .imgName(eventObj.getString("imgname"))
//                                        .originImgurl(eventObj.getString("originimgurl"))
//                                        .smallImage(eventObj.getString("smallimageurl")).build()
//                        );
//                    }
//
//                    // saveAll
//                    eventImagesRepository.saveAll(eventImages);
//                }
//            } else {
//                System.out.println("HTTP 요청 실패, 응답 코드: " + response.getStatusCodeValue());
//            }
//        }
//    }
}
