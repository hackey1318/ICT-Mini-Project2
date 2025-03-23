import axios from "axios";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import addFile from '../../img/plus.jpg';
import apiFileClient from './../axiosFileConfig';
import apiClient from './../axiosConfig';


function ReviewEdit() {
    const { no } = useParams();
    let [title, setTitle] = useState('');
    let [content, setContent] = useState('');
    let [isModalOpen, setIsModalOpen] = useState(false);
    const runfile = useRef([]);  //type==file실행 준비 및 사진 갯수제한용
    const accessToken = sessionStorage.getItem("accessToken");
    const userNo = sessionStorage.getItem("userNo");

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

        // let formData = new FormData();
        let replyData = {
            eventNo: no,
            title: title,
            content: content,
            imageIdList: []
        }

        let formData = new FormData();
        for (let i = 0; i < runfile.current.files.length; i++) {
            formData.append("files", runfile.current.files[i]);
        }

        const fileUpload = await apiFileClient.post("/file-system/upload", formData)

        replyData.imageIdList = fileUpload.data.map(item => item.imageId);

        apiClient.post("/reply/addReply", replyData)
            .then(function (response) {
                console.log(response.data);
                console.log(replyData)
                if (response.data.content == "") {
                    alert("내용을 입력해주세요.")
                    return false;
                }
                setIsModalOpen(false);
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

    return (
        <div className="editContainer">
            <div className='writeForm' >
                <form onSubmit={addReply}>
                    <input type='text' className='write-space' placeholder='제목을 입력해주세요.' name='title' value={title} onChange={setTitleValue} /><br />
                    <textarea type='text' className='festival-modal-textarea' placeholder="후기내용을 입력하세요" value={content} onChange={setContentValue} />

                    <label style={{ fontSize: '0.7em', position: 'relative', left: '20px', top: '15px' }}>사진첨부(최대 3장)</label><br />
                    <input type='file' multiple ref={runfile}
                        style={{ position: 'relative', left: '10px', top: '-5px', opacity: '0', width: '65%' }} />

                    <div id="plus-container" onMouseOver={opacityController}
                        onMouseOut={opacityController2}></div>
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
    );
}

export default ReviewEdit;