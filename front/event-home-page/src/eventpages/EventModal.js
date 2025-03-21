import React, { useState, useEffect, useRef } from 'react';
import '../eventCss/EventModal.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'; 

function EventModal({ event, onClose }) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    console.log(event);
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    
    const handleEscClose = (event) => {
      if (event.keyCode === 27) { 
        onClose(); 
      }
    };

    window.addEventListener('keydown', handleEscClose);

    return () => {
      window.removeEventListener('resize', checkOverflow);
      window.removeEventListener('keydown', handleEscClose); 
    };
  }, [onClose]); 

  if (!event) {
    return null;
  }

  const handleViewDetailsClick = () => {
    console.log(event);
    navigate(`/eventview/${event.no}`, );
  };
  
  const removeBrTags = (text) => {
    return text.replace(/<br\s*\/?>/gi, '');
  };

  const overviewText = removeBrTags(event.overView);

  return (
    <div className="modal-overlay2">
      <div className="modal-contents2">
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
            className="modal-image2"
          />
          <p>
            <strong>{moment(event.startDate).format('YYYY-MM-DD')} ~ {moment(event.endDate).format('YYYY-MM-DD')}</strong>
          </p>
          <p>
            <strong>행사 장소:</strong> {event.addr}
          </p>
          <div className="overview-container">
            <div
              className="overview"
              ref={textRef}
            >
              {overviewText}
            </div>

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