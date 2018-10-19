let orderStatus = new Map()
// 待付款，未申请
orderStatus.set('0', {
    payType: '未付款'
})
orderStatus.set('1', {
    payType: '已付款'
})
orderStatus.set('2', {
    payType: '部分发货'
})
orderStatus.set('3', {
    payType: '全部发货'
})
orderStatus.set('4', {
    payType: '已完成'
})
orderStatus.set('5', {
    payType: '已取消'
})
orderStatus.set('6', {
    payType: '退款'
})
export default {
    orderStatus
}
