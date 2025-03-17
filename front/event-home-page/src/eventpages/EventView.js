import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import './../eventCss/EventView.css';

function EventView() {
  const location = useLocation();
  const event = location.state.event;
  const navigate = useNavigate();
  const mapRef = useRef(null);

  useEffect(() => {
    if (event && mapRef.current) {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=524cacda57ca0207d9837c45039f39bb&libraries=services,clusterer,drawing&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          const container = mapRef.current;
          const options = {
            center: new window.kakao.maps.LatLng(event.lat, event.lng),
            level: 3
          };
          const map = new window.kakao.maps.Map(container, options);

          const markerPosition = new window.kakao.maps.LatLng(event.lat, event.lng);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition
          });
          marker.setMap(map);
        });
      };
    }
  }, [event]);

  if (!event) {
    return <div>이벤트 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="event-view-container">
      <div className="content-wrapper">
        <div className="event-title">
          {event.title}
        </div>
        <div className="event-image">
          <img src={event.img_list[0].originImgurl} alt={event.title} />
        </div>
        <div className="small-images">
          {
            event.img_list.map((item, idx) => {
              return (
                idx !== 0 && <img key={item.no} src={item.originImgurl} alt={`small_${idx}`} />
              )
            })
          }
        </div>

        <div className="event-info">
          <p><strong>{moment(event.startDate).format('YYYY.MM.DD')} ~ {moment(event.endDate).format('YYYY.MM.DD')}</strong></p>
          <p><strong>{event.addr}</strong></p>
          <p>{event.overView}</p>
          <p>주최 : {event.telName}</p>
          <p>전화번호 : {event.tel}</p>
        </div>

        <div id="kakao-map" ref={mapRef}></div>
      </div>
    </div>
  );
}

export default EventView;