import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')
            if (token) headers.set('x-auth', token)
            return headers
        },
    }),
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: () => 'api/orders',
            providesTags: ['Order'],
        }),
        getOrder: builder.query({
            query: (id) => `api/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),
        createOrder: builder.mutation({
            query: (order) => ({
                url: 'api/orders',
                method: 'POST',
                body: order,
            }),
            invalidatesTags: ['Order'],
        }),
        updateOrder: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `orders/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }, 'Order'],
        }),
        deleteOrder: builder.mutation({
            query: (id) => ({
                url: `orders/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Order'],
        }),
    }),
})

export const {
    useGetOrdersQuery,
    useGetOrderQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
} = ordersApi
