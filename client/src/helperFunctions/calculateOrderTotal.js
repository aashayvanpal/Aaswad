// Working total code
// orders = [
//     {
//         "items": [
//             {
//                 "category": [
//                     "all",
//                     "sweets"
//                 ],
//                 "_id": "5fa64625f7b3770e064ec791",
//                 "name": "Karanji",
//                 "price": 40,
//                 "imgUrl": "Karanji.jpg",
//                 "display": true,
//                 "__v": 0,
//                 "measured": "pc",
//                 "isSelected": true,
//                 "quantity": 2
//             },
//             {
//                 "category": [
//                     "all",
//                     "snacks",
//                     "dinner",
//                     "lunch"
//                 ],
//                 "_id": "5fcbd608b9349432c792b71f",
//                 "name": "Matar Karanji",
//                 "price": 50,
//                 "measured": "plate",
//                 "imgUrl": "Matar Karanji image",
//                 "display": true,
//                 "__v": 0,
//                 "isSelected": true,
//                 "quantity": 2
//             }
//         ],
//         "customer": {
//             "fullName": "Aashay Vanpal test",
//             "phoneNumber": 9743419673,
//             "email": "aashay.vanpal@gmail.com",
//             "address": "#34, SOUNDARYA 1st Main, 4th Cross GMR Layout, Geddalahalli, Sanjaynagar, Bangalore",
//             "queries": "",
//             "eventName": "",
//             "numberOfPeople": "1",
//             "eventDate": "2023-09-07T11:11:00.000Z",
//             "eventTime": "16:41",
//             "homeDelivery": true,
//             "service": true,
//             "customer_id": "5f5dec1c7eef4a2e47018f6e"
//         },
//         "status": "approve",
//         "orderId": "719eac1728d24490945cd602",
//         "isSelected": true
//     },
//     {
//         "items": [
//             {
//                 "category": [
//                     "all",
//                     "sweets"
//                 ],
//                 "_id": "5fa64625f7b3770e064ec791",
//                 "name": "Karanji",
//                 "price": "100",
//                 "imgUrl": "Karanji.jpg",
//                 "display": true,
//                 "__v": 0,
//                 "measured": "pc",
//                 "isSelected": true,
//                 "quantity": 3
//             },
//             {
//                 "category": [
//                     "all",
//                     "snacks",
//                     "dinner",
//                     "lunch"
//                 ],
//                 "_id": "5fcbd608b9349432c792b71f",
//                 "name": "Matar Karanji",
//                 "price": "100",
//                 "measured": "plate",
//                 "imgUrl": "Matar Karanji image",
//                 "display": true,
//                 "__v": 0,
//                 "isSelected": true,
//                 "quantity": 3
//             }
//         ],
//         "customer": {
//             "fullName": "Aashay Vanpal test",
//             "phoneNumber": 9743419673,
//             "email": "aashay.vanpal@gmail.com",
//             "address": "#34, SOUNDARYA 1st Main, 4th Cross GMR Layout, Geddalahalli, Sanjaynagar, Bangalore",
//             "queries": "",
//             "eventName": "",
//             "numberOfPeople": "1",
//             "eventDate": "2023-09-07T11:11:00.000Z",
//             "eventTime": "16:41",
//             "homeDelivery": true,
//             "service": true,
//             "customer_id": "5f5dec1c7eef4a2e47018f6e"
//         },
//         "status": "approve",
//         "orderId": "c1995dbf5e9948d3a8afb1f3",
//         "isSelected": true
//     },
//     {
//         "items": [
//             {
//                 "category": [
//                     "all",
//                     "lunch",
//                     "dinner"
//                 ],
//                 "_id": "5f1a6e720bb9761000e7b8a6",
//                 "name": "Cucumber koshimbir (lemon)",
//                 "price": 25,
//                 "imgUrl": "Cucumber-koshimbir.jpeg",
//                 "display": true,
//                 "__v": 0,
//                 "measured": "plate",
//                 "isSelected": true,
//                 "quantity": 3
//             },
//             {
//                 "category": [
//                     "all",
//                     "lunch",
//                     "dinner"
//                 ],
//                 "_id": "5fcbd4f2b9349432c792b719",
//                 "name": "Kata chi aamti",
//                 "price": 45,
//                 "measured": "plate",
//                 "imgUrl": "kata chi aamti image",
//                 "display": true,
//                 "__v": 0,
//                 "isSelected": true,
//                 "quantity": 3
//             }
//         ],
//         "customer": {
//             "fullName": "Aashay Vanpal",
//             "phoneNumber": 9743419673,
//             "email": "aashay.vanpal@gmail.com",
//             "address": "#34, SOUNDARYA 1st Main, 4th Cross GMR Layout, Geddalahalli, Sanjaynagar, Bangalore",
//             "queries": "",
//             "eventName": "",
//             "numberOfPeople": 1,
//             "eventDate": "2023-09-08T15:42:11.008Z",
//             "eventTime": "21:12",
//             "homeDelivery": false,
//             "service": false,
//             "customer_id": "5f5dec1c7eef4a2e47018f6e"
//         },
//         "status": "approve",
//         "orderId": "a00a7597a8d748599f5f7157",
//         "isSelected": true
//     }
// ]

// console.log("Orders:" , orders)

var globalArr = []



function getResult(items) {
    // console.log('items', items)
    const names = items.map(function (item) {
        return { id: item._id, name: item.name, quantity: item.quantity, measured: item.measured }
    })
    console.log("names:", names)
    console.log("---------")
    // console.log("matching elements")
    const matchingFilters = names.filter(name => {
        return globalArr.some(obj => obj.id == name.id)
    })
    console.log("matchingFilters", matchingFilters)
    console.log("---------")

    const mergeArray = (first, second) => {
        return [...first, ...second].reduce((acc, val, i, arr) => {
            const { id, quantity, name, measured } = val;
            const ind = acc.findIndex(el => el.id === id);
            if (ind !== -1) {
                acc[ind].quantity = Number(acc[ind].quantity) + Number(quantity);
            } else {
                acc.push({
                    id, quantity, name, measured
                });
            }
            return acc;
        }, []);
    }

    // SummedMatched = mergeArray(globalArr, matchingFilters)
    // console.log('final:', SummedMatched)




    const nonFilters = names.filter(name => {
        return globalArr.every(obj => obj.id !== name.id)
    })
    console.log("nonFilters:", nonFilters)
    console.log("------------")

    // appending all nonFilters values
    nonFilters.forEach(element => {
        globalArr.push(element)
    });
    // console.log("globag:", globalArr)
    let SummedMatched = mergeArray(globalArr, matchingFilters)
    // console.log('final:', SummedMatched)
    globalArr = SummedMatched

    console.log('==========================')
    let print = globalArr.map(item => console.log(`${item.id} ${item.name} -> ${item.quantity} ${item.measured}`))
    const desiredResult = globalArr.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        measured: item.measured
    }))
    console.log(desiredResult)
    console.log('==========================')

    // // utility function to sum to object values (without the id)
    // const sumItem = ({ id, ...a }, b) => ({
    //     id,
    //     ...Object.keys(a)
    //         .reduce((r, k) => ({ ...r, [k]: a[k] + b[k] }), {})
    // });

    // const sumObjectsByKey = (...arrs) => [...
    //     [].concat(...arrs) // combine the arrays
    //         .reduce((m, o) => // retuce the combined arrays to a Map
    //             m.set(o.id, // if add the item to the Map
    //                 m.has(o.id) ? sumItem(m.get(o.id), o) : { ...o } // if the item exists in Map, sum the current item with the one in the Map. If not, add a clone of the current item to the Map
    //             )
    //             , new Map).values()]



    // const result = sumObjectsByKey(items, globalArr)

    // console.log('desired result :',result)


    return desiredResult


}


const calculateOrderTotal = (orders) => {
    const All = orders.map(order => getResult(order.items))
    // console.log("Orders:" , orders)
    console.log("Length of orders:", orders.length)
    console.log("All:", All)
    return All.slice(-1)[0] //accessing last array element and returning first index value
}
export default calculateOrderTotal