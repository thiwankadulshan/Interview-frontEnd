export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  // Bypass for UI testing
  if (token === 'mock-token-for-testing') return true;

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const payload = JSON.parse(decodedJson);

    const currentTime = Math.floor(Date.now() / 1000);
    
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const refreshUserToken = async () => {
  return "new-sample-token";
};
