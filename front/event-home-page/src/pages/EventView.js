import openDetail from '../img/openDetail.png';
import ReviewEdit from '../js/event/ReviewEdit';
import ReviewDelete from '../js/event/ReviewDelete';
import ReplyWrite from '../js/event/ReplyWrite';
import '../css/replyList.css';

function EventView() {

    return (
        <div className="container">
            <div className="replies">
                <p style={{fontSize: '1.8em'}}>Review</p>
                <div>  
                    {
                        //const list = map() => 
                        <div className='replyList'>
                            <ul>
                                <li id='username'>d</li>
                                <li id='title'>d</li>

                                {
                                    <div>
                                        <label className='editor' onClick={ReviewEdit} style={{marginRight: '10px'}}>수정</label>
                                        <label className='editor' onClick={ReviewDelete}>삭제</label>
                                    </div>
                                }
                            </ul>
                        </div>
                    }
                </div>
                <div>
                    <input type='button' id='openWriteForm' value='후기쓰기' onClick={ReplyWrite}/>
                </div>
            </div>
        </div>
    );
}

export default EventView;


