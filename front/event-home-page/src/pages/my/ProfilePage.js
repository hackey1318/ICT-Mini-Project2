function ProfilePage() {
    return (
        <div>
            <h2 className="h4 mb-4 d-none d-md-block">내 정보 수정</h2>

            <div className="card">
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                이름
                            </label>
                            <input type="text" className="form-control" id="name" defaultValue="홍길동" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                이메일
                            </label>
                            <input type="email" className="form-control" id="email" defaultValue="hong@example.com" />
                        </div>

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="submit" className="btn btn-primary">
                                저장
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage