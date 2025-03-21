import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import '../eventCss/EventView.css';
import axios from 'axios';
import '../css/replyList.css';
import ReviewEdit from '../js/event/ReviewEdit'
import addFile from '../img/plus.jpg';
import '../css/replyModal.css';
import edit from "../img/edit.jpg";
import del from "../img/del.jpg";
import icon1 from "../img/usericons/1.jpg";
import icon2 from "../img/usericons/2.jpg";
import icon3 from "../img/usericons/3.jpg";
import icon4 from "../img/usericons/4.jpg";
import icon5 from "../img/usericons/5.jpg";
import icon6 from "../img/usericons/6.jpg";
import icon7 from "../img/usericons/7.jpg";
import { Users } from 'lucide-react';
import backbutton from '../img/backbutton.png';
import nextbutton from '../img/nextbutton.png';


function EventView() {
  const [event, setEvent] = useState({});
  const { no } = useParams();
  const mapRef = useRef(null);
  const navigate = useNavigate();
  let [title, setTitle] = useState('');
  let [content, setContent] = useState('');
  let [isModalOpen, setIsModalOpen] = useState(false);
  let [comment, setComment] = useState([]);
  let [userIcon, setUserIcon] = useState();
  let [replies, setReplies] = useState([]);
  let [userInfo, setUserInfo] = useState({});
  const runfile = useRef([]);  //type==file실행 준비 및 사진 갯수제한용
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [uniqueImages, setUniqueImages] = useState([]);
  const [userNoFromToken, setUserNoFromToken] = useState(null);
  const [favorites, setFavorites] = useState(0)
  const [showError, setShowError] = useState(false);
  const accessToken = sessionStorage.getItem("accessToken");
  const userNo = sessionStorage.getItem("userNo");
  const icons = [icon1, icon2, icon3, icon4, icon5, icon6, icon7];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:9988/api/events/${no}`);
        console.log("API 응답 데이터:", response.data);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
      const handleEscClose = (event) => {
        if (event.keyCode === 27 && selectedImageIndex !== null) {
          closeModal();
        }
      };

      const uniqueImageUrls = new Set();
      const newUniqueImages = [];
      if (event?.img_list) {
        event?.img_list.forEach((item) => {
          if (!uniqueImageUrls.has(item.originImgurl)) {
            newUniqueImages.push(item);
            uniqueImageUrls.add(item.originImgurl);
          }
        });
        setUniqueImages(newUniqueImages);
      }
      window.addEventListener('keydown', handleEscClose);
      return () => {
        window.removeEventListener('keydown', handleEscClose);
      };
    };

    fetchEvent();
  }, [no, selectedImageIndex]);

  //후기리스트
  useEffect(() => {
    const callList = async () => {
      try {
        const listData = await axios.get('http://localhost:9988/reply/getReplies', {
          params: { eventNo: no }
        });

        const userData = await axios.get("http://localhost:9988/auth/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        setUserInfo(userData.data)

        const likeData = await axios.get(`http://localhost:9988/like/${no}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (likeData.data['result'] === true) {
          setFavorites(no)
        }

        console.log(listData.data);
        setReplies(listData.data);
      } catch (error) {
        console.error("Error fetching replies : ", error);
      }


    };
    callList();
  }, []);

  useEffect(() => {
    if (event && event.img_list) {
      const uniqueImageUrls = new Set();
      const newUniqueImages = [];
      // uniqueImages에 이미지를 넣는 코드
      event.img_list.forEach((item) => {
        if (!uniqueImageUrls.has(item.originImgurl)) {
          newUniqueImages.push(item);
          uniqueImageUrls.add(item.originImgurl);
        }
      });
      setUniqueImages(newUniqueImages);
    }
  }, [event]);

  useEffect(() => {
    if (event && mapRef.current && isOverviewExpanded) {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=524cacda57ca0207d9837c45039f39bb&libraries=services,clusterer,drawing&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          const container = mapRef.current;
          const options = {
            center: new window.kakao.maps.LatLng(event.lat, event.lng),
            level: 3,
            draggable: false, // 드래그로 지도 이동 막기
            disableDoubleClickZoom: true, // 더블클릭 확대/축소 막기
            scrollwheel: false, // 스크롤 휠 확대/축소 막기
            disableDoubleClick: true // 더블 클릭 이벤트 막기
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
  }, [event, isOverviewExpanded]);

  const toggleOverview = () => {
    setIsOverviewExpanded(!isOverviewExpanded);
  };

  //홈페이지 태그제거
  const removeTags = (str) => {
    if ((str === null) || (str === ''))
      return false;
    else
      str = str.toString();

    return str.replace(/(<([^>]+)>)/ig, '');
  }
  //overview 부분 br태그제거
  const removeBrTags = (text) => {
    return text.replace(/<br\s*\/?>/gi, '');
  };

  // 홈페이지 URL
  const extractUrl = (str) => {
    const cleanedString = removeTags(str);
    try {
      //url생성
      new URL(cleanedString);
      return cleanedString;
    } catch (e) {

      return null;
    }
  }

  const openModal = (index) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const Previous = () => {
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      } else {
        return uniqueImages.length - 1;
      }
    });
  };

  const Next = () => {
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex < uniqueImages.length - 1) {
        return prevIndex + 1;
      } else {
        return 0;
      }
    });
  };
  const BackButton = () => {
    navigate('/');
  };
  //모달창 함수
  //후기 제목 함수
  function setTitleValue(event) {
    setTitle(event.target.value);
    console.log(title);
  }

  //후기 내용 함수
  function setContentValue(event) {
    setContent(event.target.value);
    console.log(content);
  }

  async function addReply(event) {
    event.preventDefault();

    let replyData = {
      eventNo: no,
      title: title,
      content: content,
      imageIdList: []
    }

    let formData = new FormData();
    let isFile = runfile.current.files.length > 0;

    if (isFile) {
      for (let i = 0; i < runfile.current.files.length; i++) {
        formData.append("files", runfile.current.files[i]);
      }
      const fileUpload = await axios.post("http://localhost:9988/file-system/upload", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        }
      })
      replyData.imageIdList = fileUpload.data.imageIds || [];
    }
    axios.post("http://localhost:9988/reply/addReply", replyData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })
      .then(function (response) {
        console.log(response.data);
        console.log(replyData)
        if (response.data.title == "") {
          alert("제목을 입력해주세요.")
          return false;
        } else if (response.data.content == "") {
          alert("내용을 입력해주세요.")
          return false;
        }

        setIsModalOpen(false);
        iconMixer();
        setComment(prev => [...prev, response.data.list]);
      })
      .catch(function (error) { console.log(error) })
  }

  function runInputFile() {  //type=file 실행
    if (runfile.current) {
      runfile.current.click();  //file 선택창 열기
    }

    if (!runfile.current.hasChangeListener) {
      runfile.current.addEventListener('change', (event) => {
        const files = event.target.files;
        const imgList = document.querySelector('.imgList');
        const maxImage = 3;

        const existingImages = imgList.querySelectorAll('div').length;
        for (let i = 0; i < files.length; i++) {
          if (existingImages + i >= maxImage) {
            alert('이미지는 3개까지 첨부해주세요.');
            event.target.value = "";
            break;
          }
          const reader = new FileReader();
          reader.onload = function (e) {   //div에 이미지 추가
            const div = document.createElement('div');
            div.style.backgroundImage = `url(${e.target.result})`;
            div.style.cursor = 'pointer';
            div.addEventListener('click', delImg);

            imgList.appendChild(div);
          };
          reader.readAsDataURL(files[i]);
        }
      })
      runfile.current.hasChangeListener = true;
    }
  }

  function opacityController() {
    const div = document.getElementById("plus-container");
    div.style.opacity = 1;
    div.style.transition = 'all, 500ms';
  }

  function opacityController2() {
    const div = document.getElementById("plus-container");
    div.style.opacity = 0.3;
    div.style.transition = 'all, 500ms';
  }

  function delImg(event) {  //올리는 이미지 클릭시 제거
    const imgDiv = event.target;
    const imgList = document.querySelector('.imgList');

    if (imgList.contains(imgDiv)) {
      imgList.removeChild(imgDiv);
    }
  }

  const iconMixer = () => {
    const randomIndex = Math.floor(Math.random() * icons.length) + 1;
    setUserIcon(icons[randomIndex]);
    console.log(userIcon)
  }

  function ReviewDelete(no) {

    if (window.confirm("글을 삭제하시겠습니까?")) {
      axios.get(`http://localhost:9988/reply/replyDel/${no}`)
        .then(function (response) {
          console.log(response.data);

          if (response.data == "deleted") {
            const updatedReplies = replies.map(reply =>
              replies.no === no ? { ...reply, status: "DELETE" } : reply
            );
            setReplies(updatedReplies);

            alert("삭제가 완료되었습니다.");
          } else {
            alert("삭제를 실패했습니다.");
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }

  const toggleFavorite = async (itemNo) => {
    const accessToken = sessionStorage.getItem("accessToken"); // 토큰 가져오기
    try {
        const response = await axios.patch(`http://localhost:9988/like/${itemNo}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}` // 헤더에 토큰 추가
            }
        })

        if (!response.data) {
            throw new Error("찜 업데이트에 실패했습니다.")
        }

        if (favorites === itemNo) {
            setFavorites(0)
        } else {
            setFavorites(itemNo)
        }
    } catch (err) {
        if (err.response.status === 403) {
            sessionStorage.removeItem("accessToken");
            setShowError(true);
        }
    }
}

  return (
    <div className="event-view-container">
      <div className="content-wrapper">
        <button className="back-button" onClick={BackButton}>
          <span>🠔</span>
        </button>
        <div className="event-title">
          {event.title}
          <button
          className="btn"
          onClick={() => toggleFavorite(no)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill={favorites === no ? "red" : "none"}
            stroke="red"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
        </div>
        <div className="event-image" onClick={() => openModal(0)}>
          {event.img_list && event.img_list[0] && event.img_list[0].originImgurl ? (
            <img src={event.img_list[0].originImgurl} alt={event.title} />
          ) : (
            <div>No Image</div>
          )}
        </div>
        <div className="small-images">
          {event.img_list &&
            uniqueImages.map((item, idx) => {
              return (
                idx !== 0 && <img key={item.no} src={item.originImgurl} alt={`small_${idx}`} onClick={() => openModal(idx)} />
              )
            })}
        </div>
        <hr />
        <div className="event-info">
          <p><strong>{moment(event.startDate).format('YYYY.MM.DD')} ~ {moment(event.endDate).format('YYYY.MM.DD')}</strong></p>
          <p><strong>{event.addr}</strong></p>
          <div className={`overview-container ${isOverviewExpanded ? 'expanded' : ''}`}>
            <p className="overview-text">
              {removeBrTags(event?.overView || '')}
            </p>
            {!isOverviewExpanded ? (
              <button className="overview-toggle-button" onClick={toggleOverview}>
                ▼
              </button>
            ) : (
              <div className='event-info2'>
                <>
                  <p>주최 : {event.telName}</p>
                  <p>전화번호 : {event.tel}</p>
                  {event.homePage && (
                    <p>
                      홈페이지 :{' '}
                      {(() => {
                        const url = extractUrl(event.homePage);
                        return url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            {url}
                          </a>
                        ) : (
                          '홈페이지가 없습니다.'
                        );
                      })()}
                    </p>
                  )}
                  {isOverviewExpanded && <div id="kakao-map" ref={mapRef}></div>}
                  <div className="centered-button">
                    <button className="overview-toggle-button" onClick={toggleOverview}>
                      ▲
                    </button>
                  </div>
                </>
              </div>
            )}
          </div>
        </div>
      </div>

        {selectedImageIndex !== null && (
        <div className="modal-overlay" onClick={closeModal}>\
          <button className="modal-close-button" onClick={closeModal}>
            <p className='modal-close-x'>X</p>
          </button>

          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={uniqueImages[selectedImageIndex]?.originImgurl}
                alt={event.title}
                className="modal-image"
              />
              <div className='modal-button'>
              <button className="modal-nav-button prev" onClick={Previous}>
                <img src={require('../img/backbutton.png')} alt="Previous" />
              </button>
              <button className="modal-nav-button next" onClick={Next}>
                <img src={require('../img/nextbutton.png')} alt="Next" />
              </button>
            </div>

          </div>
        </div>
      )}
      <hr style={{ maxWidth: '850px', margin: '20px auto' }} />

      <div className="replies">
        <p style={{ fontSize: '1.8em' }}>Review</p>
        <div>
          {
            replies.filter(replies => replies.status !== "DELETE").map(replies => (
              <div className='replyList'>
                <ul>
                  <li id='usericon'><img src={userIcon} /></li>
                  <li id='title'>{replies.title}</li>
                  <li id='username'>{userInfo.name}</li>
                  {(replies.userNo === userInfo.no) &&
                    <li>
                      <div id="edit-container">
                        <img src={edit} className='editor' onClick={ReviewEdit} />
                        <img src={del} className='editor' onClick={() => ReviewDelete(replies.no)} />
                      </div>
                    </li>
                  }
                </ul>
              </div>
            ))
          }
        </div>

        <div>
          <input type='button' id='openWriteForm' value='후기쓰기' onClick={() => setIsModalOpen(true)} />
        </div>

        {isModalOpen && (
          <div className='modalContainer' style={{ width: '100%', height: '100%', margin: "10% 10% 0", backgroundColor: '#gray', opacity: '1' }}>
            <div className='writeForm' >
              <form onSubmit={addReply}>
                <input type='text' className='write-space' placeholder='제목을 입력해주세요.' name='title' value={title} onChange={setTitleValue} /><br />
                <textarea type='text' className='festival-modal-textarea' placeholder="후기내용을 입력하세요" value={content} onChange={setContentValue} />

                <label style={{ fontSize: '0.7em', position: 'relative', left: '20px', top: '15px' }}>사진첨부(최대 3장)</label><br />
                <input type='file' multiple ref={runfile}
                  style={{ position: 'relative', left: '10px', top: '-5px', opacity: '0', width: '65%' }} />

                <div id="plus-container" onMouseOver={opacityController}
                  onMouseOut={opacityController2} onClick={runInputFile}></div>
                <img src={addFile} id='addFile' style={{ cursor: 'pointer' }}
                  onMouseOver={opacityController}
                  onMouseOut={opacityController2}
                  onClick={runInputFile} />

                <div className='imgList'></div>

                <input type='submit' value='등 록' />
                <input type='button' value='취 소' onClick={() => setIsModalOpen(false)} />
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventView;