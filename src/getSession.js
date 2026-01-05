
export const getSession = () => {
  const token = localStorage.getItem('Token');
  const userId = parseInt(localStorage.getItem('userId'), 10);
  const parentId = parseInt(localStorage.getItem('ParentID'), 10);


  return {
    token: token || null,
    userId: isNaN(userId) ? null : userId,
    parentId: isNaN(parentId) ? null : parentId,
    FName: localStorage.getItem('FName') || '',
    LName: localStorage.getItem('LName') || '',
    EMail: localStorage.getItem('email') || '',
    Mobile: localStorage.getItem('Mobile') || '',
    ProfilePicturePath: localStorage.getItem('ProfilePicturePath') || '',
    domain: localStorage.getItem('kit_domain') || '',
    DisplayName: localStorage.getItem('DisplayName') || '',
    Logo: localStorage.getItem('Logo') || '',
    LoginName: localStorage.getItem('kit_loginName') || '',
    isAuthenticated: !!token && !isNaN(userId) && !isNaN(parentId),
    channelProfileId: localStorage.getItem('channelProfileId') || '',
    channelToken: localStorage.getItem('channelToken') || '',
    APIKey: localStorage.getItem('APIKEY') || '',
    TokenId: "-2295521862261168",
    EncryptionKey: "kit19SecretKey@123"
  };
};
