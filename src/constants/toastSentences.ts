const toastSentences = {
  signInFailed: "ID 또는 비밀번호가 일치하지 않습니다.",
  signOutSuccess: "로그아웃되었습니다.",
  requestResignIn: "오류가 있습니다. 다시 로그인해주세요.",
  advertisement: {
    urlLinkInvalid: "입력한 url 주소가 올바르지 않습니다.",
  },
  deleted: "대상을 삭제했습니다.",
  noErrorMessageFromServer: "서버에 문제가 있습니다. 잠시 후에 시도해주세요.",
  includeXSS: "입력할 수 없는 요소를 포함하고 있습니다.",
  report: {
    modified: "신고 항목의 상태를 변경했습니다.",
  },
  invalidRequest: "올바르지 않은 요청입니다.",
  invalidImageExtension: "jpg, jpeg, png 파일만 업로드 가능합니다.",
  imageEncodingFailure:
    "이미지 인코딩에 실패했습니다. 다른 사진을 사용하거나 잠시 후에, 다시 시도해주세요.",
} as const;

export default toastSentences;
