import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'
import {
  setTheme,
  defaultTheme
} from '@/assets/styles/theme/setTheme.js'
const {
  sideTheme,
  showSettings,
  tagsView,
  fixedHeader,
  sidebarLogo
} = defaultSettings

const state = {
  theme: variables.theme,
  sideTheme: sideTheme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, {
    key,
    value
  }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
    if (key === 'sideTheme') {
      setTheme(value);
    }
  },
  SET_THEME: (state, data) => {
    state.sideTheme = data
  },
}

const actions = {
  changeSetting({
    commit
  }, data) {
    commit('CHANGE_SETTING', data)
  },
  // 设置用户数据
  SetUserData({
    commit,
    dispatch
  }, theme) {
    commit('SET_THEME', theme)
    // 设置主题
    setTheme(theme);
  },
  // 改变用户主题
  changeTheme({
    dispatch,
    state
  }, theme) {
    state.theme = theme;
    dispatch('SetUserData', theme);
    // 再将该用户选的主题存到数据库
  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
