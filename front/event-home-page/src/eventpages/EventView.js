import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import '../eventCss/EventView.css';
import '../css/replyList.css';
import ReviewEdit from '../js/event/ReviewEdit'
import ReviewDelete from '../js/event/ReviewDelete';
import axios from 'axios';
import addFile from '../img/plus.jpg';
import '../css/replyModal.css';


function EventView() {
  const location = useLocation();
  const event = location.state.event;
  const navigate = useNavigate();
  const mapRef = useRef(null);
  let [title, setTitle] = useState('');
  let [content, setContent] = useState('');
  let [isModalOpen, setIsModalOpen] = useState(false);
  const runfile = useRef([]);  //type==file실행 준비 및 사진 갯수제한용
  let [replies, setReplies] = useState([]);

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

  //후기 리스트 출력
  /*useEffect(() => {
    axios.get('http://localhost:9988/reply/getReplies')
    .then((response) => {
        console.log(response.data);
        setReplies(response.data);
    })
    .catch((error) => {console.log(error)});
  }, [response.data]);*/

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

  function addReply(event) {
      event.preventDefault();   

      axios.post("http://localhost:9988/reply/addReply")
      .then(function(response) {
          console.log(response.data);
          if(response.data.content=="") {
            alert("내용을 입력해주세요.")
            return false;
          }  

          let replyData = {
            title: title,
            content: content
          }

          setTitle('');
          setContent('');
          setIsModalOpen(false);       
      })
      .catch(function(error) {console.log(error)})
  }

  function runInputFile() {  //type=file 실행
      if(runfile.current) {
          runfile.current.click();  //file 선택창 열기
      }

      if(!runfile.current.hasChangeListener) {
          runfile.current.addEventListener('change', (event) => {
              const files = event.target.files;
              const imgList = document.querySelector('.imgList');
              const maxImage = 3;

              const existingImages = imgList.querySelectorAll('div').length;
              for(let i=0; i<files.length; i++) {
                  if(existingImages + i >= maxImage) {
                      alert('이미지는 3개까지 첨부해주세요.');
                      event.target.value = "";
                      break;
                  }

                  const reader = new FileReader();
                  reader.onload = function(e) {   //div에 이미지 추가
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

      if(imgList.contains(imgDiv)) {
          imgList.removeChild(imgDiv);
      }
  }

  return (
    <div className="event-view-container">
        <div>
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
          </div><hr/>

          <div className="replies">
              <p style={{fontSize: '1.8em'}}>Review</p>
              <div>  
                  {
                      //const list = map() => 
                      <div className='replyList'>
                            <ul>
                                <li id='username'>{replies.username}</li>
                                <li id='title'>{replies.title}</li>
                                {
                                    <div>
                                        <label className='editor' onClick={ReviewEdit} style={{marginRight: '20px'}}>수정</label>
                                        <label className='editor' onClick={ReviewDelete}>삭제</label>
                                    </div>
                                }
                            </ul>
                      </div>
                    }
              </div>

              <div>
                  <input type='button' id='openWriteForm' value='후기쓰기' onClick={() => setIsModalOpen(true)}/>
              </div>

              {isModalOpen && (                  
                  <div className='modalContainer' style={{width: '100%', height: '100%', margin: "10% 10% 0", backgroundColor: '#gray', opacity: '1' }}>            
                      <div className='writeForm' >
                          <form onSubmit={addReply}>
                              <input type='text' className='write-space' placeholder='제목을 입력해주세요.' name='title' value={title} onChange={setTitleValue}/><br/>
                              <textarea type='text' className='festival-modal-textarea' placeholder="후기내용을 입력하세요" value={content} onChange={setContentValue}/>
                      
                              <label style={{fontSize: '0.7em', position: 'relative', left: '20px', top: '15px'}}>사진첨부(최대 3장)</label><br/>
                              <input type='file' multiple ref={runfile}
                                    style={{position: 'relative', left: '10px', top: '-5px', opacity: '0', width: '65%' }}/>

                              <div id="plus-container" onMouseOver={opacityController} 
                                                        onMouseOut={opacityController2}></div>
                              <img src={addFile} id='addFile' style={{cursor: 'pointer'}} 
                                                        onMouseOver={opacityController} 
                                                        onMouseOut={opacityController2} 
                                                        onClick={runInputFile}/>

                              <div className='imgList'></div>
          
                              <input type='submit' value='등 록'/>
                              <input type='button' value='취 소' onClick={() => setIsModalOpen(false)}/>
                          </form>
                      </div>
                  </div>
                )}
          </div>
      </div>            
  </div>
  );
}

export default EventView;

