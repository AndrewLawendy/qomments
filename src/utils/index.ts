export const getLocalUser = () => {
  const user = localStorage.getItem(
    "firebase:authUser:AIzaSyC4GZCNRwbS-iEKWwui5cPPdCB0WZk7grw:[DEFAULT]"
  );

  if (user) return JSON.parse(user);
  return user;
};

export const startCase = (str: string) => {
  if (str.length === 0) return;
  const firstCharacter = str.charAt(0);
  return `${firstCharacter.toUpperCase()}${str.slice(1).toLowerCase()}`;
};
