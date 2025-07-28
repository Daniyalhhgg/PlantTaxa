import { useEffect, useState, useRef } from "react";
import styled, { ThemeProvider } from "styled-components";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode"; // Named import

// Themes (WhatsApp-like green + white/dark bg)
const lightTheme = {
  bg: "#e5ddd5",
  text: "#111",
  bubbleSelf: "#dcf8c6",
  bubbleOthers: "#fff",
  border: "#25d366",
  replyBg: "#f0f0f0",
  replyBorder: "#ccc",
};

const darkTheme = {
  bg: "#121212",
  text: "#eee",
  bubbleSelf: "#056162",
  bubbleOthers: "#262d31",
  border: "#128c7e",
  replyBg: "#1a1a1a",
  replyBorder: "#333",
};

// Container holding everything, max width like WhatsApp Web
const Container = styled.div`
  max-width: 1050px;   /* wider */
  margin: 0 auto;
  height: 80vh;        /* shorter */
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 0 12px;
`;

// Header bar with title and toggle
const Header = styled.header`
  height: 50px;        /* keep header height same */
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  background: ${({ theme }) => (theme === darkTheme ? "#202c33" : "#f8f8f8")};
  padding: 0 16px;
  font-weight: 700;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.text};
  user-select: none;
`;

const ToggleModeBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.border};
  font-weight: 700;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.border};
    color: white;
  }
`;

// Message list area, scrollable, flex column-reverse to start bottom
const MessageList = styled.div`
  flex: 1;
  padding: 20px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  gap: 12px;
  background: ${({ theme }) => (theme === darkTheme ? "#111b21" : "#ece5dd")};
  border-radius: 0 0 10px 10px;
`;

// Message bubble container aligns left or right
const Bubble = styled(motion.div)`
  max-width: 65%;
  background-color: ${({ isSelf, theme }) =>
    isSelf ? theme.bubbleSelf : theme.bubbleOthers};
  padding: 10px 14px;
  border-radius: 7.5px;
  box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
  align-self: ${({ isSelf }) => (isSelf ? "flex-end" : "flex-start")};
  position: relative;
  font-size: 0.95rem;
  word-break: break-word;

  /* Bubble tails using pseudo elements */
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    ${({ isSelf }) => (isSelf ? "right: -8px;" : "left: -8px;")}
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-top-color: ${({ isSelf, theme }) =>
      isSelf ? theme.bubbleSelf : theme.bubbleOthers};
    border-bottom: 0;
    margin-bottom: -8px;
  }
`;

// Username and timestamp line inside bubble
const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.8rem;
  color: ${({ theme }) => `${theme.text}cc`};
  font-weight: 600;
`;

// Reply preview bar above bubble text
const ReplyPreview = styled.div`
  background: ${({ theme }) => theme.replyBg};
  border-left: 4px solid ${({ theme }) => theme.replyBorder};
  padding: 6px 12px;
  margin-bottom: 6px;
  border-radius: 4px;
  font-style: italic;
  color: ${({ theme }) => `${theme.text}aa`};
  user-select: none;
`;

// Button group for reply/edit/delete
const ActionGroup = styled.div`
  margin-top: 6px;
  display: flex;
  gap: 14px;
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.border};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: color 0.25s ease;

  &:hover {
    color: ${({ theme }) => "#128c7e"};
    text-decoration: underline;
  }
`;

// Input bar container fixed at bottom
const InputWrapper = styled.form`
  border-top: 1px solid #ccc;
  background: ${({ theme }) => (theme === darkTheme ? "#202c33" : "#f8f8f8")};
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

// Input textarea with WhatsApp style
const InputArea = styled.textarea`
  flex: 1;
  border: none;
  border-radius: 20px;
  padding: 10px 16px;
  resize: none;
  font-size: 1rem;
  font-family: inherit;
  background: ${({ theme }) => (theme === darkTheme ? "#2a3942" : "#fff")};
  color: ${({ theme }) => theme.text};
  box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.1);

  &:focus {
    outline: none;
    box-shadow: 0 0 3px ${({ theme }) => theme.border};
  }
`;

// Send button green circle
const SendBtn = styled.button`
  background: ${({ theme }) => theme.border};
  border: none;
  color: white;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #128c7e;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Clear messages button styled as small text button
const ClearBtn = styled.button`
  align-self: flex-start;
  margin: 10px 0;
  background: none;
  border: none;
  color: ${({ theme }) => theme.border};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  user-select: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Forum = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [userId, setUserId] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const messageListRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch {
        setUserId("");
      }
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    if (messageListRef.current) {
      // Scroll to bottom (since flex-column-reverse, scrollTop = 0)
      messageListRef.current.scrollTop = 0;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/forum");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const url = editId
      ? `http://localhost:5000/api/forum/${editId}`
      : "http://localhost:5000/api/forum";
    const method = editId ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: input.trim(), replyTo: replyTo?._id || null }),
      });
      setInput("");
      setEditId(null);
      setReplyTo(null);
      fetchMessages();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/forum/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchMessages();
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleEdit = (msg) => {
    setInput(msg.content);
    setEditId(msg._id);
    setReplyTo(msg.replyTo || null);
  };

  const handleReply = (msg) => {
    setReplyTo(msg);
  };

  const cancelReply = () => setReplyTo(null);

  const handleClearMyMessages = () => {
    const userMsgs = messages.filter((msg) => msg.user?._id === userId);
    userMsgs.forEach(async (msg) => {
      await handleDelete(msg._id);
    });
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <Header>
          🌿 PlantTaxa Forum
          <ToggleModeBtn onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </ToggleModeBtn>
        </Header>

        <ClearBtn onClick={handleClearMyMessages}>Clear My Messages</ClearBtn>

        <MessageList ref={messageListRef}>
          {[...messages].map((msg) => {
            const isSelf = msg.user?._id === userId;
            return (
              <Bubble
                key={msg._id}
                isSelf={isSelf}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {msg.replyTo && (
                  <ReplyPreview>
                    Replying to: {msg.replyTo.content?.slice(0, 40)}...
                  </ReplyPreview>
                )}
                <MessageHeader>
                  <span>{msg.user?.name || "Anonymous"}</span>
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </MessageHeader>
                <div>{msg.content}</div>
                <ActionGroup>
                  <ActionBtn onClick={() => handleReply(msg)}>Reply</ActionBtn>
                  {isSelf && (
                    <>
                      <ActionBtn onClick={() => handleEdit(msg)}>Edit</ActionBtn>
                      <ActionBtn onClick={() => handleDelete(msg._id)}>Delete</ActionBtn>
                    </>
                  )}
                </ActionGroup>
              </Bubble>
            );
          })}
        </MessageList>

        {replyTo && (
          <ReplyPreview>
            Replying to: {replyTo.content?.slice(0, 60)}...
            <ActionBtn onClick={cancelReply} style={{ marginLeft: 10 }}>
              Cancel
            </ActionBtn>
          </ReplyPreview>
        )}

        <InputWrapper onSubmit={handleSend}>
          <InputArea
            placeholder="Type a message"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <SendBtn disabled={!input.trim()} type="submit" title="Send message">
            ➤
          </SendBtn>
        </InputWrapper>
      </Container>
    </ThemeProvider>
  );
};

export default Forum;
