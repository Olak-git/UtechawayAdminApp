import { createSlice } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        data: {}
    },
    reducers: {
        setAdmin: (state, action) => {
            // Object.assign(state.data, action.payload);
            for(let index in action.payload) {
                state.data[index] = action.payload[index];
            }
        },
        deleteIndex: (state, action) => {
            delete(state.data[action.payload]);
        },
        deleteAdmin: (state) => {
            state.data = {};
        }
    }
})

export default adminSlice.reducer;
export const { setAdmin, deleteIndex, deleteAdmin } = adminSlice.actions