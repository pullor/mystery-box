import { acceptHMRUpdate, defineStore } from 'pinia'
import { getUrlParams } from '@/lib/utils'
import { login } from '@/api'

export const userStore = defineStore({
  id: 'user',
  state: () => ({
    appId: 'wxb546960d45a7684f',
    openId: ''
  }),
  getters: {
    authUrl: (state) => {
      return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${state.appId
              }&redirect_uri=${encodeURIComponent(location.href)
              }&response_type=code&scope=snsapi_base&state=#wechat_redirect`
    }
  },
  actions: {
    // 微信认证
    async linkAuth() {
      const openId:string = localStorage.getItem('openId') || ''
      if (!openId) {
        const { code } = getUrlParams()
        if (code) {
          const { openId } = await login({ code })
          this.openId = openId
          localStorage.setItem('openId', openId)
          location.replace(`${location.protocol}//${location.host}${location.pathname}`)
        } else {
          location.href = this.authUrl
        }
      }
      return openId
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(userStore, import.meta.hot))
}
