import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import GeminiService from '../service/gemini.service';

const initialState = {
    messages: [],
    loading: false,
}

export const sendMessages = createAsyncThunk(
    'chat/sendMessages',
    async (payload) => {
        try {
            console.log("message", payload)
            const response = GeminiService.sendMessages(payload.message, payload.history);
            return response;

        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
)

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.messages.push(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
    }
})

export const { setMessages } = chatSlice.actions

export default chatSlice.reducer