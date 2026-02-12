import { useState, useEffect, useRef } from 'react';
import {
    FiMenu, FiPlus, FiMoon, FiSun, FiMic, FiSend, FiThumbsUp, FiThumbsDown,
    FiCode, FiMessageSquare, FiCopy, FiTrash2, FiCheck, FiHelpCircle, FiBookmark,
    FiShare2, FiDatabase, FiClock, FiRefreshCw, FiChevronRight, FiSearch,
    FiBookOpen, FiStar, FiCalendar, FiFilter, FiX, FiDownload, FiLogOut,
    FiSettings, FiLock, FiMail
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import type { Theme, Chat, Message, FilterContext, Playbook } from './types';
import { mockChats, mockDataSources, mockPlaybooks, mockSavedInsights, defaultFilterContext, quickSuggestions } from './data/mockData';
import { querySqlAgent } from './services/sqlAgentClient';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [theme, setTheme] = useState<Theme>('dark');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [contextPanelOpen, setContextPanelOpen] = useState(false);
    const [chats, setChats] = useState<Chat[]>(mockChats);
    const [activeChat, setActiveChat] = useState<Chat | null>(mockChats[0]);
    const [inputValue, setInputValue] = useState('');
    const [showSqlQuery, setShowSqlQuery] = useState<Record<string, boolean>>({});
    const [likedMessages, setLikedMessages] = useState<Record<string, 'liked' | 'disliked' | null>>({});
    const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [filterContext, setFilterContext] = useState<FilterContext>(defaultFilterContext);
    const [activePlaybook, setActivePlaybook] = useState<Playbook | null>(null);
    const [playbookStep, setPlaybookStep] = useState(0);
    const [pinnedMessages, setPinnedMessages] = useState<Set<string>>(new Set());
    const [sidebarTab, setSidebarTab] = useState<'chats' | 'saved' | 'playbooks'>('chats');
    const [searchQuery, setSearchQuery] = useState('');
    const chatAreaRef = useRef<HTMLDivElement>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [activeChat?.messages]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginEmail || !loginPassword) {
            setLoginError('Please enter email and password');
            return;
        }
        // Simulate login
        if (loginEmail && loginPassword.length >= 4) {
            setIsLoggedIn(true);
            setLoginError('');
            showToast('Welcome to AskQ!');
        } else {
            setLoginError('Invalid credentials');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setShowProfileMenu(false);
        setLoginEmail('');
        setLoginPassword('');
        showToast('Logged out successfully');
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
        showToast(`Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    };

    const createNewChat = (resetPlaybook = true) => {
        const newChat: Chat = {
            id: Date.now().toString(),
            title: 'New conversation',
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setChats(prevChats => [newChat, ...prevChats]);
        setActiveChat(newChat);
        if (resetPlaybook) {
            setActivePlaybook(null);
        }
        showToast('New chat created');
        return newChat;
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

    const simulateLoading = async () => {
        const steps = [
            'Understanding question',
            'Identifying tables',
            'Generating SQL',
            'Executing query',
            'Analyzing results',
        ];

        for (let i = 0; i < steps.length; i++) {
            setLoadingStep(i);
            await new Promise(resolve => setTimeout(resolve, 400));
        }
    };

    const sendMessage = async (customQuery?: string, targetChat?: Chat) => {
        const query = customQuery || inputValue;
        const baseChat = targetChat || activeChat;
        if (!query.trim() || !baseChat) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: query,
            sender: 'user',
            timestamp: new Date(),
        };

        setIsLoading(true);
        setInputValue('');

        const updatedChatWithUser = {
            ...baseChat,
            messages: [...baseChat.messages, userMessage],
        };
        setChats(prevChats => prevChats.map(c => c.id === baseChat.id ? updatedChatWithUser : c));
        setActiveChat(updatedChatWithUser);

        await simulateLoading();

        let analyticsData;
        try {
            analyticsData = await querySqlAgent(query);
            if (analyticsData.usedFallbackModel) {
                showToast('Ollama unavailable. Using fallback SQL generator.', 'error');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to process your question';
            const aiErrorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: `I couldn't process this query right now. ${errorMessage}`,
                sender: 'assistant',
                timestamp: new Date(),
                title: 'SQL Agent Error',
                insights: [
                    'Check backend server status and API configuration.',
                    'Ensure Ollama is running and OLLAMA_MODEL is configured on the backend.',
                ],
                drillDownOptions: [
                    'Show recent orders',
                    'Show revenue trend',
                    'Show inventory status',
                ],
                confidence: 0,
                tablesUsed: [],
                sqlQuery: '',
            };

            const failedChat = {
                ...baseChat,
                title: query.substring(0, 40) + (query.length > 40 ? '...' : ''),
                messages: [...baseChat.messages, userMessage, aiErrorMessage],
                updatedAt: new Date(),
            };

            setChats(prevChats => prevChats.map(c => c.id === baseChat.id ? failedChat : c));
            setActiveChat(failedChat);
            setIsLoading(false);
            showToast('SQL agent request failed', 'error');
            return;
        }

        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: analyticsData.content,
            sender: 'assistant',
            timestamp: new Date(),
            sqlQuery: analyticsData.sqlQuery,
            lastRefresh: new Date(),
            title: analyticsData.title,
            keyMetric: analyticsData.keyMetric,
            chartData: analyticsData.chartData,
            tableData: analyticsData.tableData,
            insights: analyticsData.insights,
            drillDownOptions: analyticsData.drillDownOptions,
            confidence: analyticsData.confidence,
            tablesUsed: analyticsData.tablesUsed,
        };

        const finalChat = {
            ...baseChat,
            title: query.substring(0, 40) + (query.length > 40 ? '...' : ''),
            messages: [...baseChat.messages, userMessage, aiMessage],
            updatedAt: new Date(),
        };

        setChats(prevChats => prevChats.map(c => c.id === baseChat.id ? finalChat : c));
        setActiveChat(finalChat);
        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleDrillDown = (query: string) => {
        sendMessage(query);
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

    const handlePin = (messageId: string) => {
        setPinnedMessages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(messageId)) {
                newSet.delete(messageId);
                showToast('Unpinned insight');
            } else {
                newSet.add(messageId);
                showToast('Insight pinned!');
            }
            return newSet;
        });
    };

    const handleShare = () => {
        showToast('Share link copied!');
    };

    const handleExport = () => {
        showToast('Exporting to CSV...');
    };

    const handleVoiceInput = () => {
        if (isRecording) {
            setIsRecording(false);
            showToast('Voice recording stopped');
            setInputValue('What are the total sales for Q4?');
        } else {
            setIsRecording(true);
            showToast('Listening... Speak now');
        }
    };

    const startPlaybook = (playbook: Playbook) => {
        setActivePlaybook(playbook);
        setPlaybookStep(0);
        const chat = createNewChat(false);
        sendMessage(playbook.steps[0].query, chat);
    };

    const nextPlaybookStep = () => {
        if (activePlaybook && playbookStep < activePlaybook.steps.length - 1) {
            const nextStep = playbookStep + 1;
            setPlaybookStep(nextStep);
            sendMessage(activePlaybook.steps[nextStep].query);
        } else {
            setActivePlaybook(null);
            showToast('Playbook completed!');
        }
    };

    const groupChatsByDate = (chats: Chat[]) => {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        const pinned = chats.filter(c => c.isPinned);
        const todayChats = chats.filter(c => !c.isPinned && c.createdAt.toDateString() === today.toDateString());
        const olderChats = chats.filter(c => !c.isPinned && c.createdAt.toDateString() !== today.toDateString());

        return { pinned, today: todayChats, older: olderChats };
    };

    const filteredChats = chats.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const chatGroups = groupChatsByDate(filteredChats);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatRelativeTime = (date: Date) => {
        const diff = Date.now() - date.getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    const toggleSqlQuery = (messageId: string) => {
        setShowSqlQuery(prev => ({ ...prev, [messageId]: !prev[messageId] }));
    };

    const renderChart = (message: Message) => {
        if (!message.chartData) return null;

        const { type, data } = message.chartData;
        const colors = ['#1a7b8c', '#2196a8', '#26b3c4', '#e53935', '#ff9800'];

        if (type === 'bar') {
            return (
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={data}>
                            <XAxis dataKey={message.chartData.xKey || 'name'} stroke="var(--text-tertiary)" fontSize={12} />
                            <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)'
                                }}
                            />
                            <Bar dataKey={message.chartData.yKey || 'value'} fill="#1a7b8c" radius={[4, 4, 0, 0]} />
                            {data[0] && 'onTime' in data[0] && (
                                <Bar dataKey="onTime" fill="#26b3c4" radius={[4, 4, 0, 0]} />
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (type === 'pie') {
            return (
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={(entry as { color?: string }).color || colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '8px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="chart-legend">
                        {data.map((entry, index) => (
                            <span key={index} className="legend-item">
                                <span className="legend-dot" style={{ background: (entry as { color?: string }).color || colors[index % colors.length] }}></span>
                                {(entry as { name: string }).name}
                            </span>
                        ))}
                    </div>
                </div>
            );
        }

        if (type === 'line') {
            return (
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data}>
                            <XAxis dataKey={message.chartData.xKey || 'name'} stroke="var(--text-tertiary)" fontSize={12} />
                            <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                            <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '8px' }} />
                            <Line type="monotone" dataKey={message.chartData.yKey || 'value'} stroke="#1a7b8c" strokeWidth={2} dot={{ fill: '#1a7b8c' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        return null;
    };

    const renderTable = (message: Message) => {
        if (!message.tableData) return null;

        const { title, columns, rows } = message.tableData;

        const formatCellValue = (value: any, type: string) => {
            if (value === null || value === undefined) return '-';
            switch (type) {
                case 'currency':
                    if (typeof value === 'number') {
                        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                        return `$${value.toLocaleString()}`;
                    }
                    return value;
                case 'percentage':
                    return typeof value === 'number' ? `${value}%` : value;
                case 'number':
                    return typeof value === 'number' ? value.toLocaleString() : value;
                case 'status':
                    const statusClass = String(value).toLowerCase().replace(/\s+/g, '-');
                    return <span className={`status-badge ${statusClass}`}>{value}</span>;
                default:
                    return value;
            }
        };

        return (
            <div className="data-table-container">
                <h4 className="table-title">{title}</h4>
                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {columns.map((col, i) => (
                                    <th key={i}>{col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.slice(0, 5).map((row, rowIdx) => (
                                <tr key={rowIdx}>
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className={`cell-${col.type}`}>
                                            {formatCellValue(row[col.key], col.type)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderChatGroup = (title: string, chats: Chat[], icon?: React.ReactNode) => {
        if (chats.length === 0) return null;
        return (
            <div className="chat-group">
                <div className="chat-group-title">{icon} {title}</div>
                {chats.map(chat => (
                    <div
                        key={chat.id}
                        className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                        onClick={() => { setActiveChat(chat); setActivePlaybook(null); }}
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

    // ========== LOGIN SCREEN ==========
    if (!isLoggedIn) {
        return (
            <div className="login-container" data-theme={theme}>
                <div className="login-card">
                    <div className="login-logo">
                        <div className="logo-icon large">Q</div>
                        <h1>AskQ</h1>
                        <p>Enterprise AI Assistant</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label><FiMail size={16} /> Email</label>
                            <input
                                type="email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                placeholder="your.email@company.com"
                            />
                        </div>

                        <div className="form-group">
                            <label><FiLock size={16} /> Password</label>
                            <input
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        {loginError && <div className="login-error">{loginError}</div>}

                        <button type="submit" className="login-btn">
                            Sign In
                        </button>

                        <div className="login-footer">
                            <span>Powered by <a href="https://quadratyx.com" target="_blank" rel="noopener noreferrer">Quadratyx</a></span>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // ========== MAIN APP ==========
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
                    <button className="new-chat-btn" onClick={() => createNewChat()}>
                        <FiPlus size={18} />
                        New Chat
                    </button>
                </div>

                {/* Sidebar Tabs */}
                <div className="sidebar-tabs">
                    <button
                        className={`sidebar-tab ${sidebarTab === 'chats' ? 'active' : ''}`}
                        onClick={() => setSidebarTab('chats')}
                    >
                        <FiMessageSquare size={16} /> Chats
                    </button>
                    <button
                        className={`sidebar-tab ${sidebarTab === 'playbooks' ? 'active' : ''}`}
                        onClick={() => setSidebarTab('playbooks')}
                    >
                        <FiBookOpen size={16} /> Playbooks
                    </button>
                    <button
                        className={`sidebar-tab ${sidebarTab === 'saved' ? 'active' : ''}`}
                        onClick={() => setSidebarTab('saved')}
                    >
                        <FiStar size={16} /> Saved
                    </button>
                </div>

                {/* Search */}
                <div className="sidebar-search">
                    <FiSearch size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="chat-history">
                    {sidebarTab === 'chats' && (
                        <>
                            {renderChatGroup('Pinned', chatGroups.pinned, <FiBookmark size={12} />)}
                            {renderChatGroup('Today', chatGroups.today)}
                            {renderChatGroup('Previous', chatGroups.older)}
                        </>
                    )}

                    {sidebarTab === 'playbooks' && (
                        <div className="playbooks-list">
                            {mockPlaybooks.map(playbook => (
                                <div
                                    key={playbook.id}
                                    className="playbook-card"
                                    onClick={() => startPlaybook(playbook)}
                                >
                                    <div className="playbook-icon">{playbook.icon}</div>
                                    <div className="playbook-info">
                                        <div className="playbook-name">{playbook.name}</div>
                                        <div className="playbook-desc">{playbook.steps.length} steps</div>
                                    </div>
                                    <FiChevronRight size={16} />
                                </div>
                            ))}
                        </div>
                    )}

                    {sidebarTab === 'saved' && (
                        <div className="saved-list">
                            {mockSavedInsights.map(insight => (
                                <div key={insight.id} className="saved-card">
                                    <div className="saved-icon"><FiStar size={16} /></div>
                                    <div className="saved-info">
                                        <div className="saved-name">{insight.name}</div>
                                        <div className="saved-desc">{insight.description}</div>
                                        {insight.schedule && (
                                            <div className="saved-schedule">
                                                <FiCalendar size={12} /> {insight.schedule.frequency}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                        {/* Profile with Dropdown */}
                        <div className="profile-container" ref={profileMenuRef}>
                            <div
                                className="user-avatar"
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                            >
                                {loginEmail ? loginEmail[0].toUpperCase() : 'U'}
                            </div>

                            {showProfileMenu && (
                                <div className="profile-menu">
                                    <div className="profile-header">
                                        <div className="profile-avatar">
                                            {loginEmail ? loginEmail[0].toUpperCase() : 'U'}
                                        </div>
                                        <div className="profile-info">
                                            <div className="profile-name">{loginEmail || 'User'}</div>
                                            <div className="profile-role">Enterprise User</div>
                                        </div>
                                    </div>

                                    <div className="profile-section">
                                        <div className="profile-section-title">Appearance</div>
                                        <button className="profile-item" onClick={toggleTheme}>
                                            {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
                                            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                        </button>
                                    </div>

                                    <div className="profile-section">
                                        <div className="profile-section-title">Settings</div>
                                        <button
                                            className={`profile-item ${contextPanelOpen ? 'active' : ''}`}
                                            onClick={() => { setContextPanelOpen(!contextPanelOpen); setShowProfileMenu(false); }}
                                        >
                                            <FiFilter size={16} />
                                            <span>Filters Panel</span>
                                            <span className="profile-item-badge">{contextPanelOpen ? 'ON' : 'OFF'}</span>
                                        </button>
                                        <button className="profile-item" onClick={() => setShowProfileMenu(false)}>
                                            <FiSettings size={16} />
                                            <span>Preferences</span>
                                        </button>
                                    </div>

                                    <div className="profile-section">
                                        <div className="profile-section-title">Data Sources</div>
                                        {mockDataSources.map(source => (
                                            <div key={source.id} className="profile-item connector">
                                                <span className={`connector-status ${source.connected ? 'connected' : ''}`}></span>
                                                <span>{source.icon} {source.name}</span>
                                                <span className="profile-item-badge">{source.connected ? 'Connected' : 'Offline'}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="profile-divider"></div>

                                    <button className="profile-item logout" onClick={handleLogout}>
                                        <FiLogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Area with Context Panel */}
                <div className="main-area">
                    {/* Chat Area */}
                    <div className="chat-area" ref={chatAreaRef}>
                        {/* Playbook Progress */}
                        {activePlaybook && (
                            <div className="playbook-progress">
                                <div className="playbook-progress-header">
                                    <span className="playbook-progress-icon">{activePlaybook.icon}</span>
                                    <span className="playbook-progress-title">{activePlaybook.name}</span>
                                    <button className="playbook-close" onClick={() => setActivePlaybook(null)}><FiX size={16} /></button>
                                </div>
                                <div className="playbook-steps">
                                    {activePlaybook.steps.map((step, idx) => (
                                        <div key={step.id} className={`playbook-step ${idx === playbookStep ? 'active' : ''} ${idx < playbookStep ? 'completed' : ''}`}>
                                            <div className="step-dot">{idx < playbookStep ? '✓' : idx + 1}</div>
                                            <span>{step.title}</span>
                                        </div>
                                    ))}
                                </div>
                                {playbookStep < activePlaybook.steps.length - 1 && (
                                    <button className="playbook-next" onClick={nextPlaybookStep}>
                                        Next: {activePlaybook.steps[playbookStep + 1]?.title} <FiChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                        )}

                        {!activeChat || activeChat.messages.length === 0 ? (
                            <div className="welcome-container fade-in">
                                <div className="welcome-icon">Q</div>
                                <h1 className="welcome-title">Welcome to AskQ</h1>
                                <p className="welcome-text">
                                    Your AI-powered assistant for enterprise data. Ask questions in plain English
                                    and get insights from <strong>SAP</strong>, <strong>RAMCO ERP</strong>, and <strong>EHR</strong> systems.
                                </p>

                                {/* Quick Start Playbooks */}
                                <div className="welcome-playbooks">
                                    <h3>📋 Quick Start Playbooks</h3>
                                    <div className="playbook-chips">
                                        {mockPlaybooks.map(pb => (
                                            <button key={pb.id} className="playbook-chip" onClick={() => startPlaybook(pb)}>
                                                {pb.icon} {pb.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="welcome-suggestions">
                                    <h3>💡 Try asking</h3>
                                    <div className="suggestion-chips">
                                        {quickSuggestions.map((s, i) => (
                                            <button key={i} className="suggestion-chip" onClick={() => sendMessage(s.label)}>
                                                {s.icon} {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            activeChat.messages.map((message) => (
                                <div key={message.id} className={`message ${message.sender}`}>
                                    <div className="message-avatar">
                                        {message.sender === 'user' ? (loginEmail ? loginEmail[0].toUpperCase() : 'U') : 'Q'}
                                    </div>
                                    <div className="message-content">
                                        {message.sender === 'assistant' && message.title ? (
                                            /* Structured Analytics Card */
                                            <div className="analytics-card">
                                                <div className="card-header">
                                                    <h3 className="card-title">{message.title}</h3>
                                                    <div className="card-actions">
                                                        <button
                                                            className={`card-action ${pinnedMessages.has(message.id) ? 'active' : ''}`}
                                                            onClick={() => handlePin(message.id)}
                                                            title="Pin"
                                                        >
                                                            <FiBookmark size={14} />
                                                        </button>
                                                        <button className="card-action" onClick={handleShare} title="Share">
                                                            <FiShare2 size={14} />
                                                        </button>
                                                        <button className="card-action" onClick={handleExport} title="Export">
                                                            <FiDownload size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {message.keyMetric && (
                                                    <div className="key-metric">
                                                        <div className="metric-value">{message.keyMetric.value}</div>
                                                        <div className="metric-label">{message.keyMetric.label}</div>
                                                        {message.keyMetric.change && (
                                                            <div className={`metric-change ${message.keyMetric.changeType}`}>
                                                                {message.keyMetric.change}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {renderTable(message)}

                                                {renderChart(message)}

                                                <div className="card-body">
                                                    <p>{message.content}</p>

                                                    {message.insights && message.insights.length > 0 && (
                                                        <div className="insights-list">
                                                            <h4>💡 Key Insights</h4>
                                                            <ul>
                                                                {message.insights.map((insight, i) => (
                                                                    <li key={i}>{insight}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>

                                                {message.drillDownOptions && message.drillDownOptions.length > 0 && (
                                                    <div className="drill-down-chips">
                                                        {message.drillDownOptions.map((option, i) => (
                                                            <button
                                                                key={i}
                                                                className="drill-chip"
                                                                onClick={() => handleDrillDown(option)}
                                                            >
                                                                <FiChevronRight size={14} /> {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="card-footer">
                                                    <div className="card-meta">
                                                        {message.confidence && (
                                                            <span className="meta-item confidence">
                                                                <span className="confidence-bar">
                                                                    <span style={{ width: `${message.confidence}%` }}></span>
                                                                </span>
                                                                {message.confidence}% confidence
                                                            </span>
                                                        )}
                                                        {message.lastRefresh && (
                                                            <span className="meta-item">
                                                                <FiClock size={12} /> {formatRelativeTime(message.lastRefresh)}
                                                            </span>
                                                        )}
                                                        {message.tablesUsed && (
                                                            <span className="meta-item">
                                                                <FiDatabase size={12} /> {message.tablesUsed.join(', ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="card-actions-row">
                                                        <button
                                                            className={`action-btn ${likedMessages[message.id] === 'liked' ? 'liked' : ''}`}
                                                            onClick={() => handleLike(message.id)}
                                                        >
                                                            <FiThumbsUp size={14} />
                                                        </button>
                                                        <button
                                                            className={`action-btn ${likedMessages[message.id] === 'disliked' ? 'disliked' : ''}`}
                                                            onClick={() => handleDislike(message.id)}
                                                        >
                                                            <FiThumbsDown size={14} />
                                                        </button>
                                                        <button
                                                            className={`action-btn ${copiedMessage === message.id ? 'copied' : ''}`}
                                                            onClick={() => handleCopy(message.content, message.id)}
                                                        >
                                                            {copiedMessage === message.id ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                                        </button>
                                                        <button
                                                            className={`action-btn ${showSqlQuery[message.id] ? 'active' : ''}`}
                                                            onClick={() => toggleSqlQuery(message.id)}
                                                        >
                                                            <FiCode size={14} />
                                                        </button>
                                                        <button className="action-btn" title="Explain">
                                                            <FiHelpCircle size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {showSqlQuery[message.id] && message.sqlQuery && (
                                                    <div className="sql-toggle slide-up">
                                                        <div className="sql-header">
                                                            <span>Generated SQL</span>
                                                            <button onClick={() => handleCopy(message.sqlQuery!, message.id + '-sql')}>
                                                                <FiCopy size={12} /> Copy
                                                            </button>
                                                        </div>
                                                        <pre className="sql-code">{message.sqlQuery}</pre>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* Simple User Message */
                                            <div className="message-bubble">
                                                <p>{message.content}</p>
                                            </div>
                                        )}

                                        <div className="message-timestamp">
                                            <span>{formatTime(message.timestamp)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Loading State */}
                        {isLoading && (
                            <div className="message assistant">
                                <div className="message-avatar">Q</div>
                                <div className="message-content">
                                    <div className="loading-card">
                                        <div className="loading-title">Processing your query...</div>
                                        <div className="loading-steps">
                                            {['Understanding question', 'Identifying tables', 'Generating SQL', 'Executing query', 'Analyzing results'].map((step, i) => (
                                                <div key={i} className={`loading-step ${i < loadingStep ? 'done' : ''} ${i === loadingStep ? 'active' : ''}`}>
                                                    <span className="step-icon">{i < loadingStep ? '✓' : i === loadingStep ? '●' : '○'}</span>
                                                    <span>{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Context Panel */}
                    {contextPanelOpen && (
                        <aside className="context-panel">
                            <div className="context-section">
                                <h4><FiCalendar size={14} /> Date Range</h4>
                                <select
                                    value={filterContext.dateRange.label}
                                    onChange={(e) => setFilterContext(prev => ({
                                        ...prev,
                                        dateRange: { ...prev.dateRange, label: e.target.value }
                                    }))}
                                >
                                    <option>Q1 2026</option>
                                    <option>Q4 2025</option>
                                    <option>Last 30 days</option>
                                    <option>Last 90 days</option>
                                    <option>Year to Date</option>
                                </select>
                            </div>

                            <div className="context-section">
                                <h4><FiDatabase size={14} /> Data Source</h4>
                                <select
                                    value={filterContext.dataSource}
                                    onChange={(e) => setFilterContext(prev => ({ ...prev, dataSource: e.target.value }))}
                                >
                                    {mockDataSources.filter(s => s.connected).map(source => (
                                        <option key={source.id}>{source.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="context-section">
                                <h4><FiFilter size={14} /> Filters</h4>
                                <button className="add-filter-btn">+ Add Filter</button>
                            </div>

                            <div className="context-section lineage">
                                <h4>📊 Data Lineage</h4>
                                <div className="lineage-items">
                                    <div className="lineage-item">
                                        <span>orders</span>
                                        <span className="lineage-count">1.2M rows</span>
                                    </div>
                                    <div className="lineage-item">
                                        <span>shipments</span>
                                        <span className="lineage-count">890K rows</span>
                                    </div>
                                </div>
                                <div className="lineage-refresh">
                                    <FiRefreshCw size={12} /> Last sync: 2h ago
                                </div>
                            </div>

                            <div className="context-section confidence">
                                <h4>🔒 Data Quality</h4>
                                <div className="confidence-meter">
                                    <div className="confidence-fill" style={{ width: '92%' }}></div>
                                </div>
                                <div className="confidence-text">92% data completeness</div>
                            </div>
                        </aside>
                    )}
                </div>

                {/* Chat Input */}
                <div className="chat-input-container">
                    <div className="chat-input-wrapper">
                        {/* Quick Suggestions */}
                        <div className="quick-suggestions">
                            {quickSuggestions.slice(0, 3).map((s, i) => (
                                <button key={i} className="quick-chip" onClick={() => sendMessage(s.label)}>
                                    {s.icon} {s.label}
                                </button>
                            ))}
                        </div>

                        <div className="chat-input">
                            <button
                                className={`voice-btn ${isRecording ? 'recording' : ''}`}
                                onClick={handleVoiceInput}
                            >
                                <FiMic />
                            </button>
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about your data..."
                                rows={1}
                                disabled={isLoading}
                            />
                            <button
                                className="send-btn"
                                onClick={() => sendMessage()}
                                disabled={!inputValue.trim() || isLoading}
                            >
                                <FiSend />
                            </button>
                        </div>
                        <div className="input-hint">
                            Press Enter to send • Shift+Enter for new line
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
