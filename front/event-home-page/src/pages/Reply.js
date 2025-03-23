import {Link} from 'react-router-dom';
import axios from 'axios';
import '../css/replyModal.css';
import addFile from '../img/plus.jpg';
import { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import AddReply from '../js/event/AddReply';
import apiClient from '../js/axiosConfig';

function Reply() {

    let [title, setTitle] = useState('');
    let [content, setContent] = useState('');

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

    function addReply() {

        apiClient.post("/reply/addReply")
        .then(function(response) {
            console.log(response.data);

            if(response.data.content=="") {
                alert("내용을 입력해주세요.")
            }             
        })
        .catch(function(error) {
            console.log(error);
        })
    }
    
    const runfile = useRef([]);  //type==file실행 준비 및 사진 갯수제한용
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

    function delImg(event) {  //올리는 이미지 클릭시 제거
        const imgDiv = event.target;
        const imgList = document.querySelector('.imgList');

        if(imgList.contains(imgDiv)) {
            imgList.removeChild(imgDiv);
        }
    }

    function closeReply() {  //모달닫기

    }

    const StyledLink = styled(Link)`text-decoration: none; color: inherit;`;

    return (
        <div className='container' style={{width: '100%', margin: "10% 10% 0"}}>            
            <div className='writeForm'>
                <form onSubmit={addReply}>
                    <input type='text' placeholder='제목을 입력해주세요.' name='title' value={title} onChange={setTitleValue}/><br/>
                    <textarea type='text' className='class="form-control"' placeholder='후기를 입력해주세요.' name='content'  
                                          value={content} onChange={setContentValue}/><br/>
            
                    <label style={{fontSize: '0.7em', position: 'relative', left: '10px', top: '-5px'}}>사진첨부(최대 3장)</label><br/>
                    <input type='file' multiple ref={runfile}
                           style={{position: 'relative', left: '10px', top: '-5px', opacity: '0', width: '65%' }}/>
                    <img src={addFile} id='addFile' style={{cursor: 'pointer'}} onClick={runInputFile}/>

                    <div className='imgList'></div>

                    <input type='submit' value='등 록'/>
                    <input type='button' value='취 소' onClick={closeReply}/>
                </form>
            </div>
        </div>
    );
}

export default Reply;


