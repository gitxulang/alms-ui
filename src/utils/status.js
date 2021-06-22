export function intTChinese(status) {
    if (status == null || status == "") return "";
    if (status === 0) {
        return "失败"
    } else if (status === 1) {
        return "成功"
    } else if (status === 2) {
        return "运行中"
    }else{
        return "未知"
    }
}

export function wordTChinese(status) {
    if (status == null || status == "") return "";
    if (status === 'SUCCEEDED') {
        return "成功"
    } else if (status === 'FAILED') {
        return "失败"
    } else if (status === 'RUNNING') {
        return "运行中"
    }else{
        return "未知"
    }
}
