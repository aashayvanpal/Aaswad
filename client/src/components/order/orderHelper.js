// if the multi-orders have empty array , remove the property
export const reduceOrders = (order) => {
    order.forEach(orderObj => {
        for (let obj in orderObj) {
            // console.log(orderObj[obj])
            for (let mealType in orderObj[obj]) {
                // console.log(orderObj[obj][mealType].items.length)
                if (orderObj[obj][mealType].items.length === 0) {
                    delete orderObj[obj][mealType]
                }
            }
        }
    })
}