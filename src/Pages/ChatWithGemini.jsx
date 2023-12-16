import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessages, setMessages } from "../store/chatSlice";
import { Input } from "@chakra-ui/react";
import { InputGroup, Box, InputRightElement, Button } from "@chakra-ui/react"
import { motion } from 'framer-motion'
import { Text } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'

const ChatWithGemini = () => {

    const messages = useSelector(state => state.chat.messages)

    const [input, setInput] = useState('');
    const dispatch = useDispatch()

    const handleSend = () => {
        dispatch(setMessages({
            "role": "user",
            "parts": [
                {
                    "text": input
                }
            ]
        }))
        dispatch(sendMessages({ message: input, history: messages }))
        setInput('')
    }

    return (
        <Box className="w-[80%] max-w-[1200px] p-2">
            <Box className="overflow-y-auto  mb-4 w-full flex flex-col p-10">
                {messages.map((message, index) => <RenderMessage key={index} messageLength={messages.length} message={message} msgIndex={index} />)}
            </Box>
            <Box className="flex p-6">
                <InputGroup size="md">
                    <Input placeholder="Type a message" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleSend}>
                            Send
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </Box>
        </Box>
    );
};

const RenderMessage = ({ message, msgIndex, messageLength }) => {

    const { parts, role } = message

    const Loader = () => {
        const loading = useSelector(state => state.chat.loading)
        if (msgIndex === messageLength - 1) {
            return loading && <Box className="flex self-start pt-2 ">
                <Box bgColor={'blue.500'} className="dot" />
                <Box bgColor={'blue.500'} className="dot" />
                <Box bgColor={'blue.500'} className="dot" />
            </Box>
        }
    }

    return (
        parts.map((part, index) =>
            <>
                <Box
                    as={motion.div}
                    className={`flex overflow-auto max-w-[80%] w-fit items-end my-2 p-1 px-2 rounded-md ${role === 'user' ? 'self-end' : 'self-start'}`}
                    bgColor={role === 'user' ? 'blue.500' : 'gray.200'}
                    textColor={role === 'user' ? 'white' : 'black'}
                    initial={{ opacity: 0, scale: 0.5, y: 20, x: role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    key={index}
                >
                    <ReactMarkdown
                        className="text-sm"
                        key={index}
                        components={{
                            p: ({ node, ...props }) => <Text {...props} className="text-sm" />,
                            code: ({ node, ...props }) => <pre
                                {...props}
                                className="text-sm font-mono text-white bg-slate-800 rounded-md p-2 overflow-auto m-2 max-w-[80%] w-fit"
                            />
                        }}
                    >
                        {part.text}
                    </ReactMarkdown>
                </Box>
                <Loader />
            </>
        ))

}

export default ChatWithGemini;