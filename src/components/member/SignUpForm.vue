<script setup>
import { ref, watchEffect, onBeforeUnmount, onMounted } from 'vue'
import api from '@/lib/api'
import { useRouter, useRoute } from 'vue-router'

const imgInput = ref('')
const email = ref('')
const name = ref('')
const password = ref('')
const phone = ref('')
const kakaoId = ref('')

const router = useRouter()
const route = useRoute()

const requestEmailVerification = async () => {
  try {
    const res = await api.post('/api/v1/email/send-token?email=' + email.value)
    console.log(res.data.data)
    const msg = res.data.data
    alert(msg)
  } catch (err) {
    alert(err, '이메일 인증 요청에 실패했습니다.')
  }
}

const emailVerified = ref(false)
let checkInterval = null
watchEffect(() => {
  checkInterval = setInterval(() => {
    const stored = localStorage.getItem('verifiedEmail')
    if (stored === email.value) {
      emailVerified.value = true
      clearInterval(checkInterval) // setInterval 멈추기
    }
  }, 1000)
})

onMounted(() => {
  console.log(route.query)
  if (route.query.email) {
    email.value = route.query.email
  }
  if (route.query.name) {
    name.value = route.query.name
  }
  if (route.query.kakaoId) {
    kakaoId.value = route.query.kakaoId
  }
})

// unmount 전에 반복 작업 중단
onBeforeUnmount(() => {
  clearInterval(checkInterval)
  localStorage.removeItem('verifiedEmail')
})

const handleSubmit = async () => {
  if (!emailVerified.value) {
    alert('이메일 인증이 필요합니다.')
    return
  }
  const formData = new FormData()
  const file = imgInput.value?.files[0]
  if (file) {
    formData.append('img', file)
  }
  formData.append('kakaoId', kakaoId.value)
  formData.append('email', email.value)
  formData.append('name', name.value)
  formData.append('password', password.value)
  formData.append('phone', phone.value)
  try {
    await api.post('/api/v1/member/signup', formData)
    localStorage.removeItem('verifiedEmail')
    router.push({ name: 'Login' })
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <form enctype="multipart/form-data" @submit.prevent="handleSubmit">
    <input type="hidden" name="kakaoId" :value="kakaoId" />
    <div>
      <div>
        <label for="profile">프로필 사진</label>
        <input type="file" name="img" ref="imgInput" />
      </div>
    </div>
    <div>
      <div>
        <label for="email">아이디(이메일)<span class="essential"></span></label>
        <input type="text" name="email" id="email" required v-model="email" />
      </div>
      <div>
        <p v-if="emailVerified">이메일 인증 완료!</p>
        <p v-else><button type="button" class="VerificationBtn" @click="requestEmailVerification">인증 요청</button></p>
        <span id="emailMsg"></span>
        <p>- 이메일은 로그인 아이디로 사용됩니다.</p>
      </div>
    </div>
    <div>
      <div>
        <label for="">이름<span class="essential"></span></label>
        <input
          type="text"
          name="name"
          id="signupUserName"
          placeholder="예) 홍길동 (본인실명을 띄어쓰기 없이 입력해주세요.)"
          required
          v-model="name"
        />
      </div>
    </div>
    <div>
      <div>
        <label for="">비밀번호<span class="essential"></span></label>
        <input
          type="password"
          name="password"
          id="signupPW"
          placeholder="영문, 숫자, 특수문자 포함 8~20자리"
          required
          v-model="password"
        />
      </div>
    </div>
    <div>
      <div>
        <label for="">비밀번호 확인<span class="essential"></span></label>
        <input
          type="password"
          name="password2"
          id="signupPW2"
          placeholder="비밀번호를 다시 입력해주세요."
          required
        />
      </div>
      <div>
        <span id="pwMsg"></span>
        <p>- 비밀번호는 영문, 숫자, 특수문자(~!@#^&*)를 포함해 8~20자리로 조합해주세요.</p>
        <p>
          - 동일하거나 연속한 숫자와 문자를 3자 이상 사용할 수 없습니다. (예: 111, 123, aaa, abc)
        </p>
        <p>- 아이디, 생일, 휴대폰 번호 등과 관련한 숫자는 도용될 수 있으니 사용을 자제해주세요.</p>
      </div>
    </div>
    <div>
      <div>
        <label for="phone">휴대폰번호</label>
        <input class="tel" name="phone" type="tel" id="signupPhone" v-model="phone" />
        <span>※ 정확한 연락처 정보를 입력해 주세요.</span>
      </div>
    </div>

    <div class="btns">
      <router-link :to="{ name: 'Login' }" class="btn lb" type="button" id="loginBtn">
        로그인 이동
      </router-link>
      <button class="btn sb" type="submit" id="signupBtn">회원가입</button>
    </div>
  </form>
</template>

<style scoped>
form {
  width: 80%;
  border-top: 1px solid black;
  padding-top: 50px;
}

form > div:not(.btns) {
  border-top: 1px solid lightgray;
}

form > div > div {
  display: flex;
  align-items: center;
  height: 75px;
}
form > div > div:nth-child(2) {
  height: auto;
  padding: 20px 0;
  margin-left: 18%;
  display: block;
  line-height: 1.2em;
}
form > div > div:nth-child(2) p {
  font-size: 0.7em;
  color: gray;
}

span:not(.essential) {
  padding: 15px;
  font-size: 0.85em;
}

label {
  border-top: 1px solid black;
  width: 16%;
  padding: 20px;
  font-size: 0.85em;
  height: 100%;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
input {
  height: 80%;
  padding: 20px;
  border: 1px solid lightgray;
  width: 100%;
  font-size: 0.85em;
}
select {
  height: 80%;
  padding: 5px 10px;
  border: 1px solid lightgray;
  font-size: 0.85em;
  cursor: pointer;
}
.tel {
  padding: 20px;
  width: 300px;
}
label + input,
label + select {
  margin-left: 2%;
}
input::placeholder {
  color: rgb(172, 172, 172);
  font-weight: 300;
}

.essential {
  display: inline-block;
  background: url(https://www.ssafy.com/swp/images/icons/red-bul1.png) no-repeat;
  width: 10px;
  height: 10px;
  vertical-align: middle;
  position: relative;
  margin-left: 5px;
}

.btns {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0 5%;
  gap: 50px;
  margin-top: 50px;
}
.btn {
  padding: 25px 35px;
  border-radius: 20px;
  border: none;
  color: white;
  cursor: pointer;
}

.btns .lb {
  background-color: #4f5a66;
}

.btns .sb {
  background-color: #3c90e2;
}

.VerificationBtn{
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  background-color: #49B4E6;
  color: white;
  cursor: pointer;
}
</style>
