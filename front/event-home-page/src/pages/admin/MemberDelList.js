import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./../../css/admin.css";

function MemberDelList() {
  const [withdrawalData, setWithdrawalData] = useState([]);
  const [pageNumber, setPageNumber] = useState([]);
  const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      getMemberDelList(1);
    }
  }, []);

  function getMemberDelList(page) {
    let url = `http://localhost:9988/member/memberDelList?nowPage=${page}`;
    axios
      .get(url)
      .then((response) => {
        setWithdrawalData(
          response.data.list.map((record) => ({
            userNo: record.userNo,
            content: record.content,
            createdAt: record.createdAt.split("T")[0],
          }))
        );
        const pVO = response.data.pVO;
        setPageNumber(
          Array.from(
            {
              length: Math.min(
                pVO.onePageCount,
                pVO.totalPage - pVO.startPageNum + 1
              ),
            },
            (_, i) => pVO.startPageNum + i
          )
        );
        setNowPage(pVO.nowPage);
        setTotalPage(pVO.totalPage);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <>
      <h3 className="mb-4 d-none d-md-block">회원 탈퇴 명단</h3>

    <div className="admin-container">
      <div style={{ display: "flex" }}>
        <div className="admin-content">
          <div
            className="admin-table-header"
            style={{ gridTemplateColumns: "1fr 2fr 2fr" }}
          >
            <div>회원번호</div>
            <div>탈퇴일</div>
            <div>탈퇴사유</div>
          </div>
          {withdrawalData.map((record, index) => (
            <div
              key={index}
              className="admin-table-row"
              style={{ gridTemplateColumns: "1fr 2fr 2fr" }}
            >
              <div>{record.userNo}</div>
              <div>{record.createdAt}</div>
              <div>{record.content}</div>
            </div>
          ))}
          <ul className="admin-pagination">
            {nowPage > 1 && (
              <li className="admin-page-item">
                <a
                  className="admin-page-link"
                  onClick={() => getMemberDelList(nowPage - 1)}
                >
                  Previous
                </a>
              </li>
            )}
            {pageNumber.map((pg) => (
              <li key={pg} className="admin-page-item">
                <a
                  className={`admin-page-link ${
                    nowPage === pg ? "active" : ""
                  }`}
                  onClick={() => getMemberDelList(pg)}
                >
                  {pg}
                </a>
              </li>
            ))}
            {nowPage < totalPage && (
              <li className="admin-page-item">
                <a
                  className="admin-page-link"
                  onClick={() => getMemberDelList(nowPage + 1)}
                >
                  Next
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}

export default MemberDelList;