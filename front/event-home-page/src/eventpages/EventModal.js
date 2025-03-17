import React, { useState, useEffect, useRef } from 'react';
import '../eventCss/EventModal.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'; // React Router v6 사용

function EventModal({ event, onClose }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);
  const navigate = useNavigate(); // React Router v6 Hook

  useEffect(() => {
    console.log(event);
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  if (!event) {
    return null;
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleViewDetailsClick = () => {
    // EventView로 이동하면서 event 객체를 state로 넘겨줌
    navigate('/eventview', { state: { event: event } });
  };
  //br태그제거
  const removeBrTags = (text) => {
    return text.replace(/<br\s*\/?>/gi, '');
  };
  return (
    <div className="modal-overlay">
      <div className="modal-contents">
        <div className="modal-header">
          <h2>{event.title}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <img
            src={event.img_list[0].originImgurl}
            alt={event.title}
            className="modal-image"
          />
          <p>
            <strong>{moment(event.startDate).format('YYYY-MM-DD')} ~ {moment(event.endDate).format('YYYY-MM-DD')}</strong>
          </p>
          <p>
            <strong>행사 장소:</strong> {event.addr}
          </p>
          <div className="overview-container">
            <div className={`overview ${isExpanded ? 'expanded' : ''}`} ref={textRef}>
            {removeBrTags(event.overView)}
            </div>
            {isOverflowing && (
              <button onClick={toggleExpand} className="arrow-button">
                {isExpanded ? '▲' : '▼'}
              </button>
            )}
          </div>
        </div>
        <div className="modal-footer">  
          <button className="view-details-button" onClick={handleViewDetailsClick}>
            상세 보기
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventModal;