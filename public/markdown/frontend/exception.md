- 기본적으로 인터셉터로 처리
- 401은 이미 로그인 페이지로 이동하도록 설정함
- 에러 페이지를 만들고, 에러 코드에 따라 다른 메세지가 표시되도록 설정

### 뷰 페이지

```jsx
<template>
  <div class="error-container">
    <div class="text-center">
      <h1>에러 발생</h1>
      <h1 class="error-code">{{ code }}</h1>
      <p class="error-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const code = route.params.code || 'ERROR';

const messages = {
  403: '접근 권한이 없습니다.',
  404: '페이지를 찾을 수 없습니다.',
  405: '허용되지 않은 메서드입니다.',
  500: '서버 내부 오류가 발생했습니다.',
};

const message = messages[code] || '알 수 없는 오류가 발생했습니다.';
</script>
```

- params로 코드 받고, 미리 설정된 에러 코드와 메세지 띄우기
- 자주 발생하는 예외가 아니면 디폴트로 처리

### 라우터

```jsx
  {
    path: '/error/:code',
    name: 'ErrorPage',
    component: ErrorPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/error/404',
  }
```

- :code로 사용해서, 코드별로 다르게 처리할 수 있도록 함
- `/:pathMatch(.*)*` 는 아무 경로도 매치되지 않았다는 뜻이므로 자동으로 404로 연결

### 인터셉터

```jsx
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      auth.removeToken()
      router.push({ name: 'Login' })
    } else if ([403, 404, 405, 500].includes(status)) {
      router.push({ name: 'ErrorPage', params: { code: status } })
    } else {
      // 지정된 에러를 제외하면 default로 처리
      router.push({ name: 'ErrorPage', params: { code: 'default' } })
    }
    return Promise.reject(error)
  },
)
```

- Axios는 응답코드 200~299면 자동으로 response 콜백 실행,
  4xx/5xx면 error 콜백 실행
- return Promise.reject(error)은 해당하는 에러를 다시 전달하는 것
  → 메소드별로 직접 예외를 처리해야 하는 경우가 있을 수 있기 때문에 반드시 필요
