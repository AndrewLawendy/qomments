export const hasLocalAuth = () => {
  return Boolean(
    localStorage.getItem(
      "firebase:authUser:AIzaSyC4GZCNRwbS-iEKWwui5cPPdCB0WZk7grw:[DEFAULT]"
    )
  );
};
