# 1. DB, DTO 설정

DB에 MEDIUMBLOB 타입으로 이미지 컬럼 설정, 
DTO에는 byte[ ] 타입으로 멤버 설정

```sql
CREATE TABLE IF NOT EXISTS `ssafyhome`.`member` (
  `email` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NULL,
  `password` VARCHAR(100) NULL,
  `phone` VARCHAR(45) NULL,
  `role` VARCHAR(45) NULL,
  `kakao_id` VARCHAR(45) NULL, 
  `profile_img` MEDIUMBLOB,
  PRIMARY KEY (`email`))
```

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberDTO {
	private String email;		// 이메일
	private String name;		// 이름
	private String password;	// 비밀번호
	private String phone;		// 휴대폰 번호
	private String role;		// role
	private byte[] profileImg;
	private String kakaoId;
}
```

- **MyBatis를 사용하면 BLOB 타입의 컬럼이 byte[ ] 타입의 멤버로 자동 변환됨**

# 2. 이미지 파일 업로드

file 타입 input 태그를 사용하면 편하게 파일 업로드 가능

`<input type="file"* name="img">`

# 3. 파일 저장

- file 타입은 MultipartFile 타입으로 전달됨
- 직접 DB에 저장할 수 없고, getBytes() 메소드를 통해 byte[ ] 타입으로 변환 후 DB에 저장
    
    ```java
    	@PostMapping("/signup")
    	public ResponseEntity<?> memberAdd(@ModelAttribute MemberDTO member, 
    			@RequestParam(required = false) MultipartFile img, HttpSession session) {
    		try {
    			String hashpw = pe.encode(member.getPassword());
    			if(img != null && !img.isEmpty()) {
    				member.setProfile(img.getBytes());
    			}
    			member.setRole("USER");
    			member.setPassword(hashpw);
    			mService.addMember(member);
    			return handleSuccess(member, HttpStatus.CREATED);
    		} catch (RuntimeException | IOException e) {
    			e.printStackTrace();
    			return handleFail(e);
    		}
    	}
    ```
    

# 4. 이미지 출력

- byte[ ] 타입은 직접 출력할 수 없음
- Base64 형식의 데이터를 img로 출력하려면?
    - prefix 추가 → “data:image/jpeg;bas64,”
    - Base64.getEncoder().encodeToString()메소드로 데이터 변환
- Base64 타입의 데이터를 저장하는 DTO의 멤버를 직접 반환하는 것이 아니라, 이미지를 반환하는 메소드를 별도로 만들기
    - profile이 null이면 기본 이미지를 출력하도록 함

```java
public String getProfileImg() {
		if(profile!=null) return "data:image/jpeg;base64,"+Base64.getEncoder().encodeToString(profile);
		else return "/resources/img/default_profile.png";
	}
```

- authentication 객체에서 직접 출력하지 못하기 때문에 컨트롤러를 거쳐서 출력해야 함
- JS에서 AJAX로 요청 → 현재 로그인한 유저의 정보를 반환하는 메소드 작성
    
    ```java
    	@GetMapping("/user-info")
    	public ResponseEntity<?> getCurrentUserInfo(@AuthenticationPrincipal CustomUserDetails userDetails){
    		MemberDTO member = userDetails.getMember();
    		return handleSuccess(Map.of("email",member.getEmail(),"name",member.getName(),"profileImg",member.getProfileImg()));
    	}
    ```