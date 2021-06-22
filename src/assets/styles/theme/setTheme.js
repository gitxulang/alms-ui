/**
 * 使用此方法设置主题
 *
 * 新增主题需先在此处引入新主题的.scss文件，再在themeConfig里配置主题相关组件颜色
 */

// 先加载所有的主题(default在main.scss中加载，因为default主题对body没有使用class，可以应用在登陆页上)


// 默认主题
// import './dark/styls.scss';
export const defaultTheme = 'theme-dark';
export const themeList = [{
    name: '深黑',
    key: 'theme-dark'
  },
  {
    name: '浅灰',
    key: 'theme-light'
  }
];

export const setTheme = (themeName = defaultTheme) => {
  // console.log(themeName)
  if (themeName === 'theme-light') {
    require.ensure([], function (require) {
      require("./default/styls.scss");
    });
    if (document.body.className) document.body.className = 'default'
  } else {
    require.ensure([], function (require) {
      require("./dark/styls.scss");
    });
    // 把该主题的所有属性存到缓存
    document.body.className = themeName;
  }
}
