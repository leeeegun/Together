<h3>DB 기본 정보</h3>

**사용 DB: mysql** <br/>
- ID: ssafy <br/>
- PW: ssafyA406 <br/>
- port번호: 3306 <br/>
- DB 이름: together <br>
----------------------------
**Table 정보**

- User 테이블 <br>

| Flied      | Type         | Null | Key  | Default | Extra          |
| -----      | ----         | ---- | ---- | ------  | ------         |
| uid        | bigint       | NO   | PRI  | NULL    | auto_increment |
| name       | varchar(255) | YES  |      | NULL    |                |
| user_id    | varchar(255) | YES  | UNI  | NULL    |                |
| disability | varchar(255) | YES  |      | NULL    |                |
| nickname   | varchar(255) | YES  |      | NULL    |                |
| password   | varchar(255) | YES  |      | NULL    |                |
| email      | varchar(255) | YES  |      | NULL    |                |
| oid        | bigint       | YES  | MUL  | NULL    |                |

- Conference 테이블

| Flied       | Type         | Null | Key  | Default | Extra  |
| -----       | ----         | ---- | ---- | ------  | ------ |
| oid         | bigint       | NO   | PRI  | NULL    |        |
| title       | varchar(255) | YES  |      | NULL    |        |
| description | varchar(255) | YES  |      | NULL    |        |
| is_active   | tinyint(1)   | YES  |      | NULL    |        |
