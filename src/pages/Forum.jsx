import { useEffect, useState, useRef } from "react";
import styled, { ThemeProvider } from "styled-components";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { FaReply, FaEdit, FaTrash } from "react-icons/fa";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const lightTheme = {
  mode: "light",
  bg: "#f0f2f5",
  text: "#111",
  bubbleSelf: "#d9fdd3",
  bubbleOthers: "#fff",
  border: "#25d366",
  replyBg: "#ededed",
  replyBorder: "#bdbdbd",
};

const darkTheme = {
  mode: "dark",
  bg: "#111b21",
  text: "#e9edef",
  bubbleSelf: "#005c4b",
  bubbleOthers: "#202c33",
  border: "#25d366",
  replyBg: "#2a3942",
  replyBorder: "#3c4b52",
};

const Container = styled.div`
  width: 100vw;
  height: 88vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  overflow: hidden; /* Prevent body scroll */
  font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const Header = styled.header`
  flex-shrink: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: ${({ theme }) => (theme.mode === "dark" ? "#202c33" : "#fff")};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  font-weight: 600;
  font-size: 1.25rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const ToggleModeBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.border};
  font-weight: 500;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: 0.25s ease;
  &:hover {
    background: ${({ theme }) => theme.border};
    color: #fff;
  }
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column-reverse;
  gap: 12px;
`;

const Bubble = styled(motion.div)`
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 1rem;
  line-height: 1.4;
  word-break: break-word;
  align-self: ${({ isSelf }) => (isSelf ? "flex-end" : "flex-start")};
  background: ${({ isSelf, theme }) =>
    isSelf ? theme.bubbleSelf : theme.bubbleOthers};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.border};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  margin-${({ isSelf }) => (isSelf ? "left" : "right")}: 8px;
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-bottom: 6px;
  color: ${({ theme }) => `${theme.text}aa`};
`;

const ReplyPreview = styled.div`
  background: ${({ theme }) => theme.replyBg};
  border-left: 4px solid ${({ theme }) => theme.replyBorder};
  padding: 6px 10px;
  margin-bottom: 6px;
  border-radius: 6px;
  font-size: 0.85rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActionGroup = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 12px;
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.border};
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    color: #128c7e;
    text-decoration: underline;
  }
`;

const InputWrapper = styled.form`
  flex-shrink: 0;
  padding: 12px 16px;
  background: ${({ theme }) => (theme.mode === "dark" ? "#202c33" : "#fff")};
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const InputArea = styled.textarea`
  flex: 1;
  border: none;
  border-radius: 20px;
  padding: 10px 14px;
  min-height: 42px;
  max-height: 120px;
  resize: none;
  font-size: 1rem;
  font-family: inherit;
  background: ${({ theme }) => (theme.mode === "dark" ? "#2a3942" : "#fefefe")};
  color: ${({ theme }) => theme.text};
  &:focus {
    outline: none;
    box-shadow: 0 0 4px ${({ theme }) => theme.border};
  }
`;

const SendBtn = styled.button`
  background: ${({ theme }) => theme.border};
  border: none;
  color: #fff;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  transition: 0.25s ease;
  &:hover {
    transform: scale(1.1);
    background: #128c7e;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 16px;
  font-size: 0.9rem;
  color: ${({ theme }) => `${theme.text}99`};
`;

const Forum = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [userId, setUserId] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    if (messageListRef.current) messageListRef.current.scrollTop = 0;
  }, [messages]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/forum`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const url = editId ? `${API_BASE_URL}/api/forum/${editId}` : `${API_BASE_URL}/api/forum`;
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
      await fetch(`${API_BASE_URL}/api/forum/${id}`, {
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

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <Header>
          🌿 PlantTaxa Forum
          <ToggleModeBtn onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </ToggleModeBtn>
        </Header>

        <MessageList ref={messageListRef}>
          {isLoading && <Loading>Loading...</Loading>}
          {[...messages].map((msg) => {
            const isSelf = msg.user?._id === userId;
            return (
              <Bubble
                key={msg._id}
                isSelf={isSelf}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  {!isSelf && <Avatar isSelf={isSelf}>{msg.user?.name?.[0] || "A"}</Avatar>}
                  <div style={{ flex: 1 }}>
                    {msg.replyTo && (
                      <ReplyPreview>
                        <span>
                          Replying to: {msg.replyTo.content?.slice(0, 80)}
                          {msg.replyTo.content?.length > 80 ? "..." : ""}
                        </span>
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
                      <ActionBtn onClick={() => setReplyTo(msg)}>
                        <FaReply /> Reply
                      </ActionBtn>
                      {isSelf && (
                        <>
                          <ActionBtn onClick={() => {setInput(msg.content); setEditId(msg._id);}}>
                            <FaEdit /> Edit
                          </ActionBtn>
                          <ActionBtn onClick={() => handleDelete(msg._id)}>
                            <FaTrash /> Delete
                          </ActionBtn>
                        </>
                      )}
                    </ActionGroup>
                  </div>
                  {isSelf && <Avatar isSelf={isSelf}>{msg.user?.name?.[0] || "A"}</Avatar>}
                </div>
              </Bubble>
            );
          })}
        </MessageList>

        {replyTo && (
          <ReplyPreview>
            <span>
              Replying to: {replyTo.content?.slice(0, 80)}
              {replyTo.content?.length > 80 ? "..." : ""}
            </span>
            <ActionBtn onClick={() => setReplyTo(null)}>Cancel</ActionBtn>
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
          <SendBtn type="submit" disabled={!input.trim()}>
            ✈️
          </SendBtn>
        </InputWrapper>
      </Container>
    </ThemeProvider>
  );
};

export default Forum;
