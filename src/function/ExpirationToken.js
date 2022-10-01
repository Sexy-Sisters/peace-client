import { instance } from "../instance/instance";

function ExpirationToken(errorMessage) {
  if (errorMessage === "만료된 토큰입니다.") {
    const putRefreshToken = async () => {
      try {
        const response = await instance.put('auth', null, {
          headers: {
            'Refresh-Token': localStorage.getItem('refresh-token')
          }
        })
        localStorage.setItem('access-token', response.data.accessToken);
      } catch (error) {
        console.log(error);
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
      }
    }
    putRefreshToken();
  }
}

export default ExpirationToken;