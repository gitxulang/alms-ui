import Echarts from 'echarts';
import * as _ from 'lodash';
import store from '@/store'
let lineColor = '#dfdfdf'
let textColr= '#2b2f3a'
// defaultLine
// defaultBar2
// defaultPie
// defaultBar
let darkLineColor = 'rgba(255, 255, 255, 0.15)'
let darkTextColr= '#c6c5d4' // #A4CCFF
let tooltipStr = "{b}<br/>";
let legend = {
    show: true,  
    icon: "circle",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
    itemWidth: 10,  // 设置宽度
    itemHeight: 10, // 设置高度
    itemGap: 40 ,// 设置间距
    textStyle: {
        fontSize: 12,
        color: darkTextColr
    },
    top: 0,
    selectedMode: false
}
export const RootImg = 'image://data:image/png;base64,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'

export const MapSgyImg = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAADzUlEQVQ4T21Te0zTVxg9tw9khUEgkgLiawwBA/MxFDsmIxQQUBBUogsZGzCzxSgkc1LlYQRiYXGoM8yFqVUw6ggRBkQFbNlE5CFGxI3hAysrL9sxWTv6wF/7u8uPFeLI7l/3y7nfyfnOPR/BvEMpXQ8gE0A0AB87PAxACeAsIaTn9RYyW1BKXQB8B2AXgEYADQAe2fEAAIkAEgBcAbCHEGLgsBkCe/NNAO7Hvqkvztl/IQyg0cEhvos5/Jd7ag2n4OvjGe37sxIOA3jJKeRIZgkusywN9fLb3avT/JnsInZpaq7LWxDgv8gLFLYng+MT0VuLzQatIdZruUftyKOKtTwe6SKEpBL7zJ1hUfkDHW39C1QtRZWREcF7AYhbf/71gIWxMvHRq08C0N263V8eIc1PC4sImm5vKQ4EIOEIznT3PIndIJFZDPorHW86OabN+mK12ih3Fwj4c179bbRUubh++F5X51eOoetW3CBmMzP+efb34srzqhDGVO2uGZ4ovVR923/1qmXOy5aKlSxLLZph3ZbevufG1F3hj5f6LJQJRSmT6ZkxPadP7B4nNhtrS9hRcud6XV64SPzROeOLqgyJNBenjmXgVns/qzdY6Nb4EH5WjgIdyqNw8kxTmLQXMzdvl7fVV8vCCMNY2QMFVfKTpRn5ECRJKVOn3JZa9u2R3B07H/Q9/33KNG18XxKwslBe88PVS1/uJcLkKFh/VGXlKORlR9MOkiGNjlWrtSWREcF5QIwTpc1ThaU16Ztj1p56NvTiodnySh8UsGRjY/O97MJDOxWEbHIGWozK1j65r6/nQXLmwk3blriQO15it3DOsIbrd+nbb3mffvpsbPsbjg5DPD7fbDSaA/18va8Oqsf2JMavnzFUq5tsr7/WIyGSyEOjHSq5FwAuwrEAiufHe17NBekGgLsbIvPGCPhJFc1NR+JiolYxAI5XKFr2eSx0HdMbTO4OQoGFx+OxlulXIlcX0cs/JvTen2XElAP4oqnlgTAuvugagXDbOoHIoXty5PxvVpvVW5pQ5Ha/8+n/inhXsgLKxoK/BHzBqJtP+kqryfTvPBAmVTk4izZ2/lSsXfPO8tCBx6ODytaHA/0DI1zmERS02F36QXBgoP8i3/u96m6JtMCTMZrawNR/bE9YijMEjAqUepSWfXJYlp0kARAFYIldyswylZTVduXKLhaBQAerUArUTM1FFEhxBp8pB6FpAGkCobWgZHCGgBA/UJoMYBMorYTNvI/7yrl1/s/AwsQ1YHmfgnAKqF0B0YBCCR57FkxD7+vv/wHzkJx86eyF1QAAAABJRU5ErkJggg=='

export const MapTopBgImg = 'data:image/png;base64,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'

const color = ['#3399FF', '#FF9933', '#01B394', '#5470c6','#FF3333', '#8033FF', '#FF6D33','#91cc75','#fac858','#ee6666','#73c0de','#3ba272','#fc8452','#9a60b4','#ea7ccc'];
const  chartOptions = {
    defaultLine: (params = {}) => {
        let {title, data, theme} = params
        let option = {
            backgroundColor: 'transparent',
            color,
            title: {
                text: title || '',
                // subtext: '纯属虚构',
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    color: theme === 'dark' ? darkTextColr : textColr
                },
            },
            tooltip: {
                
            },
            legend: {
                show: true,
                icon: "rect", 
                data: data && data.legend ? data.legend : [],
                itemWidth: 15,
                itemHeight: 8,
                textStyle: {
                    fontSize: 12,
                    color: theme === 'dark' ? darkTextColr : textColr
                },
                top: 40,
                selectedMode: true
            },
            grid: {
                top: 100,
                left: 24,
                right: 10,
                bottom: 5,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: data && data.xAxis ? data.xAxis : [] ,
                axisLabel: {
                    fontSize: 14,
                    color: theme === 'dark' ? darkTextColr : textColr,
                    interval: 0
                },
                axisTick: {
                    show: true,
                    alignWithLabel: true
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                // name:  "Y轴标题",
                nameTextStyle: {
                    color: theme === 'dark' ? darkTextColr : textColr
                },
                splitNumber: 4,
                axisLabel: {
                    formatter:  123 ,
                    textStyle: {
                        color: theme === 'dark' ? darkTextColr : textColr
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: theme === 'dark' ? darkLineColor : lineColor
                    }
                },
                axisLine: {
                    show: false
                }
            },
            series: [{
                name: data.legend[0],
                data: data.seriesData[0],
                type: data.type && data.type[0] ?  data.type[0] :'line'
            },
            {
                name: data.legend[1],
                data: data.seriesData[1],
                type: data.type && data.type[1] ?  data.type[1] :'line'
            },
            {
                name: data.legend[2],
                data: data.seriesData[2],
                type: data.type && data.type[2] ?  data.type[2] :'line'
            }]
        }
        return option;
    }, 
    defaultBar2: (params = {}) => { 
        let {title, data, theme} = params
        let option = {
            backgroundColor: 'transparent',
            color,
            title: {
                text: title || '',
                // subtext: '纯属虚构',
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    color: theme === 'dark' ? darkTextColr : textColr
                },
            },
            tooltip: {
                
            },
            legend: {
                show: true,
                icon: "rect", 
                data: data && data.legend ? data.legend : [],
                itemWidth: 15,
                itemHeight: 8,
                textStyle: {
                    fontSize: 12,
                    color: theme === 'dark' ? darkTextColr : textColr
                },
                top: 40,
                selectedMode: true
            },
            grid: {
                top: 100,
                left: 24,
                right: 10,
                bottom: 5,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: data && data.xAxis ? data.xAxis : [] ,
                axisLabel: {
                    fontSize: 14,
                    color: theme === 'dark' ? darkTextColr : textColr,
                    interval: 0
                },
                axisTick: {
                    show: true,
                    alignWithLabel: true
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                // name:  "Y轴标题",
                nameTextStyle: {
                    color: theme === 'dark' ? darkTextColr : textColr
                },
                splitNumber: 4,
                axisLabel: {
                    formatter:  123 ,
                    textStyle: {
                        color: theme === 'dark' ? darkTextColr : textColr
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: theme === 'dark' ? darkLineColor : lineColor
                    }
                },
                axisLine: {
                    show: false
                }
            },
            series: [{
                name: data.legend[0],
                data: data.seriesData[0],
                type: data.type && data.type[0] ?  data.type[0] :'line'
            },
            {
                name: data.legend[1],
                data: data.seriesData[1],
                type: data.type && data.type[1] ?  data.type[1] :'line'
            }]
        }
        return option;
    },
    defaultPie:(params = {})=>{
        let {title, data, theme} = params
        let option = {
            color,
            title: {
                text: title || '',
                // subtext: '纯属虚构',
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    color: theme === 'dark' ? darkTextColr : textColr
                },
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                // orient: 'vertical',
                left: 'center',
                show: true,  
                icon: "rect",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
                itemWidth: 10,  // 设置宽度
                itemHeight: 10, // 设置高度
                itemGap: 10 ,// 设置间距
                textStyle: {
                    fontSize: 12,
                    color: theme === 'dark' ? darkTextColr : textColr
                },
                bottom:0,
                // top: 0,
                selectedMode: true
            },
            series: [ 
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '50%',
                    data:data || [],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b}: {c}\n({d}%)' //自定义显示格式(b:name, c:value, d:百分比)
                        }
                    }, 
                }
            ]
        }
        return option
    },
    // defaultBar: (params = {})=>{
    //     let options  = {
    //         color,
    //         tooltip: {
    //             trigger: 'axis',
    //             axisPointer: {
    //                 type: 'cross',
    //                 lineStyle: {
    //                     type: 'dashed'
    //                 },
    //                 label: {
    //                     backgroundColor: '#6a7985'
    //                 }
    //             }, 
    //             padding: [6, 20],  
    //         },
    //         series: [{
    //           name: '用户实时交易量1',
    //           type: 'bar',
    //           data: [100, 200,521,789,71,71],
    //           barWidth: '60%'
    //         },{
    //           name: '用户实时交易量2',
    //           type: 'bar',
    //           data: [222,,85,91,32, 362,76],
    //           barWidth: '60%'
    //         }], 
    //         xAxis: {
    //             type: 'category',
    //             boundaryGap: true,
    //             data:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] ,
    //             axisLabel: {
    //                 fontSize: 14,
    //                 color: '#C4DFFF',
    //                 interval: 0
    //             },
    //             axisTick: {
    //                 show: true,
    //                 alignWithLabel: true
    //             },
    //             splitLine: {
    //                 show: false
    //             },
    //             axisLine: {
    //                 show: false
    //             }
    //         },
    //         yAxis: {
    //             type: 'value',
    //             name:  "Y轴标题",
    //             nameTextStyle: {
    //                 color: "#C4DFFF"
    //             },
    //             splitNumber: 4,
    //             axisLabel: {
    //                 formatter:  123 ,
    //                 textStyle: {
    //                     color: '#C4DFFF'
    //                 }
    //             },
    //             axisTick: {
    //                 show: false
    //             },
    //             splitLine: {
    //                 show: true,
    //                 lineStyle: {
    //                     type: 'dashed',
    //                     color: 'rgba(255, 255, 255, 0.15)'
    //                 }
    //             },
    //             axisLine: {
    //                 show: false
    //             }
    //         },
    //         grid: {
    //             top: 30,
    //             left: 24,
    //             right: 10,
    //             bottom: 5,
    //             containLabel: true
    //         },
    //         tooltip: {
    //             trigger: 'axis',
    //             axisPointer: {
    //                 lineStyle: {
    //                     type: 'dashed'
    //                 }
    //             },
    //             formatter: tooltipStr,
    //             padding: [6, 20],
    //             backgroundColor: 'rgba(255,255,255,0.9)',
    //             textStyle: {
    //                 color: '#4F515D'
    //             },
    //             extraCssText: 'box-shadow:0px 2px 5px 0px rgba(0, 0, 0, 0.52)'
    //         },
    //         legend: {
    //             show: true,
    //             data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
    //             itemWidth: 15,
    //             itemHeight: 8,
    //             textStyle: {
    //                 fontSize: 12,
    //                 color: '#A4CCFF'
    //             },
    //             top: 0,
    //             selectedMode: true
    //         },
    //     } 
    //     return options
    // },
    defaultBar: (params = {})=>{
        let {title, data, theme} = params
        let options  = {
            title: {
                text: title || '',
                // subtext: '纯属虚构',
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    color: theme === 'dark' ? darkTextColr : textColr
                },
            },
            color,
            tooltip: { 
                trigger: 'axis',  
                axisPointer: {
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed'
                    }, 
                },   
            },
            // series: [{
            //     name: '用户实时交易量1',
            //     type: 'bar',
            //     data: [100, 200,521,789,71,71],
            //     barWidth: '60%'
            //   },{
            //     name: '用户实时交易量2',
            //     type: 'bar',
            //     data: [222,,85,91,32, 362,76],
            //     barWidth: '60%'
            //   }], 
            series: [
                { 
                    type: 'bar', 
                    barWidth: '40%',
                    name: data.legend[0] || '',
                    data: data.seriesData[0] || [], 
                },
                { 
                    type: 'bar', 
                    barWidth: '40%',
                    name: data.legend[1] || '',
                    data: data.seriesData[1] || [], 
                }
            ], 
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: data && data.xAxis ? data.xAxis : [] ,
                axisLabel: {
                    fontSize: 14,
                    color: theme === 'dark' ? darkTextColr : textColr,
                    interval: 0
                },
                axisTick: {
                    show: true,
                    alignWithLabel: true
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                // name:  "Y轴标题",
                nameTextStyle: {
                    color: theme === 'dark' ? darkTextColr : textColr
                },
                splitNumber: 4,
                axisLabel: {
                    formatter:  123 ,
                    textStyle: {
                        color: theme === 'dark' ? darkTextColr : textColr
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: theme === 'dark' ? darkLineColor : lineColor
                    }
                },
                axisLine: {
                    show: false
                }
            },
            grid: {
                top: 100,
                left: 24,
                right: 10,
                bottom: 5,
                containLabel: true
            },
            tooltip: {
                // trigger: 'axis',
                // axisPointer: {
                //     lineStyle: {
                //         type: 'dashed'
                //     }
                // },
                // formatter: tooltipStr,
                // padding: [6, 20],
                // backgroundColor: 'rgba(255,255,255,0.9)',
                // textStyle: {
                //     color: theme === 'dark' ? darkTextColr : textColr
                // },
                // extraCssText: 'box-shadow:0px 2px 5px 0px rgba(0, 0, 0, 0.52)'
            },
            legend: {
                show: true,
                data: data && data.legend ? data.legend : [],
                icon:'rect',
                itemWidth: 15,
                itemHeight: 8,
                textStyle: {
                    fontSize: 12,
                    color: theme === 'dark' ? darkTextColr : textColr
                },
                top: 40,
                selectedMode: true
            },
        } 
        return options
    },
    stackBar: (params = {})=> {
        let {title, data, theme} = params
        console.log(data.xAxis)
        let option = {
            title: {
                text: title || '',
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    color: theme === 'dark' ? darkTextColr : textColr
                },
            },
            color,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            grid: {
                top: 100,
                left: 24,
                right: 10,
                bottom: 5,
                containLabel: true
            },
            legend: {
                show: true,
                data: data && data.legend ? data.legend : [],
                icon:'rect',
                itemWidth: 15,
                itemHeight: 8,
                textStyle: {
                    fontSize: 12,
                    color: theme === 'dark' ? darkTextColr : textColr
                },
                top: 40,
                selectedMode: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: data && data.xAxis ? data.xAxis : [] ,
                axisLabel: {
                    fontSize: 14,
                    color: theme === 'dark' ? darkTextColr : textColr,
                    // interval: 0
                },
                axisTick: {
                    show: true,
                    alignWithLabel: true
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                // name:  "Y轴标题",
                nameTextStyle: {
                    color: theme === 'dark' ? darkTextColr : textColr
                },
                splitNumber: 4,
                axisLabel: {
                    formatter:  123 ,
                    textStyle: {
                        color: theme === 'dark' ? darkTextColr : textColr
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: theme === 'dark' ? darkLineColor : lineColor
                    }
                },
                axisLine: {
                    show: false
                }
            },
            series: [
                { 
                    type: 'bar', 
                    barWidth: '40%',
                    name: data.legend[0] || '',
                    data: data.seriesData[0] || [], 
                    // stack:'23',  // 数据堆叠，必须添加相同的stack属性
                },
                { 
                    type: 'bar', 
                    barWidth: '40%',
                    name: data.legend[1] || '',
                    data: data.seriesData[1] || [], 
                    // stack:'23',  // 数据堆叠，必须添加相同的stack属性
                }
            ], 
        }
        return option
    },
    defaultBarLine: (params = {}) => { 
        let {title, data, theme} = params
        let option = {
            title: {
                text: title || '',
                // subtext: '纯属虚构',
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    color: textColr
                },
            },
            backgroundColor: 'transparent',
            color: color,
            tooltip: {
                // trigger: 'axis',
                // axisPointer: {
                //     lineStyle: {
                //         type: 'dashed'
                //     }
                // },
                // formatter: tooltipStr,
                // padding: [6, 20],
                // backgroundColor: 'rgba(255,255,255,0.9)',
                // textStyle: {
                //     color: '#4F515D'
                // },
                // extraCssText: 'box-shadow:0px 2px 5px 0px rgba(0, 0, 0, 0.52)'
            },
            legend: {
                icon: "rect", 
                show: true,
                data: ['邮件营销', '联盟广告'],
                itemWidth: 15,
                itemHeight: 8,
                textStyle: {
                    fontSize: 12,
                    // color: '#A4CCFF'
                },
                top: 40,
                selectedMode: true
            },
            
            grid: {
                top: 100,
                left: 24,
                right: 10,
                bottom: 5,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] ,
                axisLabel: {
                    fontSize: 14,
                    color: textColr,
                    interval: 0
                },
                axisTick: {
                    show: true,
                    alignWithLabel: true
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                // name:  "Y轴标题",
                nameTextStyle: {
                    color: textColr
                },
                splitNumber: 4,
                axisLabel: {
                    formatter:  123 ,
                    textStyle: {
                        color: textColr
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: lineColor
                    }
                },
                axisLine: {
                    show: false
                }
            },
            series: [{
                name: '邮件营销',
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'bar'
            },
            {   name: '联盟广告',
                data: [1, 55, 45, 76, 88, 87, 99],
                type: 'line'
            }]
        }
        return option;
    },
    AreaStack: (params = {})=>{
        let option = {
            color,
            title: {
                text: '某站点用户访问来源',
                // subtext: '纯属虚构',
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    color: '#A4CCFF'
                },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
            },
            legend: {
                show: true,
                icon:'rect',
                data: ['邮件营销', '联盟广告'],
                itemWidth: 15,
                itemHeight: 8,
                textStyle: {
                    fontSize: 12,
                    // color: '#A4CCFF'
                },
                top: 40,
                selectedMode: true
            },
            grid: {
                top: 100,
                left: 24,
                right: 10,
                bottom: 5,
                containLabel: true
            },
            
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] ,
                axisLabel: {
                    fontSize: 14,
                    // color: textColr,
                    interval: 0
                },
                axisTick: {
                    show: true,
                    alignWithLabel: true
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                // name:  "Y轴标题",
                nameTextStyle: {
                    // color: "#C4DFFF"
                },
                splitNumber: 4,
                axisLabel: {
                    formatter:  123 ,
                    textStyle: {
                        // color: textColr
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    // lineStyle: {
                    //     type: 'dashed',
                    //     color: lineColor
                    // }
                },
                axisLine: {
                    show: false
                }
            },
            series: [
                {
                    name: '邮件营销',
                    type: 'line',
                    smooth: true,
                    stack: '总量',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '联盟广告',
                    type: 'line',
                    smooth: true,
                    stack: '总量',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [220, 182, 191, 234, 290, 330, 310]
                }
            ]
        };
        return option
    },
    LineSmooth: (params = {})=>{
        let option   = {
            color: color,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                formatter: tooltipStr,
                padding: [6, 20],
                backgroundColor: 'rgba(255,255,255,0.9)',
                textStyle: {
                    color: '#4F515D'
                },
                extraCssText: 'box-shadow:0px 2px 5px 0px rgba(0, 0, 0, 0.52)'
            },
            legend: {
                show: true,
                data:  [1,2,3,5,6,3,5],
                itemWidth: 15,
                itemHeight: 8,
                textStyle: {
                    fontSize: 12,
                    color: '#A4CCFF'
                },
                top: 0,
                selectedMode: false
            },
            grid: {
                top: 30,
                left: 24,
                right: 10,
                bottom: 5,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] ,
                axisLabel: {
                    fontSize: 14,
                    color: textColr,
                    interval: 0
                },
                axisTick: {
                    show: true,
                    alignWithLabel: true
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                name:  "Y轴标题",
                nameTextStyle: {
                    color: "#C4DFFF"
                },
                splitNumber: 4,
                axisLabel: {
                    formatter:  123 ,
                    textStyle: {
                        color: textColr
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: lineColor
                    }
                },
                axisLine: {
                    show: false
                }
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }]
        };
        return option
    }, 
    AreaStackGradient: (params = {})=>{
        let option = {
            color,
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed'
                    },
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }, 
                padding: [6, 20],  
            },
            legend: {
                show: true,
                data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
                itemWidth: 15,
                itemHeight: 8,
                textStyle: {
                    fontSize: 12,
                    color: '#A4CCFF'
                },
                top: 0,
                selectedMode: true
            }, 
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                top: 30,
                left: 24,
                right: 10,
                bottom: 5,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    data:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] ,
                    axisLabel: {
                        fontSize: 14,
                        color: textColr,
                        interval: 0
                    },
                    axisTick: {
                        show: true,
                        alignWithLabel: true
                    },
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name:  "Y轴标题",
                    nameTextStyle: {
                        color: "#C4DFFF"
                    },
                    splitNumber: 4,
                    axisLabel: {
                        formatter:  123 ,
                        textStyle: {
                            color: textColr
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: lineColor
                        }
                    },
                    axisLine: {
                        show: false
                    }
                }
            ],
            series: [
                {
                    name: 'Line 1',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(128, 255, 165)'
                        }, {
                            offset: 1,
                            color: 'rgba(1, 191, 236)'
                        }])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [140, 232, 101, 264, 90, 340, 250]
                },
                {
                    name: 'Line 2',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0, 221, 255)'
                        }, {
                            offset: 1,
                            color: 'rgba(77, 119, 255)'
                        }])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [120, 282, 111, 234, 220, 340, 310]
                },
                {
                    name: 'Line 3',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(55, 162, 255)'
                        }, {
                            offset: 1,
                            color: 'rgba(116, 21, 219)'
                        }])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [320, 132, 201, 334, 190, 130, 220]
                },
                {
                    name: 'Line 4',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(255, 0, 135)'
                        }, {
                            offset: 1,
                            color: 'rgba(135, 0, 157)'
                        }])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [220, 402, 231, 134, 190, 230, 120]
                },
                {
                    name: 'Line 5',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    label: {
                        show: true,
                        position: 'top'
                    },
                    areaStyle: {
                        opacity: 0.8,
                        color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(255, 191, 0)'
                        }, {
                            offset: 1,
                            color: 'rgba(224, 62, 76)'
                        }])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [220, 302, 181, 234, 210, 290, 150]
                }
            ]
        };
        return option
    },
    AreaTranslucence: (params = {}) => {
        let option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                padding: [6, 15],
                backgroundColor: 'rgba(255,255,255,.9)',
                textStyle: {
                    color: '#A4CCFF'
                },
                extraCssText: 'box-shadow:0px 2px 5px 0px rgba(0, 0, 0, 0.52)'
            },
            legend: {
                data:  [1,2,3,5,6,3,5],
                itemWidth: 20,
                itemHeight: 10,
                textStyle: {
                    fontSize: 10,
                    color: '#A4CCFF',
                },
                top: '5%',
                selectedMode: false
            },
            grid: {
                top: '18%',
                left: '8%',
                right: '1%',
                bottom: '8%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                nameLocation: 'center',
                data:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] ,
                axisLabel: {
                    color: '#A4CCFF',
                    interval: 0,
                    rotate: 45
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, .15)'
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: "y轴标题",
                nameRotate: 90,
                nameTextStyle: {
                    color: '#A4CCFF',
                    padding: [0, 0, 120, -50]
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: '#A4CCFF'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            series: [
                {
                    name: '1',
                    type: 'line',
                    color: '#3399FF',
                    smooth: true,
                    areaStyle: {
                        normal: {
                            color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(51,153,255, .3)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(51,153,255, 0)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    symbol: 'none',
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                },
                {
                    name: '2',
                    type: 'line',
                    color: '#FFCC33',
                    smooth: true,
                    areaStyle: {
                        normal: {
                            color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(255,204,51, .3)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(255,204,51, 0)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    symbol: 'none',
                    data:  [100, 185, 199, 212, 14, 178, 190],
                },
                {
                    name: '3',
                    type: 'line',
                    color: '#FF3333',
                    smooth: true,
                    areaStyle: {
                        normal: {
                            color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(255,51,51, .3)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(255,51,51, 0)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    symbol: 'none',
                    data:  [661, 414, 133, 122, 616, 132, 13],
                }
            ]
        }
        return option;
    }, 
    defaultBarHide: (params = {})=>{
        let options  = {
            color,
            tooltip: {},
            series: [{
              name: '用户实时交易量',
              type: 'bar',
              data: [100, 200, 400],
              barWidth: '30%'
            }],
            xAxis: {
              type: 'category',
              data: [1,2,3],
              show: false
            },
            yAxis: {
              show: false
            },
            grid: {
              top: 0,
              left: 0,
              bottom: 0,
              right: 0
            }   
        } 
        return options
    },
    defaultBarTriangle: (params = {})=>{
        let  isPercent= '50%'
        let  xAxisData=[1,2,3,4]
        let  seriesData=[100, 200, 400,200]
        let _color = ['255, 148, 130', '255, 188, 42', '20, 200, 168', '255, 255, 255']
        let option = {
            backgroundColor: "transparent",
            color,
            tooltip: {
                show: false
            },
            legend: {
                show: false
            },
            grid: {
                top: 26,
                left: 10,
                right: 10,
                bottom: 5,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: xAxisData || [],
                axisLabel: {
                    show: true,
                    color: '#A4CCFF',
                    fontSize: 14,
                    interval: 0
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    show: true,
                    formatter: isPercent ? '{value}%' : '{value}',
                    textStyle: {
                        color: '#A4CCFF',
                        fontSize: 14
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: 'rgba(255,255,255,0.1)'
                    }
                },
                axisLine: {
                    show: false
                }
            },
            series: [
                {
                    type: 'pictorialBar',
                    barCategoryGap: 0,
                    symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function (params) {
                            if (params.dataIndex === 0) {
                                return isPercent ? `{first|${params.value}% }` : `{first|${params.value}}`
                            } else if (params.dataIndex === 1) {
                                return isPercent ? `{second|${params.value}%}` : `{second|${params.value}}`
                            } else if (params.dataIndex === 2) {
                                return isPercent ? `{third|${params.value}%}` : `{third|${params.value}}`
                            } else {
                                return isPercent ? `{normal|${params.value}%}` : `{normal|${params.value}}`
                            }
                        },
                        rich: {
                            first: {
                                color: "#FF907E",
                                fontSize: 16
                            },
                            second: {
                                color: "#FFD680",
                                fontSize: 16
                            },
                            third: {
                                color: "#16DCB0",
                                fontSize: 16
                            },
                            normal: {
                                color: "#606266",
                                fontSize: 14
                            }
                        }
                    },
                    itemStyle: {
                        opacity: 1,
                        color: function (params) {
                            if (params.dataIndex === 0) {
                                return new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: `rgba(${_color[0]}, 1)`
                                }, {
                                    offset: 1,
                                    color: `rgba(${_color[0]}, 0)`
                                }], false);
                            } else if (params.dataIndex === 1) {
                                return new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: `rgba(${_color[1]}, 0.8)`
                                }, {
                                    offset: 1,
                                    color: `rgba(${_color[1]}, 0)`
                                }], false);
                            } else if (params.dataIndex === 2) {
                                return new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: `rgba(${_color[2]}, 0.8)`
                                }, {
                                    offset: 1,
                                    color: `rgba(${_color[2]}, 0)`
                                }], false);
                            } else {
                                return new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: `rgba(${_color[3]}, 0.8)`
                                }, {
                                    offset: 1,
                                    color: `rgba(${_color[3]}, 0)`
                                }], false);
                            }
                        },
                    },
                    data: seriesData || []
                }
            ]
        }
        return  option
    },
    defaultBarRadius: (params = {})=>{
        let  isPercent= '50%'
        let  xAxisData=[1,2,3]
        let  seriesData=[100, 200, 400]
        let  legendData = [1,2,3]
        let sData = [];
        seriesData.forEach((el, i) => {
            sData.push(
                {
                    name: legendData[i] || "",
                    type: "bar",
                    barWidth: 8,
                    itemStyle: {
                        normal: {
                            barBorderRadius: [16, 16, 0, 0],
                            color: function (params) {
                                return new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: `rgba(${color[i]}, 1)`
                                }, {
                                    offset: 1,
                                    color: `rgba(${color[i]}, 0)`
                                }], false)
                            }
                        },
                    },
                    label: {
                        show: false
                    },
                    data: el
                }
            )
        })
     
        let option = {
                backgroundColor: 'transparent',
                tooltip: {
                    show: false
                },
                legend: {
                    show: false
                },
                grid: {
                    top: 24,
                    left: 10,
                    right: 10,
                    bottom: 5,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    nameLocation: 'center',
                    data: xAxisData || [],
                    axisLabel: {
                        fontSize: 14,
                        color: textColr,
                        interval: 0
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false,
                    },
                    axisLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    name: "",
                    nameTextStyle: {
                        color: textColr
                    },
                    axisLabel: {
                        formatter: isPercent ? '{value}%' : '{value}',
                        fontSize: 14,
                        textStyle: {
                            color: textColr
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: 'rgba(255,255,255,0.1)'
                        }
                    },
                    axisLine: {
                        show: false
                    }
                },
                cursor: 'default',
                series: [
                    {
                        name: "",
                        type: "bar",
                        barWidth: 8,
                        itemStyle: {
                            barBorderRadius: [16, 16, 0, 0],
                            color: function (params) {
                                if (params.dataIndex === 0) {
                                    return new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(255, 102, 0, 1)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(255, 102, 0, 0)'
                                    }], false)
                                } else if (params.dataIndex === 1) {
                                    return new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(255, 212, 41, 1)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(255, 212, 41, 0)'
                                    }], false)
                                } else if (params.dataIndex === 2) {
                                    return new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(0, 137, 110, 1)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(0, 137, 110, 0)'
                                    }], false)
                                } else {
                                    return new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(66, 185, 255, 1)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(66, 185, 255, 0)'
                                    }], false)
                                }
                            }
                        },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (params) {
                                if (params.dataIndex === 0) {
                                    return `{first|${params.value}${isPercent ? '%' : ''}}`
                                } else if (params.dataIndex === 1) {
                                    return `{second|${params.value}${isPercent ? '%' : ''}}`
                                } else if (params.dataIndex === 2) {
                                    return `{third|${params.value}${isPercent ? '%' : ''}}`
                                } else {
                                    return `{normal|${params.value}${isPercent ? '%' : ''}}`
                                }
                            },
                            rich: {
                                first: {
                                    color: "#FF6F56",
                                    fontSize: 16
                                },
                                second: {
                                    color: "#FFBC29",
                                    fontSize: 16
                                },
                                third: {
                                    color: "#19A589",
                                    fontSize: 16
                                },
                                normal: {
                                    color: "#FFFFFF",
                                    fontSize: 16
                                }
                            }
                        },
                        data: seriesData ? seriesData : []
                    }
                ]
        }
        return  option
    },
    defaultStackBar: ()=>{
        let options = {
            color,
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // Use axis to trigger tooltip
                    type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
                }
            },
            legend: {
                show: true,
                data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
                itemWidth: 15,
                itemHeight: 8,
                textStyle: {
                    fontSize: 12,
                    color: '#A4CCFF'
                },
                top: 0,
                selectedMode: true
            }, 
            grid: {
                top: 30,
                left: 24,
                right: 10,
                bottom: 5,
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: true,
                axisLabel: {
                    fontSize: 14,
                    color: textColr,
                    interval: 0
                },
                axisTick: {
                    show: true,
                    alignWithLabel: true
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
                
            },
            yAxis: {
                type: 'category',
                data: ['1', '2'],
                name:  "Y轴标题",
                nameTextStyle: {
                    color: "#C4DFFF"
                },
                splitNumber: 4,
                axisLabel: {
                    formatter:  123 ,
                    textStyle: {
                        color: textColr
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: lineColor
                    }
                },
                axisLine: {
                    show: false
                }
                
            },
            series: [
                {
                name: 'Direct',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [320, 302, 301, 334]
            },{
                name: 'Mail Ad',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [120, 132, 101, 134]
            },
            {
                name: 'Affiliate Ad',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [220, 182, 191, 234]
            },
            {
                name: 'Video Ad',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [150, 212, 201, 154]
            }
            ]
        };
        return   options
    },
    stackBarRadius: (params = {})=>{
        let  isPercent= '50%'
        let  seriesData=[100, 200, 400]
        let yAxisData = [100,200,300]
    
        let _max = 0, _maxArr = []
            _max = Math.max(...seriesData)
            seriesData.forEach(el => {
                _maxArr.push(_max);
            });
        let option = {
            backgroundColor: 'transparent',
            tooltip: {
                show: false
            },
            legend: {
                show: false
            },
            grid: {
                top: 28,
                left: 0,
                right: 0,
                bottom: 8,
                containLabel: true
            },
            xAxis: {
                type: 'value',
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'category',
                boundaryGap: false,
                data: yAxisData || [],
                inverse: true,
                axisLabel: {
                    show: true,
                    color: textColr,
                    fontSize: 14,
                    inside: true,
                    padding: [-36, 0, 0, -6],
                    lineHeight: 14
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            series: [
                {
                    type: 'bar',
                    zlevel: 1,
                    barWidth: 8,
                    data: seriesData || [],
                    label: {
                        show: false,
                    },
                    itemStyle: {
                        color: function (params) {
                            return new Echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: 'rgba(70, 227, 255, 0)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(70, 227, 255, 0.5)'
                            }, {
                                offset: 1,
                                color: 'rgba(70, 227, 255, 1)'
                            }], false);
                        },
                        barBorderRadius: [0, 30, 30, 0]
                    }
                },
                {
                    type: 'bar',
                    barWidth: 8,
                    barGap: '-100%',
                    data: _maxArr,
                    label: {
                        show: true,
                        position: 'insideTopRight',
                        offset: [0, -26],
                        formatter: function (params) {
                            if (isPercent) {
                                return seriesData[params.dataIndex] + '%' || '0%';
                            } else {
                                return seriesData[params.dataIndex] + '件' || '0件';
                            }
                        },
                        color: textColr,
                        fontSize: 14
                    },
                    itemStyle: {
                        color: 'rgba(66,185,255,0.05)',
                        barBorderRadius: [0, 30, 30, 0]
                    }
                }
            ]
        }
        return  option
    },
    stackBarShap: (params = {})=>{
        let option = {
            grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            },
            xAxis: {
                type: 'value',
                show: false
            },
            yAxis: {
                type: 'category',
                show: false
            },
            series: [{
                name: '上月平台用户数',
                type: 'bar',
                stack: '总量',
                data: [6],
                barWidth: 10,
                itemStyle: {
                color: '#45c946'
                }
            }, {
                name: '今日平台用户数',
                type: 'bar',
                stack: '总量',
                data: [12],
                itemStyle: {
                color: '#eee'
                }
            }, {
                type: 'custom',
                stack: '总量',
                data: [6],
                renderItem: (params, api) => {
                const value = api.value(0)
                const endPoint = api.coord([value, 0])

                return {
                    type: 'group',
                    position: endPoint,
                    children: [{
                    type: 'path',
                    shape: {
                        d: 'M1024 255.996 511.971 767.909 0 255.996 1024 255.996z',
                        x: -5,
                        y: -20,
                        width: 10,
                        height: 10,
                        layout: 'cover'
                    },
                    style: {
                        fill: '#45c946'
                    }
                    }, {
                    type: 'path',
                    shape: {
                        d: 'M0 767.909l512.029-511.913L1024 767.909 0 767.909z',
                        x: -5,
                        y: 10,
                        width: 10,
                        height: 10,
                        layout: 'cover'
                    },
                    style: {
                        fill: '#45c946'
                    }
                    }]
                }
                }
            }]
        }
        return option
    },
    circlePie: (data, isHorizon = false, percent = false) => {
        let color = ['#3399FF', '#FF9933', '#01B394', '#FF3333', '#8033FF', '#FF6D33', '#FFFFFF'];
        let pie = 0;
        data = {
            seriesData :  [
                {value: 10, name: '搜索引擎'},
                {value: 20, name: '直接访问'},
                {value: 30, name: '邮件营销'},
                {value: 5, name: '联盟广告'},
                {value: 15, name: '视频广告'}
            ],
            legendData:  [  
                {value: 1048, name: '搜索引擎'},
                {value: 735, name: '直接访问'},
                {value: 580, name: '邮件营销'},
                {value: 484, name: '联盟广告'},
                {value: 300, name: '视频广告'}
            ]
            
        }
        if (!data || !data.seriesData) {
            return false;
        }
        data.seriesData.forEach(el => {
            pie += el.value;
        });
        let placeHolderStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 0
            }
        };
        let _a = Math.floor(pie * 0.05);
        let _b = Math.floor(pie * 0.03);
        if (pie < 1) {
            _a = 0.017;
            _b = 0.015;
        } else if (1 <= pie < 5) {
            _a = _b = pie * 0.07;
        }
        let sData = [];
        data.seriesData.forEach((el, i) => {
            sData.push({
                value: el.value,
                name: el.name,
                itemStyle: {
                    normal: {
                        borderWidth: 6,
                        borderColor: color[i],
                        label: {
                            show: false,
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }, {
                value: percent ? _a : _b,
                name: '',
                itemStyle: placeHolderStyle
            });
        });
        let option = {
            backgroundColor: 'transparent',
            color: color,
            toolbox: {
                show: false
            },
            tooltip: {
                show: false
            },
            legend: {
                orient: 'vartical',
                height: '85%',
                top: 'middle',
                left: '45%',
                itemWidth: 10,
                itemHeight: 10,
                padding: 20,
                itemGap: isHorizon ? 3 : 15,
                selectedMode: false,
                data: data.legendData ? data.legendData : [],
                formatter: function (name) {
                    let target = 0
                    for (let i = 0, l = sData.length; i < l; i++) {
                        if (sData[i].name === name) {
                            target = sData[i].value;
                        }
                    }
                    if (percent) {
                        return '{target|' + target + '%}\n{name|' + name + '}'
                    } else {
                        return '{target|' + target + '}\n{name|' + name + '}'
                    }
                },
                textStyle: {
                    rich: {
                        target: {
                            color: '#fff',
                            fontSize: 15,
                            padding: [6, 1]
                        },
                        name: {
                            color: '#90A4AE',
                            fontSize: 10
                        }
                    }
                }
            },
            series: [
                {
                    type: 'pie',
                    clockWise: true,
                    radius: ['42%', '43%'],
                    center: ['25%', '50%'],
                    hoverAnimation: false,
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    },
                    data: sData
                }
            ]
        }
        return option;
    },
    defaultSingleColorPie: (data) => {
        data = { 
            seriesData:  [  
                {value: 1048, name: '搜索引擎'}
            ]
            
        }
        let option = {
            backgroundColor: 'transparent',
            toolbox: {
                show: false
            },
            tooltip: {
                show: true
            },
            series: [
                {
                    type: 'gauge',
                    name: '',
                    radius: '70%',
                    min: 0,
                    max: 10,
                    startAngle: 270,
                    endAngle: -89.8,
                    splitNumber: 0,
                    pointer: {
                        show: true,
                        length: '35%',
                        width: 16
                    },
                    itemStyle: {
                        color: 'transparent'
                    },
                    title: {
                        show: true,
                        offsetCenter: [0, '135%'],
                        color: '#fff',
                        fontSize: 14
                    },
                    detail: {
                        formatter: function (value) {
                            return '{val|' + value + '}{dw|件}'
                        },
                        offsetCenter: [0, 0],
                        rich: {
                            val: {
                                color: '#fff',
                                fontSize: 22
                            },
                            dw: {
                                color: '#fff',
                                fontSize: 14
                            }
                        }
                    },
                    data: data.seriesData ? data.seriesData : [],
                    axisLine: {
                        lineStyle: {
                            color: [
                                [
                                    0.5,
                                    new Echarts.graphic.LinearGradient(1, 0, 1, 1, [{
                                            offset: 0,
                                            color: color[0],
                                            opacity: 0.4
                                        },
                                        {
                                            offset: 0.5,
                                            color: color[0],
                                        },
                                        {
                                            offset: 1,
                                            color: color[0],
                                        }
                                    ])
                                ],
                                [
                                    1,
                                    new Echarts.graphic.LinearGradient(1, 0, 1, 1, [{
                                            offset: 0,
                                            color: color[1],
                                            opacity: 0.4
                                        },
                                        {
                                            offset: 1,
                                            color: color[1],
                                            opacity: 1
                                        }
                                    ])
                                ]
                            ],
                            width: 8
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        length: 20,
                        lineStyle: {
                            color: 'rgba(255,255,255,1)',
                            width: 2,
                            type: 'solid',
                        },
                    },
                    axisLabel: {
                        show: false
                    }
                }
            ]
        }
        return option;
    },
    defaultRadar: (data) => {
        data = {
            seriesData :  [
                {
                    value: [4300, 10000, 28000, 35000, 50000, 19000],
                    name: '预算分配（Allocated Budget）'
                },
                {
                    value: [5000, 14000, 28000, 31000, 42000, 21000],
                    name: '实际开销（Actual Spending）'
                }
            ],
            legendData:  ['预算分配（Allocated Budget）', '实际开销（Actual Spending）'],
            indicator  :[ 
                { name: '销售（sales）', max: 6500},
                { name: '管理（Administration）', max: 16000},
                { name: '信息技术（Information Techology）', max: 30000},
                { name: '客服（Customer Support）', max: 38000},
                { name: '研发（Development）', max: 52000},
                { name: '市场（Marketing）', max: 25000}
            ], 
        }
        let sData = [];
        if (data.seriesData) {
            data.seriesData.forEach((el, i) => {
                sData.push(
                    {
                        type: 'radar',
                        name: el.name,
                        symbol: 'circle',
                        symbolSize: 6,
                        areaStyle: {
                            normal: {
                                color: color[i],
                                opacity: 0.2
                            }
                        },
                        label: {
                            show: false
                        },
                        itemStyle: {
                            normal: {
                                color: color[i]
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: color[i],
                                width: 2
                            }
                        },
                        data: [
                            el.value
                        ]
                    }
                )
            });
        }
        console.log({sData})
        let option = {
            color,
            backgroundColor: "transparent",
            tooltip: {
                padding: [6, 15],
                backgroundColor: 'rgba(255,255,255,.9)',
                textStyle: {
                    color: '#4F515D'
                },
                extraCssText: 'box-shadow:0px 2px 5px 0px rgba(0, 0, 0, 0.52)'
            },
            legend: {
                itemWidth: 10,
                itemHeight: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#ADDEF7'
                },
                bottom: '20%',
                selectedMode: false,
                data: data.legendData ? data.legendData : []
            },
            radar: {
                indicator: data.indicator ? data.indicator :  [],
                radius: '60%',
                center: ['50%', '40%'],
                splitNumber: 4,
                silent: true,
                name: {
                    show: true
                },
                nameGap: 4,
                axisLabel: {
                    show: false
                },
                splitArea: {
                    areaStyle: {
                        color: ['transparent']
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(173,222,247,.25)',
                        width: 1
                    }
                },
                axisLine: {
                    show: false
                }
            },
            series: {
                name: '预算 vs 开销（Budget vs spending）',
                type: 'radar',
                areaStyle: {normal: {}},
                data:data.seriesData
                //  [
                //     {
                //         value: [4300, 10000, 28000, 35000, 50000, 19000],
                //         name: '预算分配（Allocated Budget）',
                //         symbol: 'circle',
                //         type: 'radar', 
                //         symbolSize: 6,
                //         areaStyle: {
                //             normal: {
                //                 color: color[i],
                //                 opacity: 0.2
                //             }
                //         },
                //         label: {
                //             show: false
                //         },
                //         itemStyle: {
                //             normal: {
                //                 color: color[i]
                //             }
                //         },
                //         lineStyle: {
                //             normal: {
                //                 color: color[i],
                //                 width: 2
                //             }
                //         },
                //     },
                //     {
                //         value: [5000, 14000, 28000, 31000, 42000, 21000],
                //         name: '实际开销（Actual Spending）',
                //         symbol: 'circle',
                //         type: 'radar',
                //         symbolSize: 6,
                //         areaStyle: {
                //             normal: {
                //                 color: color[i],
                //                 opacity: 0.2
                //             }
                //         },
                //         label: {
                //             show: false
                //         },
                //         itemStyle: {
                //             normal: {
                //                 color: color[i]
                //             }
                //         },
                //         lineStyle: {
                //             normal: {
                //                 color: color[i],
                //                 width: 2
                //             }
                //         },
                //     }
                // ]
            }
        }
        return option;
    },
    defaultGraph: (data) => {
        data =  [
                {value: 100, name: '搜索引擎',percent:10},
                {value: 120, name: '直接访问',percent:10},
                {value: 310, name: '邮件营销',percent:10},
                {value: 555, name: '联盟广告',percent:10},
                {value: 125, name: '视频广告',percent:10} 
        ]
        let nodes = [];
        let links = [];
        if (data && data.length > 0) {
            data.forEach((el, i) => {
                if(el.name !== ""){
                    nodes.push({
                        name: el.name,
                        percent: el.percent,
                        itemStyle: {
                            normal: {
                                color: color[i]
                            }
                        }
                    });
                    links.push({
                        source: 'root',
                        target: el.name
                    });
                }
            })
            nodes.unshift({
                name: 'root',
                symbolSize: 50,
                symbol: RootImg
            });
        } else {
            return false;
        }
        let option = {
            backgroundColor: "transparent",
            tooltip: {
                show: false
            },
            legend: {
                show: false
            },
            color: color,
            animationDuration: 1000,
            animationEasingUpdate: 'quinticInOut',
            series: [{
                type: 'graph',
                layout: 'force',
                force: {
                    repulsion: 120,
                    gravity: 0,
                    edgeLength: 65,
                    layoutAnimation: false,
                },
                legendHoverLink: false,
                hoverAnimation: false,
                roam: false,
                symbolSize: 50,
                symbolOffset: [0,0],
                lineStyle: {
                    color: 'rgba(255,255,255,.5)',
                    type: 'dashed'
                },
                data: nodes,
                links: links,
                label: {
                    normal: {
                        show: true,
                        formatter: function (params) {
                            if (params.name !== 'root') {
                                return '{title|' + params.data.name + '}\n' + '{p|' + params.data.percent + '}'
                            } else {
                                return ''
                            }
                        },
                        rich: {
                            title: {
                                color: '#fff',
                                fontSize: 13,
                                align: 'center',
                                padding: [3, 0, 0, 0],
                                opacity: 1
                            },
                            p: {
                                color: 'rgba(255,255,255,.8)',
                                fontSize: 12,
                                align: 'center',
                                opacity: 1
                            }
                        }
                    }
                },
                left: 'center',
                right: 'center',
                top: 'center',
                bottom: 'center',
            }]
        }
        return option;
    }, 
    pieCustom:()=>{
        let options  = {
            color,
            title: {
                text: 'Customized Pie',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#ccc'
                }
            }, 
            tooltip: {
                trigger: 'item'
            }, 
            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [
                        {value: 335, name: '直接访问'},
                        {value: 310, name: '邮件营销'},
                        {value: 274, name: '联盟广告'},
                        {value: 235, name: '视频广告'},
                        {value: 400, name: '搜索引擎'}
                    ].sort(function (a, b) { return a.value - b.value; }),
                    roseType: 'radius',
                    label: {
                        // color: 'rgba(255, 255, 255, 0.3)'
                    },
                    labelLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    },
                    itemStyle: {
                        color: color[0],
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
      
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        };
        return options
    },
    pieDoughnut:()=>{
        let options  = {
            color,
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {value: 1048, name: '搜索引擎'},
                        {value: 735, name: '直接访问'},
                        {value: 580, name: '邮件营销'},
                        {value: 484, name: '联盟广告'},
                        {value: 300, name: '视频广告'}
                    ]
                }
            ]
        };
        return options
    },
    pieRound:()=>{
        let options  =  {
            color,
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {value: 1048, name: '搜索引擎'},
                        {value: 735, name: '直接访问'},
                        {value: 580, name: '邮件营销'},
                        {value: 484, name: '联盟广告'},
                        {value: 300, name: '视频广告'}
                    ]
                }
            ]
        };
        return options
    },
    defaultFunnel:()=>{
        let options  = {
            color,
            title: {
                text: '漏斗图',
                subtext: '纯属虚构'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                feature: {
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },
            legend: {
                data: ['展现','点击','访问','咨询','订单']
            }, 
            series: [
                {
                    name:'漏斗图',
                    type:'funnel',
                    left: '10%',
                    top: 60,
                    //x2: 80,
                    bottom: 60,
                    width: '80%',
                    // height: {totalHeight} - y - y2,
                    min: 0,
                    max: 100,
                    minSize: '0%',
                    maxSize: '100%',
                    sort: 'descending',
                    gap: 2,
                    label: {
                        show: true,
                        position: 'inside'
                    },
                    labelLine: {
                        length: 10,
                        lineStyle: {
                            width: 1,
                            type: 'solid'
                        }
                    },
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 1
                    },
                    emphasis: {
                        label: {
                            fontSize: 20
                        }
                    },
                    data: [
                        {value: 60, name: '访问'},
                        {value: 40, name: '咨询'},
                        {value: 20, name: '订单'},
                        {value: 80, name: '点击'},
                        {value: 100, name: '展现'}
                    ]
                }
            ]
        };
        return options
    } ,  
    defaultScatterSimple:()=>{
        let options  = {
            color,
            // tooltip: {
            //     trigger: 'axis',
            //     axisPointer: {
            //         lineStyle: {
            //             type: 'dashed'
            //         }
            //     },
            //     formatter: tooltipStr,
            //     padding: [6, 20],
            //     backgroundColor: 'rgba(255,255,255,0.9)',
            //     textStyle: {
            //         color: '#4F515D'
            //     },
            //     extraCssText: 'box-shadow:0px 2px 5px 0px rgba(0, 0, 0, 0.52)'
            // },
            // legend: {
            //     show: true,
            //     // data:  [1,2,3,5,6,3,5],
            //     itemWidth: 15,
            //     itemHeight: 8,
            //     textStyle: {
            //         fontSize: 12,
            //         color: '#A4CCFF'
            //     },
            //     top: 0,
            //     selectedMode: false
            // },
            grid: {
                top: 30,
                left: 24,
                right: 10,
                bottom: 5,
                containLabel: true
            },
            xAxis: {
                // type: 'category',
                // boundaryGap: true,
                // data:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] ,
                axisLabel: {
                    fontSize: 14,
                    color: textColr,
                    interval: 0
                },
                axisTick: {
                    show: true,
                    alignWithLabel: true
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                name:  "Y轴标题",
                nameTextStyle: {
                    color: "#C4DFFF"
                },
                splitNumber: 4,
                axisLabel: {
                    formatter:  123 ,
                    textStyle: {
                        color: textColr
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: lineColor
                    }
                },
                axisLine: {
                    show: false
                }
            },
            series: [{
                symbolSize: 20,
                data: [
                    [10.0, 8.04],
                    [8.07, 6.95],
                    [13.0, 7.58],
                    [9.05, 8.81],
                    [11.0, 8.33],
                    [14.0, 7.66],
                    [13.4, 6.81],
                    [10.0, 6.33],
                    [14.0, 8.96],
                    [12.5, 6.82],
                    [9.15, 7.20],
                    [11.5, 7.20],
                    [3.03, 4.23],
                    [12.2, 7.83],
                    [2.02, 4.47],
                    [1.05, 3.33],
                    [4.05, 4.96],
                    [6.03, 7.24],
                    [12.0, 6.26],
                    [12.0, 8.84],
                    [7.08, 5.82],
                    [5.02, 5.68]
                ],
                type: 'scatter'
            }]
        };
        return options
    },
    gauge: (data) => {
        data = {
            text: '',
            subText: '一审服判息诉率',
            value: 98,
            color: '#0066FF',
            fontSize: '14px'
        } 
        let option = {
            backgroundColor: 'transparent',
            title: {
                text: data.text,
                textStyle: {
                    color: '#FFFFFF',
                    fontSize: 15,
                    lineHeight: 16,
                },
                subtext: data.subText,
                subtextStyle: {
                    fontSize: 10,
                    color: '#90A4AE',
                    lineHeight: 10,
                },
                left: 'center',
                top: '64%',
            },
            tooltip: {
                trigger: "item"
            },
            series: [{
                    type: "gauge",
                    radius: "60%",
                    center: ['50%', '35%'],
                    startAngle: 0,
                    endAngle: 359.9,
                    splitNumber: 40,
                    hoverAnimation: true,
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        length: 19,
                        lineStyle: {
                            width: 4,
                            color: "#030829"
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    pointer: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            opacity: 0
                        }
                    },
                    detail: {
                        show: false
                    },
                    data: []
                },
                {
                    type: "pie",
                    radius: ["50%", "60%"],
                    center: ['50%', '35%'],
                    silent: true,
                    clockwise: true,
                    startAngle: 90,
                    z: 0,
                    zlevel: 0,
                    label: {
                        normal: {
                            position: "center"
                        }
                    },
                    data: [{
                            value: data.value,
                            label: {
                                normal: {
                                    formatter: function(param) {
                                        return param.data.value + '%'
                                    },
                                    fontSize: 18,
                                    color: '#fff'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: data.color
                                }
                            }
                        },
                        {
                            value: 100 - data.value,
                            name: "",
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: "#565E7D"
                                }
                            }
                        }
                    ]
                },
                {
                    type: "pie",
                    radius: ["43%", "45%"],
                    center: ['50%', '35%'],
                    silent: true,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    z: 1,
                    zlevel: 0,
                    data: [{
                        value: 0,
                        name: "",
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: "#293052"
                            }
                        }
                    }]
                }
            ]
        }
        return option;
    },  
    scatter: (data) => {
        data =  [{
            name: '婚姻纠纷',
            value: 35
        }, {
            name: '劳动合同',
            value: 24
        }, {
            name: '劳动诉讼',
            value: 23
        }, {
            name: '刑事诉讼',
            value: 12
        }, {
            name: '交通纠纷',
            value: 9
        }]
        let sData = [];
        let dataLocation = [{
                offset: [52, 68],
                symbolSize: 90,
                color: 'rgba(1,179,148, .3)'
            },
            {
                offset: [20, 43],
                symbolSize: 75,
                color: 'rgba(51,153,255, .3)'
            },
            {
                offset: [89, 30],
                symbolSize: 70,
                color: 'rgba(255,204,51, .3)'
            },
            {
                offset: [64, 20],
                symbolSize: 50,
                color: 'rgba(255,51,51, .3)'
            },
            {
                offset: [80, 82],
                symbolSize: 40,
                color: 'rgba(255,102,204, .3)'
            }
        ];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let itemToStyle = dataLocation[i];
            let size = 17 - i * 2;
            sData.push({
                name: item.value + '%' + '\n' + item.name,
                value: itemToStyle.offset,
                symbolSize: itemToStyle.symbolSize,
                label: {
                    normal: {
                        textStyle: {
                            fontSize: size,
                            color: '#fff'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: itemToStyle.color
                    }
                },
            })
        }
        let option = {
            grid: {
                show: false,
                top: '12%',
                left: '5%',
                right: '5%',
                bottom: '12%'
            },
            xAxis: [{
                show: false,
                gridIndex: 0,
                type: 'value',
                min: 0,
                max: 100,
                nameLocation: 'middle',
                nameGap: 5
            }],
            yAxis: [{
                show: false,
                gridIndex: 0,
                min: 0,
                max: 100,
                nameLocation: 'middle',
                nameGap: 30
            }],
            series: [{
                type: 'scatter',
                symbol: 'circle',
                label: {
                    normal: {
                        show: true,
                        formatter: '{b}',
                        color: '#fff'
                    },
                },
                data: sData
            }]
        }
        return option;
    }, 
    barGroup: (data) => {
        data = {
            legendData: ['旧存', '新收', '结案', '未结'],
            xAxisData: ['刑事', '民事', '行政', '执行'],
            barGroupChartData: [
                [3, 6, 1, 5],
                [4, 12, 4, 12],
                [3, 11, 3, 11],
                [2, 10, 2, 9]
            ],
        }
        let option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderWidth: '1',
                borderColor: 'gray',
                textStyle: {
                    color: '#10021C'
                },
                extraCssText: 'box-shadow:0px 1px 2px 0px rgba(16,2,28,0.25);'
            },
            legend: {
                data: data.legendData,
                itemWidth: 10,
                itemHeight: 10,
                textStyle: {
                    fontSize: 10,
                    color: 'rgba(255,255,255, .5)'
                },
                top: '12%'
            },
            grid: {
                top: '30%',
                left: '8%',
                right: '8%',
                bottom: '20%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                nameLocation: 'center',
                data: data.xAxisData,
                axisLabel: {
                    color: 'rgba(255,255,255, .5)'
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(40, 44, 71)'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}万',
                    textStyle: {
                        color: 'rgba(255,255,255, .5)'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            series: [{
                    name: data.legendData[0] ? data.legendData[0] : '',
                    type: 'bar',
                    barWidth: '10%',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal: {
                            color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#ffffff'
                            }, {
                                offset: 1,
                                color: '#FF3333'
                            }], false),
                            barBorderRadius: [10, 10, 0, 0],
                            label: {
                                show: false
                            }
                        }
                    },
                    data: data.seriesData[0] ? data.seriesData[0] : [],
                },
                {
                    name: data.legendData[1] ? data.legendData[1] : '',
                    type: 'bar',
                    barWidth: '10%',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal: {
                            color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#ffffff'
                            }, {
                                offset: 1,
                                color: '#FF9933'
                            }], false),
                            barBorderRadius: [10, 10, 0, 0],
                            label: {
                                show: false
                            }
                        }
                    },
                    data: data.seriesData[1] ? data.seriesData[1] : [],
                },
                {
                    name: data.legendData[2] ? data.legendData[2] : '',
                    type: 'bar',
                    barWidth: '10%',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal: {
                            color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#ffffff'
                            }, {
                                offset: 1,
                                color: '#00CC99'
                            }], false),
                            barBorderRadius: [10, 10, 0, 0],
                            label: {
                                show: false
                            }
                        }
                    },
                    data: data.seriesData[2] ? data.seriesData[2] : [],
                },
                {
                    name: data.legendData[3] ? data.legendData[3] : '',
                    type: 'bar',
                    barWidth: '10%',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal: {
                            color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#ffffff'
                            }, {
                                offset: 1,
                                color: '#3399FF'
                            }], false),
                            barBorderRadius: [10, 10, 0, 0],
                            label: {
                                show: false
                            }
                        }
                    },
                    data: data.seriesData[3] ? data.seriesData[3] : [],
                }
            ]
        }
        return option;
    },
    barDataset :(data)=>{
        let option = {
            color,
            legend: {},
            tooltip: {},
            dataset: {
                dimensions: ['product', '2015', '2016', '2017'],
                source: [
                    {product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7},
                    {product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1},
                    {product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5},
                    {product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1}
                ]
            },
            xAxis: {type: 'category'},
            yAxis: {},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
                {type: 'bar'},
                {type: 'bar'},
                {type: 'bar'}
            ]
        };
        return option
    }, 
}
export default chartOptions
