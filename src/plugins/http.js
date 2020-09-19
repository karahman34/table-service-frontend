import Axios from 'axios'

const http = Axios
const tokenName = 'auth.token'
const expiredName = 'auth.expired_at'

// Set base URL
http.defaults.baseURL = process.env.VUE_APP_API_BASE_URL

/**
 * Set token
 *
 * @param   {string}  token       
 * @param   {Number}  expired_in  seconds
 *
 * @return  {void}              
 */
function setToken(token, expiredIn = null) {
  // Store token
  window.localStorage.setItem(tokenName, token)

  if (expiredIn !== null) {
    // Set expired date
    const date = new Date
    date.setSeconds(expiredIn)

    // Store expired time
    window.localStorage.setItem(expiredName, date)
  }

  http.defaults.headers['Authorization'] = token
}

/**
 * Remove token
 *
 * @return  {void}  
 */
function removeToken() {
  // Remove token
  window.localStorage.removeItem(tokenName)

  // Remove Expired time
  window.localStorage.removeItem(expiredName)

  delete http.defaults.headers['Authorization']
}

const plugin = {
  install: Vue => {
    Vue.prototype.$http = http
  },
}

export default plugin

export {
  http,
  setToken,
  removeToken,
  tokenName,
  expiredName,
}
