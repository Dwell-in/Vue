네이버 검색 API를 사용하면 뉴스뿐 아니라 블로그, 쇼핑 등의 데이터도 조회할 수 있음

# 0. 네이버 검색 API 키 발급

![](https://velog.velcdn.com/images/ksj0314/post/9307ba68-4c5e-4c9c-8bd3-c54aedced43e/image.png)

사용 API를 “검색”으로 설정하는 것만 주의

Client ID, Client Secret 사용 

# 1. 컨트롤러 작성

```jsx
@Controller
@RequestMapping("/news")
public class NewsController {
	
	 private final ObjectMapper objectMapper = new ObjectMapper();

	    @GetMapping("/api-test")
	    @ResponseBody
	    public ResponseEntity<?> getBlogData(@RequestParam String query) {
	        try {
	            String encodedQuery = URLEncoder.encode(query, "UTF-8");
	            String apiUrl = "https://openapi.naver.com/v1/search/blog.json?query=" + encodedQuery;

	            Map<String, String> headers = new HashMap<>();
	            headers.put("X-Naver-Client-Id", ID);
	            headers.put("X-Naver-Client-Secret", Secret);

	            Map<String, Object> response = fetchJson(apiUrl, headers);
	            return ResponseEntity.ok(response);

	        } catch (Exception e) {
	            return ResponseEntity.internalServerError().body("API 요청 실패: " + e.getMessage());
	        }
	    }
	
	private Map<String, Object> fetchJson(String apiUrl, Map<String, String> headers) throws Exception {
        HttpURLConnection conn = (HttpURLConnection) new URL(apiUrl).openConnection();
        conn.setRequestMethod("GET");
        headers.forEach(conn::setRequestProperty);

        try (InputStream is = conn.getResponseCode() == 200 ? conn.getInputStream() : conn.getErrorStream()) {
            return objectMapper.readValue(is, new TypeReference<>() {});
        } finally {
            conn.disconnect();
        }
    }
}

```

API 문서를 참조해서 구조를 그대로 가져옴

- `is`에서 읽은 데이터를 JSON으로 파싱하여, `objectMapper`를 사용해 적절한 객체 타입으로 변환
- `TypeReference`를 사용하여 제네릭 타입을 명시하지 않고 `objectMapper`가 어떤 타입으로 변환할지 알려줌