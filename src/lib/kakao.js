import { reactive } from 'vue'
import { loadScript } from './loadScript'

const state = reactive({
  kakao: null,
  info: null,
  store: null,
})

// 카카오 Map API 호출, kakao 객체 받아오기
const loadKakaoAPI = async () => {
  if (window.kakao && window.kakao.maps) return window.kakao
  await loadScript(
    `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services,clusterer,drawing&autoload=false`,
  )
  return new Promise((resolve) => {
    window.kakao.maps.load(() => resolve(window.kakao))
  })
}

const init = async (s) => {
  state.kakao = await loadKakaoAPI()
  state.store = s
}

let position = { y: 37.5665, x: 126.978 }
let map

// 지도 생성 function
const createMap = async (conatiner, lv) => {
  const mapOption = {
    center: new state.kakao.maps.LatLng(position.y, position.x), // 지도의 중심좌표
    level: lv || 4, // 지도의 확대 레벨
  }

  map = new state.kakao.maps.Map(conatiner, mapOption)
}

// 주소로 좌표 검색
const addrToCoor = (address) => {
  // 주소-좌표 변환 객체를 생성
  const geocoder = new state.kakao.maps.services.Geocoder()

  return new Promise((resolve) => {
    geocoder.addressSearch(address, (result, status) => {
      if (status === state.kakao.maps.services.Status.OK) {
        const { x, y } = result[0]
        resolve({ x, y })
      }
    })
  })
}

let markerSrc // 마커이미지 경로
let markerSize // 마커이미지 크기
let markerOption // 마커 이미지 좌표 설정

const markerSetting = () => {
  markerSrc = `/src/assets/img/marker.png`
  markerSize = new state.kakao.maps.Size(30, 41)
  markerOption = { offset: new state.kakao.maps.Point(15, 29) }
}

let marker = [] // 각 부동산 거래에 해당하는 마커 들
let overlay = [] // 위 마커의 overlay
let marker_FD6 = [] // 주변 상권 마커 - 음식점
let marker_CE7 = [] // 주변 상권 마커 - 카페
let marker_HP8 = [] // 주변 상권 마커 - 병원
let marker_BK9 = [] // 주변 상권 마커 - 은행
let marker_SC4 = [] // 주변 상권 마커 - 학교
let marker_CS2 = [] // 주변 상권 마커 - 편의점

const markerReset = () => {
  marker.forEach((mk) => mk.setMap(null))
  marker_FD6.forEach((mk) => mk.setMap(null))
  marker_CE7.forEach((mk) => mk.setMap(null))
  marker_HP8.forEach((mk) => mk.setMap(null))
  marker_BK9.forEach((mk) => mk.setMap(null))
  marker_SC4.forEach((mk) => mk.setMap(null))
  marker_CS2.forEach((mk) => mk.setMap(null))
  overlay.forEach((mk) => mk.setMap(null))

  marker = []
  marker_FD6 = []
  marker_CE7 = []
  marker_HP8 = []
  marker_BK9 = []
  marker_SC4 = []
  marker_CS2 = []
  overlay = []
}

let infoList = []
const addressSearch = async (addr, infos) => {
  position = await addrToCoor(addr)
  map.setCenter(new state.kakao.maps.LatLng(position.y, position.x))
  markerSetting()
  markerReset()
  let num = 0
  infoList = infos
  // infos.forEach( async (info) => {   // forEach는 await를 기다려 주지 않는다.
  for (const info of infos) {
    await createOverlay(info)
    await displayMarker(marker, { y: info.lat, x: info.lon }, markerSrc, map)
    await addEvent(num)
    num++
  }
}

// 각 marker에 이벤트 추가
const addEvent = async (num) => {
  state.kakao.maps.event.addListener(marker[num], 'mouseover', function () {
    overlayToggle(num, true)
  })
  state.kakao.maps.event.addListener(marker[num], 'mouseout', function () {
    overlayToggle(num, false)
  })
  state.kakao.maps.event.addListener(marker[num], 'click', function () {
    state.store.detailToggle(true)
    state.info = infoList[num]
  })
}
const overlayToggle = (num, oper) => {
  if (oper){
    overlay[num].setMap(map)
  } else{
    overlay[num].setMap(null)
  }
}

// 각 마커의 오버레이 생성
const createOverlay = async (info) => {
  const content = `
  	<div class="overlay">
    	${info['aptNm']}
	  </div>
  `
  overlay.push(
    new state.kakao.maps.CustomOverlay({
      content: content,
      map: null,
      position: new state.kakao.maps.LatLng(info.lat, info.lon),
      yAnchor: 1.5,
    }),
  )
}

// 지도에 마커를 표시하는 함수입니다
const displayMarker = async (arr, position, markerSrc, map) => {
  // 마커를 생성하고 지도에 표시합니다
  arr.push(
    new state.kakao.maps.Marker({
      map: map,
      position: new state.kakao.maps.LatLng(position.y, position.x),
      image: new state.kakao.maps.MarkerImage(markerSrc, markerSize, markerOption),
    }),
  )
}

// 카테고리로 장소 검색
// msg.documents의 값들(response)에는 여러 정보가 담겨있으나 일단 마커만 띄울 용도로 좌표만 사용중
const localSearch = (code, latlon, arr, img) => {
  const url = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${code}&page=1&x=${latlon.x}&y=${latlon.y}&radius=5000`
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'KakaoAK 9fc095edb70a6304836b3a8f6b980ab8',
    },
  })
    .then((res) => res.json())
    .then((msg) => {
      msg.documents.forEach((response) => {
        const position = { y: response.y, x: response.x }
        displayMarker(arr, position, img, null)
      })
    })
    .catch((error) => {
      console.error('API 호출 오류:', error)
    })
}

const localSearchAll = () => {
  localSearch('FD6', position, marker_FD6, `/src/assets/img/marker_FD6.png`)
  localSearch('CE7', position, marker_CE7, `/src/assets/img/marker_CE7.png`)
  localSearch('HP8', position, marker_HP8, `/src/assets/img/marker_HP8.png`)
  localSearch('BK9', position, marker_BK9, `/src/assets/img/marker_BK9.png`)
  localSearch('SC4', position, marker_SC4, `/src/assets/img/marker_SC4.png`)
  localSearch('CS2', position, marker_CS2, `/src/assets/img/marker_CS2.png`)
  localSearch('AG2', position, marker_CS2, `/src/assets/img/marker_CS2.png`)
}

// 마커 그룹 on/off
const maker_Toggle = (str, flag) => {
  let arr
  if (str == 'FD6') arr = marker_FD6
  else if (str == 'CE7') arr = marker_CE7
  else if (str == 'HP8') arr = marker_HP8
  else if (str == 'BK9') arr = marker_BK9
  else if (str == 'SC4') arr = marker_SC4
  else if (str == 'CS2') arr = marker_CS2
  arr.forEach((mk) => {
    mk.setMap(flag ? map : null)
  })
}

// 로드뷰
const roadviewOn = (roadviewContainer, lat, lng) => {
  const roadview = new state.kakao.maps.Roadview(roadviewContainer) //로드뷰 객체
  const roadviewClient = new state.kakao.maps.RoadviewClient()

  const position = new state.kakao.maps.LatLng(lat, lng)
  roadviewClient.getNearestPanoId(position, 50, function (panoId) {
    roadview.setPanoId(panoId, position) //panoId와 중심좌표를 통해 로드뷰 실행
  })
}
//

export { state, init, createMap, addressSearch, localSearchAll, maker_Toggle, roadviewOn, overlayToggle }
