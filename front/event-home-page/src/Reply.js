import axios from 'axios';
import './css/replyStyle.css';
import addFile from './img/plus.jpg';
import { useRef, useState } from 'react';

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

        axios.post("http://localhost:9988/reply/addReply")
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
            runfile.current.click();
        }
        //if() {}  //이미지 갯수 제한 및 빈div에 넣은 이미지 작게 올리기
    }

    function delImg() {  //올리는 이미지 클릭시 제거

    }

    function closeReply() {  //모달닫기

    }

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

                    <div className='imgList'>
                        <div id='replyImg1' onClick={delImg}></div>
                        <div id='replyImg2' onClick={delImg}></div>
                        <div id='replyImg3' onClick={delImg}></div>
                    </div>

                    <input type='submit' value='등 록'/>
                    <input type='button' value='취 소' onClick={closeReply}/>
                </form>
            </div>
        </div>
    );
}

export default Reply;


