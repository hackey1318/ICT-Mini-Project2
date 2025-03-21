import axios from "axios";
import { useParams } from "react-router-dom";

function ReviewDelete() {

    let {no} = useParams();

    if (window.confirm("글을 삭제하시겠습니까?")) {
        axios.get(`http://localhost:9988/reply/replyDel/${no}`)
        .then(function (response) {
            console.log(response.data);
            
            if (response.data == 0) {
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

export default ReviewDelete;

