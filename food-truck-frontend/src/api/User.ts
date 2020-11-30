import api from "../util/api";

export const validateAuthentication = async (onFail?: () => void) => {
  console.log('ye');
  await api.get(`/authenticated`, {})
    .then(
      (res) => {
        if (res.data !== true && onFail) {
          console.log('hi');
          onFail();
        }
      },
    (_err) => {
      if (onFail) {
        console.log('hi2');
        onFail();
      }
    },
  );
}