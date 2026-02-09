import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiPlus, FiMoon, FiSun, FiMic, FiSend, FiThumbsUp, FiThumbsDown, FiCode, FiMessageSquare, FiCopy, FiTrash2, FiCheck } from 'react-icons/fi';
import type { Theme, Chat, Message } from './types';
import { mockChats, mockDataSources } from './data/mockData';

function App() {
    const [theme, setTheme] = useState<Theme>('dark');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chats, setChats] = useState<Chat[]>(mockChats);
    const [activeChat, setActiveChat] = useState<Chat | null>(mockChats[0]);
    const [inputValue, setInputValue] = useState('');
    const [showSqlQuery, setShowSqlQuery] = useState<Record<string, boolean>>({});
    const [likedMessages, setLikedMessages] = useState<Record<string, 'liked' | 'disliked' | null>>({});
    const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const chatAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [activeChat?.messages]);

    // Toast auto-dismiss
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
        showToast(`Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    };

    const createNewChat = () => {
        const newChat: Chat = {
            id: Date.now().toString(),
            title: 'New conversation',
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setChats([newChat, ...chats]);
        setActiveChat(newChat);
        showToast('New chat created');
    };

    const deleteChat = (chatId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedChats = chats.filter(c => c.id !== chatId);
        setChats(updatedChats);
        if (activeChat?.id === chatId) {
            setActiveChat(updatedChats[0] || null);
        }
        showToast('Chat deleted');
    };

    const sendMessage = () => {
        if (!inputValue.trim() || !activeChat) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        // Simulate AI response
        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `I understand you're asking about: "${inputValue}"\n\nI'm analyzing your enterprise data to provide an accurate response. This is a demonstration of the AskQ interface.\n\n**Sample Response:**\n- Processed your natural language query\n- Connected to your data sources\n- Generated insights from the data`,
            sender: 'assistant',
            timestamp: new Date(),
            sqlQuery: `-- Generated SQL Query\nSELECT * FROM your_table\nWHERE condition = 'value'\nORDER BY date DESC\nLIMIT 100;`,
        };

        const updatedChat = {
            ...activeChat,
            title: inputValue.substring(0, 40) + (inputValue.length > 40 ? '...' : ''),
            messages: [...activeChat.messages, userMessage, aiMessage],
            updatedAt: new Date(),
        };

        setChats(chats.map(c => c.id === activeChat.id ? updatedChat : c));
        setActiveChat(updatedChat);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleLike = (messageId: string) => {
        setLikedMessages(prev => ({
            ...prev,
            [messageId]: prev[messageId] === 'liked' ? null : 'liked'
        }));
        showToast('Thanks for your feedback!');
    };

    const handleDislike = (messageId: string) => {
        setLikedMessages(prev => ({
            ...prev,
            [messageId]: prev[messageId] === 'disliked' ? null : 'disliked'
        }));
        showToast('Thanks for your feedback!');
    };

    const handleCopy = async (text: string, messageId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedMessage(messageId);
            showToast('Copied to clipboard!');
            setTimeout(() => setCopiedMessage(null), 2000);
        } catch {
            showToast('Failed to copy', 'error');
        }
    };

    const handleVoiceInput = () => {
        if (isRecording) {
            setIsRecording(false);
            showToast('Voice recording stopped');
            // Simulate voice input
            setInputValue('What are the total sales for Q4?');
        } else {
            setIsRecording(true);
            showToast('Listening... Speak now');
        }
    };

    const groupChatsByDate = (chats: Chat[]) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        return {
            today: chats.filter(c => c.createdAt.toDateString() === today.toDateString()),
            yesterday: chats.filter(c => c.createdAt.toDateString() === yesterday.toDateString()),
            lastWeek: chats.filter(c =>
                c.createdAt > lastWeek &&
                c.createdAt.toDateString() !== today.toDateString() &&
                c.createdAt.toDateString() !== yesterday.toDateString()
            ),
            older: chats.filter(c => c.createdAt <= lastWeek),
        };
    };

    const chatGroups = groupChatsByDate(chats);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const toggleSqlQuery = (messageId: string) => {
        setShowSqlQuery(prev => ({ ...prev, [messageId]: !prev[messageId] }));
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
    };

    const renderChatGroup = (title: string, chats: Chat[]) => {
        if (chats.length === 0) return null;
        return (
            <div className="chat-group">
                <div className="chat-group-title">{title}</div>
                {chats.map(chat => (
                    <div
                        key={chat.id}
                        className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                        onClick={() => setActiveChat(chat)}
                    >
                        <FiMessageSquare size={16} />
                        <span className="chat-item-text">{chat.title}</span>
                        <button
                            className="chat-item-delete"
                            onClick={(e) => deleteChat(chat.id, e)}
                            title="Delete chat"
                        >
                            <FiTrash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="app-container">
            {/* Toast Notification */}
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <FiMenu size={20} />
                    </button>
                    <button className="new-chat-btn" onClick={createNewChat}>
                        <FiPlus size={18} />
                        New Chat
                    </button>
                </div>

                <div className="chat-history">
                    {renderChatGroup('Today', chatGroups.today)}
                    {renderChatGroup('Yesterday', chatGroups.yesterday)}
                    {renderChatGroup('Last 7 Days', chatGroups.lastWeek)}
                    {renderChatGroup('Older', chatGroups.older)}
                </div>

                <div className="data-sources">
                    <div className="data-sources-title">Connected Sources</div>
                    {mockDataSources.map(source => (
                        <div key={source.id} className="data-source-item">
                            <span className={`data-source-status ${source.connected ? 'connected' : ''}`}></span>
                            <span>{source.icon}</span>
                            <span>{source.name}</span>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header className="header">
                    <div className="header-left">
                        {!sidebarOpen && (
                            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
                                <FiMenu size={20} />
                            </button>
                        )}
                        <div className="logo">
                            <div className="logo-icon">Q</div>
                            <span className="logo-text">AskQ</span>
                        </div>
                    </div>

                    <div className="header-center">
                        <span className="header-subtitle">Enterprise AI Assistant</span>
                    </div>

                    <div className="header-right">
                        <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>
                        <div className="user-avatar">U</div>
                    </div>
                </header>

                {/* Chat Area */}
                <div className="chat-area" ref={chatAreaRef}>
                    {!activeChat || activeChat.messages.length === 0 ? (
                        <div className="welcome-container fade-in">
                            <div className="welcome-icon">Q</div>
                            <h1 className="welcome-title">Welcome to AskQ</h1>
                            <p className="welcome-text">
                                Your AI-powered assistant for enterprise data. Ask questions in plain English
                                and get insights from your connected systems like <strong>SAP</strong>, <strong>RAMCO ERP</strong>,
                                and <strong>EHR</strong> databases.
                            </p>
                            <div className="welcome-suggestions">
                                <button
                                    className="suggestion-chip"
                                    onClick={() => handleSuggestionClick("What were last month's top-selling products?")}
                                >
                                    📊 Top-selling products
                                </button>
                                <button
                                    className="suggestion-chip"
                                    onClick={() => handleSuggestionClick("Show me orders shipped late this quarter")}
                                >
                                    📦 Late shipments
                                </button>
                                <button
                                    className="suggestion-chip"
                                    onClick={() => handleSuggestionClick("Employee attendance summary")}
                                >
                                    👥 Attendance report
                                </button>
                                <button
                                    className="suggestion-chip"
                                    onClick={() => handleSuggestionClick("Revenue comparison by region")}
                                >
                                    💰 Revenue by region
                                </button>
                            </div>
                        </div>
                    ) : (
                        activeChat.messages.map((message) => (
                            <div key={message.id} className={`message ${message.sender}`}>
                                <div className="message-avatar">
                                    {message.sender === 'user' ? 'U' : 'Q'}
                                </div>
                                <div className="message-content">
                                    <div className="message-bubble">
                                        {message.content.split('\n').map((line, i) => (
                                            <p key={i} dangerouslySetInnerHTML={{
                                                __html: line
                                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                    .replace(/^- /g, '• ')
                                            }} />
                                        ))}
                                    </div>

                                    <div className="message-timestamp">
                                        <span>{formatTime(message.timestamp)}</span>

                                        {message.sender === 'assistant' && (
                                            <div className="message-actions">
                                                <button
                                                    className={`action-btn ${likedMessages[message.id] === 'liked' ? 'liked' : ''}`}
                                                    title="Like"
                                                    onClick={() => handleLike(message.id)}
                                                >
                                                    <FiThumbsUp />
                                                </button>
                                                <button
                                                    className={`action-btn ${likedMessages[message.id] === 'disliked' ? 'disliked' : ''}`}
                                                    title="Dislike"
                                                    onClick={() => handleDislike(message.id)}
                                                >
                                                    <FiThumbsDown />
                                                </button>
                                                <button
                                                    className={`action-btn ${copiedMessage === message.id ? 'copied' : ''}`}
                                                    title="Copy"
                                                    onClick={() => handleCopy(message.content, message.id)}
                                                >
                                                    {copiedMessage === message.id ? <FiCheck /> : <FiCopy />}
                                                </button>
                                                {message.sqlQuery && (
                                                    <button
                                                        className={`action-btn ${showSqlQuery[message.id] ? 'active' : ''}`}
                                                        title="View SQL"
                                                        onClick={() => toggleSqlQuery(message.id)}
                                                    >
                                                        <FiCode />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {message.sender === 'assistant' && message.sqlQuery && showSqlQuery[message.id] && (
                                        <div className="sql-toggle slide-up">
                                            <pre className="sql-code">{message.sqlQuery}</pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Chat Input */}
                <div className="chat-input-container">
                    <div className="chat-input-wrapper">
                        <div className="chat-input">
                            <button
                                className={`voice-btn ${isRecording ? 'recording' : ''}`}
                                title={isRecording ? 'Stop recording' : 'Voice input'}
                                onClick={handleVoiceInput}
                            >
                                <FiMic />
                            </button>
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask something about your data..."
                                rows={1}
                            />
                            <button
                                className="send-btn"
                                onClick={sendMessage}
                                disabled={!inputValue.trim()}
                                title="Send message"
                            >
                                <FiSend />
                            </button>
                        </div>
                        <div className="input-hint">
                            AskQ can make mistakes. Verify important information.
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="footer">
                    <div className="footer-brand">
                        Powered by <a href="https://quadratyx.com" target="_blank" rel="noopener noreferrer">Quadratyx</a>
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default App;
