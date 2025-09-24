let user = {userID: '', userName: '', accessToken: ''}

export const setUserData = (data) => {
    user = data
};

export const getUserData = () => user;

export const newUserToken = (token) => {
    user.accessToken = token
    localStorage.setItem('accessToken', token)
};

