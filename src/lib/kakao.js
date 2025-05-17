import { reactive } from 'vue'
import { loadScript } from './loadScript'
import api from '@/lib/api'
import maker0 from '@/assets/img/marker.png'
import maker1 from '@/assets/img/marker_FD6.png'
import maker2 from '@/assets/img/marker_CE7.png'
import maker3 from '@/assets/img/marker_SC4.png'
import maker4 from '@/assets/img/marker_HP8.png'
import maker5 from '@/assets/img/marker_BK9.png'
import maker6 from '@/assets/img/marker_CS2.png'

const state = reactive({
  kakao: null,
  info: null,
  store: null,
  infoList: [],
})

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
  state.store = s||null
}

let position = { y: 37.5665, x: 126.978 }
let map

let marker = []
let overlay = []

let markerSrc
let markerSize
let markerOption

const markerSetting = () => {
  markerSrc = maker0
  markerSize = new state.kakao.maps.Size(30, 41)
  markerOption = { offset: new state.kakao.maps.Point(15, 29) }
}

const markerCategoryMap = {
  FD6: { arr: [], img: maker1 },
  CE7: { arr: [], img: maker2 },
  SC4: { arr: [], img: maker3 },
  HP8: { arr: [], img: maker4 },
  BK9: { arr: [], img: maker5 },
  CS2: { arr: [], img: maker6 },
}

const resetMarkers = (list) => {
  list.forEach((mk) => mk.setMap(null))
  list.length = 0
}

const markerReset = () => {
  resetMarkers(marker)
  resetMarkers(overlay)
  Object.values(markerCategoryMap).forEach(({ arr }) => resetMarkers(arr))
}

const displayMarker = async (arr, position, markerSrc, mapRef) => {
  arr.push(
    new state.kakao.maps.Marker({
      map: mapRef,
      position: new state.kakao.maps.LatLng(position.y, position.x),
      image: new state.kakao.maps.MarkerImage(markerSrc, markerSize, markerOption),
    }),
  )
}

const createOverlay = async (info) => {
  const content = `<div class="overlay">${info['aptNm']}</div>`
  overlay.push(
    new state.kakao.maps.CustomOverlay({
      content,
      map: null,
      position: new state.kakao.maps.LatLng(info.lat, info.lon),
      yAnchor: 1.5,
    }),
  )
}

const addEvent = async (num) => {
  const mk = marker[num]
  state.kakao.maps.event.addListener(mk, 'mouseover', () => overlayToggle(num, true))
  state.kakao.maps.event.addListener(mk, 'mouseout', () => overlayToggle(num, false))
  state.kakao.maps.event.addListener(mk, 'click', () => {
    state.store.detailToggle(true)
    state.info = infoList[num]
  })
}

const overlayToggle = (num, oper) => {
  overlay[num]?.setMap(oper ? map : null)
}

let infoList

const addressSearch = async (addr, infos) => {
  position = await addrToCoor(addr)
  map.setCenter(new state.kakao.maps.LatLng(position.y, position.x))
  markerSetting()
  markerReset()
  infoList = infos
  let num = 0
  for (const info of infos) {
    await createOverlay(info)
    await displayMarker(marker, { y: info.lat, x: info.lon }, markerSrc, map)
    await addEvent(num)
    num++
  }
}

const addrToCoor = (address) => {
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

const createMap = async (container, lv) => {
  const mapOption = {
    center: new state.kakao.maps.LatLng(position.y, position.x),
    level: lv || 4,
  }
  map = new state.kakao.maps.Map(container, mapOption)

  state.kakao.maps.event.addListener(map, 'idle', async () => {
    const bounds = map.getBounds()
    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()

    try {
      const res = await api.get(
        `/api/v1/house/in-bound?swLat=${sw.getLat()}&swLng=${sw.getLng()}&neLat=${ne.getLat()}&neLng=${ne.getLng()}`,
      )
      console.log(res.data.data)
      markerSetting()
      markerReset()

      let num = 0
      infoList = res.data.data
      state.infoList = res.data.data
      for (const info of infoList) {
        await createOverlay(info)
        await displayMarker(marker, { y: info.lat, x: info.lon }, markerSrc, map)
        await addEvent(num)
        num++
      }
    } catch (error) {
      console.error('지도 영역 아파트 정보 불러오기 실패:', error)
    }
  })
}

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
        const pos = { y: response.y, x: response.x }
        displayMarker(arr, pos, img, null)
      })
    })
    .catch((error) => {
      console.error('API 호출 오류:', error)
    })
}

const localSearchAll = () => {
  Object.entries(markerCategoryMap).forEach(([code, { arr, img }]) => {
    localSearch(code, position, arr, img)
  })
}

const maker_Toggle = (code, flag) => {
  const target = markerCategoryMap[code]?.arr
  if (!target) return
  target.forEach((mk) => mk.setMap(flag ? map : null))
}

const roadviewOn = async (roadviewContainer, lat, lng) => {
  if (state.kakao == null){
    await init()
  }
  const roadview = new state.kakao.maps.Roadview(roadviewContainer)
  const roadviewClient = new state.kakao.maps.RoadviewClient()
  const pos = new state.kakao.maps.LatLng(lat, lng)
  roadviewClient.getNearestPanoId(pos, 50, (panoId) => {
    roadview.setPanoId(panoId, pos)
  })
}

export {
  state,
  init,
  createMap,
  addressSearch,
  localSearchAll,
  maker_Toggle,
  roadviewOn,
  overlayToggle,
}
