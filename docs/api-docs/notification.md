# 사용자 알림 API


| Description   | PATH         | REST  |
|---------------|--------------|-------|
| 사용자 알림 갯수 조회  | /noti/count  | GET   |
| 사용자 알림 리스트 조회 | /noti        | GET   |
| 사용자 알림 읽음 처리  | /noti        | PATCH |

---

## 사용자 알림 갯수 조회
### GET /noti/count

| response |
|----------|
| 13       |

---

## 사용자 알림 리스트 조회
### GET /noti

### Response
```json
[
  {
    "no": 1,
    "userNo": 1,
    "content": "Test입니다.",
    "status": "readable",
    "createdAt": "2025-03-06 12:10:10",
    "updatedAt": "2025-03-06 12:10:10"
  }
]
```
---

## 사용자 알림 읽음
### PATCH /noti/count
| request    |
|------------|
| (1,4,5,8)  |

| response   |
| ---------- |
| 4          |

---