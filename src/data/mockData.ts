import { Chat, DataSource } from '../types';

export const mockDataSources: DataSource[] = [
    { id: '1', name: 'SAP ERP', type: 'SAP', icon: '🏢', connected: true },
    { id: '2', name: 'RAMCO ERP', type: 'RAMCO', icon: '📊', connected: true },
    { id: '3', name: 'Healthcare EHR', type: 'EHR', icon: '🏥', connected: false },
];

export const mockChats: Chat[] = [
    {
        id: '1',
        title: 'Orders shipped late analysis',
        createdAt: new Date(),
        updatedAt: new Date(),
        dataSource: 'SAP ERP',
        messages: [
            {
                id: '1',
                content: 'How many orders were shipped later than their promised delivery date?',
                sender: 'user',
                timestamp: new Date(Date.now() - 120000),
            },
            {
                id: '2',
                content: 'Based on my analysis of your SAP order data, I found that **847 orders** were shipped after their promised delivery date in the last quarter.\n\nHere\'s the breakdown:\n- **January**: 312 late orders (15.2% of total)\n- **February**: 298 late orders (14.1% of total)\n- **March**: 237 late orders (11.8% of total)\n\nThe primary reasons for delays were:\n1. Inventory shortages (42%)\n2. Logistics bottlenecks (31%)\n3. Production delays (27%)\n\nWould you like me to drill down into any specific category or time period?',
                sender: 'assistant',
                timestamp: new Date(Date.now() - 60000),
                sqlQuery: `SELECT COUNT(*) as late_orders, 
  MONTH(ship_date) as month,
  ROUND(COUNT(*) * 100.0 / 
    (SELECT COUNT(*) FROM orders), 1) as percentage
FROM orders 
WHERE ship_date > promised_delivery_date
  AND ship_date >= DATEADD(month, -3, GETDATE())
GROUP BY MONTH(ship_date)
ORDER BY month;`,
            },
        ],
    },
    {
        id: '2',
        title: 'Revenue by product category',
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
        dataSource: 'SAP ERP',
        messages: [],
    },
    {
        id: '3',
        title: 'Employee attendance report',
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000),
        dataSource: 'RAMCO ERP',
        messages: [],
    },
    {
        id: '4',
        title: 'Inventory stock levels',
        createdAt: new Date(Date.now() - 259200000),
        updatedAt: new Date(Date.now() - 259200000),
        dataSource: 'SAP ERP',
        messages: [],
    },
    {
        id: '5',
        title: 'Patient admission trends',
        createdAt: new Date(Date.now() - 604800000),
        updatedAt: new Date(Date.now() - 604800000),
        dataSource: 'Healthcare EHR',
        messages: [],
    },
];

export const welcomeMessages = [
    "Hello! I'm **AskQ**, your AI-powered assistant for enterprise data.",
    "I can help you query and analyze data from your connected systems like **SAP**, **RAMCO ERP**, and **EHR** databases.",
    "Simply ask me questions in plain English, and I'll translate them into insights from your data.",
    "\n**Try asking:**\n- \"What were last month's top-selling products?\"\n- \"Show me employees with pending leave requests\"\n- \"How many patients were admitted this week?\"",
];
