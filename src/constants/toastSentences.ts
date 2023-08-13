const TOAST_SENTENCES = {
  SIGN_IN_FAILED: "ID 또는 비밀번호가 일치하지 않습니다.",

  SIGN_OUT_SUCCESS: "로그아웃되었습니다.",

  REQUEST_RESIGN: "오류가 있습니다. 다시 로그인해주세요.",

  ELEMENT_DELETED: "대상을 삭제했습니다.",

  WRONG_IN_SERVER: "서버에 문제가 있습니다. 잠시 후에 시도해주세요.",

  MAY_XSS_BE_INCLUDED: "입력할 수 없는 요소를 포함하고 있습니다.",

  INVALID_REQUEST: "올바르지 않은 요청입니다.",
  INVALID_IMAGE_EXTENSION: "jpg, jpeg, png 파일만 업로드 가능합니다.",
  IMAGE_ENCODE_FAILED:
    "이미지 인코딩에 실패했습니다. 다른 사진을 사용하거나 잠시 후에, 다시 시도해주세요.",
  FORM_NOT_FULLFILLED: "양식을 완성해주세요.",
  DATA_ID_CANNOT_BE_MODIFIED: "양식의 id를 바꿀 수 없습니다!",
  REGISTRATION_SUCCESS: "게시글이 성공적으로 등록되었습니다.",
  MODIFICATION_SUCCESS: "데이터를 수정했습니다.",
  DATA_NOT_FOUNT: "데이터를 찾을 수 없습니다.",
  NOT_VALID_ID: "유효한 데이터의 id가 아닙니다.",
} as const;

export default TOAST_SENTENCES;
