import api from "../util/api";

export const validateAuthentication = async (onFail?: () => void) => {
  await api.get(`/authenticated`, {})
    .then(
      (res) => {
        if (res.data !== true && onFail) {
          onFail();
        }
      },
    (_err) => {
      if (onFail) {
        onFail();
      }
    },
  );
}