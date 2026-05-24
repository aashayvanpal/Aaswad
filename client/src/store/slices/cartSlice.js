import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],          // { _id, name, price, quantity, ...other item fields }
        editingOrder: null, // full order object when editing an existing order
    },
    reducers: {
        addItem(state, action) {
            const exists = state.items.find(i => i._id === action.payload._id)
            if (!exists) {
                state.items.push({ ...action.payload, quantity: 1 })
            }
        },
        removeItem(state, action) {
            state.items = state.items.filter(i => i._id !== action.payload)
        },
        updateQty(state, action) {
            const { id, qty } = action.payload
            const item = state.items.find(i => i._id === id)
            if (item) item.quantity = Number(qty)
        },
        updatePrice(state, action) {
            const { id, price } = action.payload
            const item = state.items.find(i => i._id === id)
            if (item) item.price = price
        },
        setBulkQty(state, action) {
            const qty = Number(action.payload)
            if (qty > 0) {
                state.items = state.items.map(i => ({ ...i, quantity: qty }))
            }
        },
        clearCart(state) {
            state.items = []
            state.editingOrder = null
        },
        setEditingOrder(state, action) {
            state.editingOrder = action.payload
            if (action.payload?.items) {
                state.items = action.payload.items.map(i => ({ ...i, quantity: i.quantity || 1 }))
            }
        },
    },
})

export const {
    addItem,
    removeItem,
    updateQty,
    updatePrice,
    setBulkQty,
    clearCart,
    setEditingOrder,
} = cartSlice.actions

export default cartSlice.reducer
