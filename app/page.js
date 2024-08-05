'use client';
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello there! *warm purrs* It is so lovely to meet you! I am Cat Chat, your friendly and knowledgeable companion dedicated to helping you with all your feline-related questions and concerns. How can I assist you today?'
    }
  ]);

  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null); // Ref for the end of the messages container

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = { role: 'user', content: message };
      setMessages([...messages, newMessage]);
      setMessage('');

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: [...messages, newMessage] }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let updatedMessage = '';
        const messageId = Date.now(); 
        
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'assistant', content: updatedMessage, id: messageId },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          updatedMessage += decoder.decode(value, { stream: true });
          
          setMessages((prevMessages) => 
            prevMessages.map((msg) =>
              msg.id === messageId ? { ...msg, content: updatedMessage } : msg
            )
          );
        }

        setMessages((prevMessages) => 
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, content: updatedMessage } : msg
          )
        );

      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the messages container
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: 'url(/pinkcatbackground-transformed.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: { xs: 1, sm: 2 },
      }}
    >
      <Box
        sx={{
          display: 'inline-block',
          padding: { xs: '4px 6px', sm: '5px 9px' },
          border: '3px solid black',
          borderRadius: '12px',
          bgcolor: '#f7eaf2',
          position: 'absolute',
          zIndex: 2,
          top: '4%', // Use percentage for vertical positioning
          left: '50%', // Center horizontally
          transform: 'translate(-50%, 0)', // Centering effect
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          mb={1}
          sx={{
            fontFamily: "'Roboto'",
            color: 'black',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
            fontSize: { xs: '2.5rem', sm: '3rem' },
          }}
        >
          The Cat Chat
        </Typography>
      </Box>
      <Box sx={{ zIndex: 2, width: '100%', maxWidth: '500px' }}>
        <Stack
          direction={'column'}
          width="100%"
          height={{ xs: 'auto', sm: '700px' }}
          border="3px solid #000000"
          boxShadow="0px 8px 12px rgba(1, 0, 0, 0.1)"
          borderRadius="12px"
          p={2}
          spacing={3}
          bgcolor="#f7eaf2"
          zIndex={2}
        >
          <Stack
            direction={'column'}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            p={1}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
              >
                <Box
                  bgcolor={msg.role === 'assistant' ? '#f0bbdb' : '#ec94cb'}
                  color={msg.role === 'assistant' ? '#895575' : '#79325e'}
                  borderRadius="12px"
                  p={2}
                  boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
                  maxWidth="80%"
                >
                  {msg.content}
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} /> 
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              width: '100%',
              maxWidth: '100%',
              margin: '0 auto',
              padding: 1,
              gap: 1,
            }}
          >
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                  '&:hover fieldset': {
                    borderColor: '#000000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#333',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              sx={{
                bgcolor: 'pink',
                color: 'black',
                borderColor: '#000000',
                fontFamily: "'Roboto', sans-serif",
                '&:hover': {
                  bgcolor: '#f06292',
                },
                '& fieldset': {
                  borderColor: '#000000',
                },
              }}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
