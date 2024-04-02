import { createSlice } from "@reduxjs/toolkit";

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: {
        data: {}
    },
    reducers: {
        setMessages: (state, action) => {
            let key = Object.keys(action.payload)[0];
            if(Object.keys(state.data).indexOf(key) == -1) {
                Object.assign(state.data, action.payload);
            } else {
                state.data[key] = action.payload[key];
                // Object.assign(state.data[key], action.payload[key]);
            }
            // state.data = action.payload
        },
        addMessages: (state, action) => {
            let key = Object.keys(action.payload)[0];
            if(Object.keys(state.data).indexOf(key) == -1) {
                Object.assign(state.data, action.payload);
            } else {
                state.data[key] = action.payload[key].concat(state.data[key]);
            }
            // state.data = action.payload.concat(state.data)
        },
        addMessage: (state, action) => {
            state.data.unshift(action.payload)
            // state.data.push(action.payload)
        },
        clearDiscuss: (state, action) => {
            if(Object.keys(state.data).indexOf(action.payload) !== -1)
                delete(state.data[action.payload]);
        },
        clearFullMessages: (state) => {
            state.data = {};
        }
    }
})

export default messagesSlice.reducer;
export const { setMessages, addMessages, addMessage, clearDiscuss, clearFullMessages } = messagesSlice.actions