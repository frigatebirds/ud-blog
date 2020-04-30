export const STORAGE_KEY = 'login-auth'

// Do user authorization verify
export function checkAuth () {
    const auth = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return auth && Object.keys(auth).length
}
