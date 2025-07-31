import { useEffect, useState, useRef } from "react";
import styled, { ThemeProvider } from "styled-components";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { FaReply, FaEdit, FaTrash } from "react-icons/fa";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const lightTheme = {
  bg: "#f5f5f5",
  text: "#1a1a1a",
  bubbleSelf: "#a7e4a0",
  bubbleOthers: "#ffffff",
  border: "#25d366",
  replyBg: "#e0e0e0",
  replyBorder: "#b0b0b0",
};

const darkTheme = {
  bg: "#1a1a1a",
  text: "#f0f0f0",
  bubbleSelf: "#00a884",
  bubbleOthers: "#2d3a45",
  border: "#25d366",
  replyBg: "#252525",
  replyBorder: "#4a4a4a",
};

const Container = styled.div`
  max-width: 1100px;
  margin: 16px auto;
  height: calc(100vh - 32px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    margin: 8px;
    padding: 0 8px;
    height: calc(100vh - 16px);
  }
  @media (max-width: 480px) {
    margin: 4px;
    padding: 0 4px;
    height: calc(100vh - 8px);
  }
`;

const Header = styled.header`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => (theme === darkTheme ? "#1f2a31" : "#ffffff")};
  border-radius: 12px 12px 0 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 0 16px;
  font-weight: 700;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.text};
  user-select: none;
  @media (max-width: 480px) {
    height: 48px;
    font-size: 1.1rem;
    padding: 0 12px;
  }
`;

const ToggleModeBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.border};
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease, transform 0.2s ease;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${({ theme }) => theme.border};
    color: white;
    transform: scale(1.05);
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 6px 10px;
  }
`;

const MessageList = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  gap: 12px;
  background: ${({ theme }) => (theme === darkTheme ? "#111b21" : "#ece5dd")};
  border-radius: 0 0 10px 10px;
  overscroll-behavior: contain;
  @media (max-width: 768px) {
    padding: 12px;
    gap: 10px;
  }
  @media (max-width: 480px) {
    padding: 8px;
    gap: 8px;
  }
`;

const Bubble = styled(motion.div)`
  max-width: 70%;
  background-color: ${({ isSelf, theme }) =>
    isSelf ? theme.bubbleSelf : theme.bubbleOthers};
  padding: 10px 14px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-self: ${({ isSelf }) => (isSelf ? "flex-end" : "flex-start")};
  position: relative;
  font-size: 1rem;
  word-break: break-word;
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
  @media (max-width: 768px) {
    max-width: 80%;
    font-size: 0.95rem;
    padding: 8px 12px;
  }
  @media (max-width: 480px) {
    max-width: 90%;
    font-size: 0.9rem;
    padding: 6px 10px;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.border};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  margin-${({ isSelf }) => (isSelf ? "left" : "right")}: 8px;
  flex-shrink: 0;
  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
    margin-${({ isSelf }) => (isSelf ? "left" : "right")}: 6px;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: ${({ theme }) => `${theme.text}cc`};
  font-weight: 500;
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const ReplyPreview = styled.div`
  background: ${({ theme }) => theme.replyBg};
  border-left: 4px solid ${({ theme }) => theme.replyBorder};
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 6px 10px;
  }
`;

const ActionGroup = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 12px;
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.border};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  transition: color 0.25s ease;
  min-height: 44px;
  &:hover {
    color: #128c7e;
    text-decoration: underline;
  }
  &:hover:after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: ${({ theme }) => theme.text};
    color: ${({ theme }) => theme.bg};
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    white-space: nowrap;
    z-index: 10;
  }
  @media (max-width: 480px) {
    font-size: 0.8rem;
    gap: 3px;
  }
`;

const InputWrapper = styled.form`
  border-top: 1px solid #ccc;
  background: ${({ theme }) => (theme === darkTheme ? "#1f2a31" : "#ffffff")};
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap;
  @media (max-width: 480px) {
    padding: 8px 12px;
    gap: 8px;
  }
`;

const InputArea = styled.textarea`
  flex: 1;
  border: none;
  border-radius: 20px;
  padding: 10px 14px;
  min-height: 40px;
  max-height: 100px;
  resize: none;
  line-height: 1.5;
  font-size: 1rem;
  font-family: inherit;
  background: ${({ theme }) => (theme === darkTheme ? "#2a3942" : "#fff")};
  color: ${({ theme }) => theme.text};
  box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.1);
  &:focus {
    outline: none;
    box-shadow: 0 0 4px ${({ theme }) => theme.border};
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 8px 12px;
    min-height: 36px;
  }
`;

const SendBtn = styled.button`
  background: linear-gradient(135deg, ${({ theme }) => theme.border}, #1aa179);
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, background-color 0.3s ease;
  flex-shrink: 0;
  &:hover {
    transform: scale(1.1);
    background: #1aa179;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
`;

const ClearBtn = styled.button`
  align-self: flex-start;
  margin: 12px 0;
  background: none;
  border: none;
  color: ${({ theme }) => theme.border};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  user-select: none;
  min-height: 44px;
  &:hover {
    text-decoration: underline;
  }
  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin: 8px 0;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 16px;
  color: ${({ theme }) => `${theme.text}99`};
  font-size: 1rem;
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 12px;
  }
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

  useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  const handleEdit = (msg) => {
    setInput(msg.content);
    setEditId(msg._id);
    setReplyTo(msg.replyTo || null);
  };

  const handleReply = (msg) => setReplyTo(msg);
  const cancelReply = () => setReplyTo(null);

  const handleClearMyMessages = () => {
    const userMsgs = messages.filter((msg) => msg.user?._id === userId);
    userMsgs.forEach(async (msg) => await handleDelete(msg._id));
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
                        <span>Replying to: {msg.replyTo.content?.slice(0, 80)}...</span>
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
                      <ActionBtn onClick={() => handleReply(msg)} data-tooltip="Reply">
                        <FaReply /> Reply
                      </ActionBtn>
                      {isSelf && (
                        <>
                          <ActionBtn onClick={() => handleEdit(msg)} data-tooltip="Edit">
                            <FaEdit /> Edit
                          </ActionBtn>
                          <ActionBtn onClick={() => handleDelete(msg._id)} data-tooltip="Delete">
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
            <span>Replying to: {replyTo.content?.slice(0, 80)}...</span>
            <ActionBtn onClick={cancelReply} data-tooltip="Cancel Reply">
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
          <SendBtn type="submit" disabled={!input.trim()}>✈️</SendBtn>
        </InputWrapper>
      </Container>
    </ThemeProvider>
  );
};

export default Forum;