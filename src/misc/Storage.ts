const TOKEN_KEY = 'test-token'

const storeToken = (s:string)=>{
    localStorage.setItem(TOKEN_KEY,s)
}

const getToken = () => {
    return localStorage.getItem(TOKEN_KEY)
}

const clearToken = () =>{
    localStorage.removeItem(TOKEN_KEY)
}

export const Storage = {
    storeToken,
    getToken,
    clearToken
}