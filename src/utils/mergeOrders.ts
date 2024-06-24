export const mergeOrders = (orderMap: Map<number, number>, newOrders: OrderType[]) => {
  newOrders.forEach((order) => {
    if (Number(order[1]) > 0) {
      orderMap.set(Number(order[0]), Number(order[1]))
    } else {
      orderMap.delete(Number(order[0]))
    }
  })
}