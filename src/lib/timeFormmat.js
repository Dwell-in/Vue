export const formatTime = (time) => {
  // ISO 8601 형태인 '2025-05-11T11:51:57.242Z' 같은 시간은 Date 객체로 변환 가능
  const date = new Date(time)

  // 날짜가 제대로 변환되었는지 확인
  if (isNaN(date)) return ''

  // 12시간제 '오후 08:05:27' 형식으로 변환
  return new Intl.DateTimeFormat('ko-KR', {
    hour12: true, // 12시간제 사용
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}
