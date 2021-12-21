export const getLocalUser = () => {
  const user = localStorage.getItem(
    "firebase:authUser:AIzaSyC4GZCNRwbS-iEKWwui5cPPdCB0WZk7grw:[DEFAULT]"
  );

  if (user) return JSON.parse(user);
  return user;
};
