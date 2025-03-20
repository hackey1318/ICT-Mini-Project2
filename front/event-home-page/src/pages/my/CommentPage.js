function CommentsPage() {
    const comments = [
        { id: 1, event: "원산산 생태 명소", content: "정말 아름다운 곳이었습니다.", date: "2025-03-15" },
        { id: 2, event: "진돗물천시장", content: "시장 분위기가 너무 좋았습니다.", date: "2025-03-10" },
    ]

    return (
        <div>
            <h2 className="h4 mb-4 d-none d-md-block">작성한 댓글</h2>

            <div className="list-group">
                {comments.map((comment) => (
                    <div key={comment.id} className="list-group-item list-group-item-action mb-2 rounded">
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{comment.event}</h5>
                            <small className="text-muted">{comment.date}</small>
                        </div>
                        <p className="mb-1">{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CommentsPage