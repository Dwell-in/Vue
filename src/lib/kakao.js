let position = { y: 37.5665, x: 126.978 }
// 메인 지도창
let map

// 지도 생성 function
const createMap = async (kakao, conatiner, lv) => {
  const mapOption = {
    center: new kakao.maps.LatLng(position.y, position.x), // 지도의 중심좌표
    level: lv, // 지도의 확대 레벨
  }

  map = new kakao.maps.Map(conatiner, mapOption)
}

// 주소로 좌표 검색
const addressSearch = async (kakao, address) => {
  // 주소-좌표 변환 객체를 생성
  let geocoder = new kakao.maps.services.Geocoder()

  geocoder.addressSearch(address, (result, status) => {
    // 정상적으로 검색이 완료됐으면
    if (status === kakao.maps.services.Status.OK) {
      position.y = result[0].y
      position.x = result[0].x
      map.setCenter(new kakao.maps.LatLng(position.y, position.x))

      // localSearch('FD6', position, marker_FD6, `/src/assets/img/marker_FD6.png`)
      // localSearch('CE7', position, marker_CE7, `/src/assets/img/marker_CE7.png`)
      // localSearch('HP8', position, marker_HP8, `/src/assets/img/marker_HP8.png`)
      // localSearch('BK9', position, marker_BK9, `/src/assets/img/marker_BK9.png`)
      // localSearch('SC4', position, marker_SC4, `/src/assets/img/marker_SC4.png`)
      // localSearch('CS2', position, marker_CS2, `/src/assets/img/marker_CS2.png`)
      // localSearch('AG2', position, marker_CS2, `/src/assets/img/marker_CS2.png`)
    }
  })
}

let markerSrc // 마커이미지 경로
let markerSize // 마커이미지 크기
let markerOption // 마커 이미지 좌표 설정

const markerSetting = (kakao) => {
  markerSrc = `/src/assets/img/marker.png`
  markerSize = new kakao.maps.Size(30, 41)
  markerOption = { offset: new kakao.maps.Point(15, 29) }
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
const createMarker = async (kakao, conatiner, infos) => {
  markerReset()
  let num = 0
  infoList = infos
  // infos.forEach( async (info) => {   // forEach는 await를 기다려 주지 않는다.
  for (const info of infos) {
    await createOverlay(kakao, info)
    await displayMarker(kakao, marker, { y: info.lat, x: info.lon }, `/src/assets/img/marker.png`)
    // await addEvent(num)
    num++
  }
}

// 각 마커의 오버레이 생성
const createOverlay = async (kakao, info) => {
  const content = `
  	<div class="overlay">
    	${info['aptNm']}
	  </div>
  `
  overlay.push(
    new kakao.maps.CustomOverlay({
      content: content,
      map: null,
      position: new kakao.maps.LatLng(info.lat, info.lon),
      yAnchor: 1.5,
    }),
  )
}

// 지도에 마커를 표시하는 함수입니다
const displayMarker = async (kakao, arr, place, markerSrc) => {
  // 마커를 생성하고 지도에 표시합니다
  arr.push(
    new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(place.y, place.x),
      image: new kakao.maps.MarkerImage(markerSrc, markerSize, markerOption),
    }),
  )
}

export { createMap, addressSearch }
