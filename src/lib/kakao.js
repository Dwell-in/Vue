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
const addrToCoor = (kakao, address) => {
  // 주소-좌표 변환 객체를 생성
  const geocoder = new kakao.maps.services.Geocoder()

  return new Promise((resolve) => {
    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const { x, y } = result[0];
        resolve({ x, y });
      }
    });
  });
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
const addressSearch = async (kakao, addr, infos) => {
  position = await addrToCoor(kakao, addr)
  map.setCenter(new kakao.maps.LatLng(position.y, position.x))
  markerSetting(kakao)
  markerReset()
  let num = 0
  infoList = infos
  // infos.forEach( async (info) => {   // forEach는 await를 기다려 주지 않는다.
  for (const info of infos) {
    await createOverlay(kakao, info)
    await displayMarker(kakao, marker, { y: info.lat, x: info.lon }, `/src/assets/img/marker.png`, map)
    await addEvent(kakao, num)
    num++
  }
}

// 각 marker에 이벤트 추가
const addEvent = async (kakao, num) => {
  kakao.maps.event.addListener(marker[num], "mouseover", function () {
    overlay[num].setMap(map);
  });
  kakao.maps.event.addListener(marker[num], "mouseout", function () {
    overlay[num].setMap(null);
  });
  kakao.maps.event.addListener(marker[num], "click", function () {
    document.querySelector('.detailView').classList.add('open');
    // detailInit(infoList[num]);
  });
};

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
const displayMarker = async (kakao, arr, position, markerSrc, map) => {
  // 마커를 생성하고 지도에 표시합니다
  arr.push(
    new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(position.y, position.x),
      image: new kakao.maps.MarkerImage(markerSrc, markerSize, markerOption),
    }),
  )
}

// 카테고리로 장소 검색
// msg.documents의 값들(response)에는 여러 정보가 담겨있으나 일단 마커만 띄울 용도로 좌표만 사용중
const localSearch = (kakao, code, latlon, arr, img) => {
  const url = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${code}&page=1&x=${latlon.x}&y=${latlon.y}&radius=5000`;
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: "KakaoAK 9fc095edb70a6304836b3a8f6b980ab8",
    },
  })
  .then((res) => res.json())
  .then((msg) => {
    msg.documents.forEach((response) => {
      const position = { y: response.y, x: response.x };
      displayMarker(kakao, arr, position, img, null);
    });
  })
  .catch((error) => {
    console.error("API 호출 오류:", error);
  });
};

const localSearchAll = (kakao) => {
  localSearch(kakao, 'FD6', position, marker_FD6, `/src/assets/img/marker_FD6.png`)
  localSearch(kakao, 'CE7', position, marker_CE7, `/src/assets/img/marker_CE7.png`)
  localSearch(kakao, 'HP8', position, marker_HP8, `/src/assets/img/marker_HP8.png`)
  localSearch(kakao, 'BK9', position, marker_BK9, `/src/assets/img/marker_BK9.png`)
  localSearch(kakao, 'SC4', position, marker_SC4, `/src/assets/img/marker_SC4.png`)
  localSearch(kakao, 'CS2', position, marker_CS2, `/src/assets/img/marker_CS2.png`)
  localSearch(kakao, 'AG2', position, marker_CS2, `/src/assets/img/marker_CS2.png`)
}

// 마커 그룹 on/off
const maker_Toggle = (str, flag) => {
  let arr;
  if (str == "FD6") arr = marker_FD6;
  else if (str == "CE7") arr = marker_CE7;
  else if (str == "HP8") arr = marker_HP8;
  else if (str == "BK9") arr = marker_BK9;
  else if (str == "SC4") arr = marker_SC4;
  else if (str == "CS2") arr = marker_CS2;
  arr.forEach((mk) => {
    mk.setMap(flag ? map : null);
  });
};

export { createMap, addressSearch, localSearchAll, maker_Toggle }
