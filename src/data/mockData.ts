import type { Chat, DataSource, Playbook, SavedInsight, FilterContext } from '../types';

export const mockDataSources: DataSource[] = [
    { id: '1', name: 'SAP ERP', type: 'SAP', icon: '🏢', connected: true, lastSync: new Date(Date.now() - 7200000), tables: 142, rows: '2.4M' },
    { id: '2', name: 'RAMCO ERP', type: 'RAMCO', icon: '📊', connected: true, lastSync: new Date(Date.now() - 3600000), tables: 89, rows: '1.1M' },
    { id: '3', name: 'Healthcare EHR', type: 'EHR', icon: '🏥', connected: false },
];

export const defaultFilterContext: FilterContext = {
    dateRange: {
        start: new Date(2026, 0, 1),
        end: new Date(2026, 2, 31),
        label: 'Q1 2026',
    },
    dataSource: 'SAP ERP',
    filters: [],
};

export const mockPlaybooks: Playbook[] = [
    {
        id: '1',
        name: 'Order Fulfillment Health',
        description: 'Analyze late orders, identify root causes, and get recommendations',
        icon: '📦',
        category: 'Operations',
        steps: [
            { id: '1', title: 'Overall Metrics', query: 'Show me late order metrics for this quarter', description: 'Get the big picture' },
            { id: '2', title: 'By Plant', query: 'Break down late orders by plant', description: 'Find problem areas' },
            { id: '3', title: 'Root Causes', query: 'What are the main causes of late shipments?', description: 'Understand why' },
            { id: '4', title: 'Recommendations', query: 'What actions can reduce late orders?', description: 'Get actionable steps' },
        ],
    },
    {
        id: '2',
        name: 'Month-End Close',
        description: 'Financial health check for month-end reporting',
        icon: '📅',
        category: 'Finance',
        steps: [
            { id: '1', title: 'Revenue Summary', query: 'Show revenue vs target for this month', description: 'Top-line performance' },
            { id: '2', title: 'Pending Items', query: 'What invoices are pending?', description: 'Items to close' },
            { id: '3', title: 'Discrepancies', query: 'Show any reconciliation issues', description: 'Fix before close' },
        ],
    },
    {
        id: '3',
        name: 'Inventory Optimization',
        description: 'Review stock levels and identify optimization opportunities',
        icon: '📋',
        category: 'Operations',
        steps: [
            { id: '1', title: 'Stock Levels', query: 'Show current inventory levels by category', description: 'Current state' },
            { id: '2', title: 'Slow Moving', query: 'Which items have low turnover?', description: 'Dead stock' },
            { id: '3', title: 'Stockouts Risk', query: 'Which items are at risk of stockout?', description: 'Prevent shortages' },
        ],
    },
];

export const mockSavedInsights: SavedInsight[] = [
    {
        id: '1',
        name: 'Monthly Revenue Tracker',
        description: 'Revenue vs target by month',
        query: 'Show monthly revenue vs target for 2026',
        tags: ['finance', 'revenue', 'monthly'],
        createdAt: new Date(Date.now() - 604800000),
        updatedAt: new Date(Date.now() - 172800000),
        createdBy: 'User',
        schedule: {
            frequency: 'weekly',
            time: '08:00',
            recipients: ['finance-team@company.com'],
        },
    },
    {
        id: '2',
        name: 'Late Orders Dashboard',
        description: 'Order fulfillment health metrics',
        query: 'Show late orders analysis',
        tags: ['operations', 'orders'],
        createdAt: new Date(Date.now() - 259200000),
        updatedAt: new Date(),
        createdBy: 'User',
    },
];

export const mockChats: Chat[] = [
    {
        id: '1',
        title: 'Late orders analysis',
        createdAt: new Date(),
        updatedAt: new Date(),
        dataSource: 'SAP ERP',
        isPinned: true,
        messages: [
            {
                id: '1',
                content: 'How many orders were shipped later than their promised delivery date?',
                sender: 'user',
                timestamp: new Date(Date.now() - 120000),
            },
            {
                id: '2',
                content: 'Based on my analysis of your SAP order data, I found significant late shipment issues in Q1 2026.',
                sender: 'assistant',
                timestamp: new Date(Date.now() - 60000),
                title: 'Late Orders Analysis - Q1 2026',
                keyMetric: {
                    value: '847',
                    label: 'Orders shipped late',
                    change: '+12% vs Q4',
                    changeType: 'negative',
                },
                chartData: {
                    type: 'bar',
                    data: [
                        { month: 'Jan', late: 312, onTime: 1742 },
                        { month: 'Feb', late: 298, onTime: 1815 },
                        { month: 'Mar', late: 237, onTime: 1889 },
                    ],
                    xKey: 'month',
                    yKey: 'late',
                },
                insights: [
                    'January had the highest late orders (312) due to inventory shortages',
                    'March showed 24% improvement as supply chain stabilized',
                    'Plant Chicago accounts for 42% of all late orders',
                ],
                drillDownOptions: [
                    { label: 'By Plant', icon: '🏭', query: 'Break down late orders by plant' },
                    { label: 'By Customer', icon: '👥', query: 'Which customers were most affected?' },
                    { label: 'By Cause', icon: '🔍', query: 'What caused the delays?' },
                ],
                sqlQuery: `SELECT 
  MONTH(ship_date) as month,
  COUNT(*) as late_orders,
  ROUND(COUNT(*) * 100.0 / total_orders, 1) as percentage
FROM orders 
WHERE ship_date > promised_delivery_date
  AND ship_date >= '2026-01-01'
GROUP BY MONTH(ship_date)
ORDER BY month;`,
                confidence: 92,
                tablesUsed: ['orders', 'shipments', 'customers'],
                lastRefresh: new Date(Date.now() - 7200000),
            },
        ],
    },
    {
        id: '2',
        title: 'Revenue by region',
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
        dataSource: 'SAP ERP',
        messages: [],
    },
    {
        id: '3',
        title: 'Inventory levels check',
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000),
        dataSource: 'RAMCO ERP',
        messages: [],
    },
];

export const quickSuggestions = [
    { label: 'Late orders by plant', icon: '🏭' },
    { label: 'Revenue vs target', icon: '💰' },
    { label: 'Top 10 customers', icon: '👥' },
    { label: 'Inventory levels', icon: '📦' },
];

export const generateAnalyticsResponse = (query: string): Partial<import('../types').Message> => {
    // Simulate different response types based on query keywords
    if (query.toLowerCase().includes('revenue') || query.toLowerCase().includes('sales')) {
        return {
            title: 'Revenue Analysis',
            keyMetric: {
                value: '$4.2M',
                label: 'Total Revenue',
                change: '+8.5% vs last month',
                changeType: 'positive',
            },
            chartData: {
                type: 'bar',
                data: [
                    { month: 'Jan', revenue: 1200000, target: 1100000 },
                    { month: 'Feb', revenue: 1450000, target: 1300000 },
                    { month: 'Mar', revenue: 1550000, target: 1400000 },
                ],
                xKey: 'month',
                yKey: 'revenue',
            },
            insights: [
                'Revenue exceeded target by 8.5% this quarter',
                'February saw the highest growth at 12% MoM',
                'North region contributes 45% of total revenue',
            ],
            drillDownOptions: [
                { label: 'By Region', icon: '🗺️', query: 'Break down revenue by region' },
                { label: 'By Product', icon: '📦', query: 'Revenue by product category' },
                { label: 'Trend', icon: '📈', query: 'Show 6-month revenue trend' },
            ],
            confidence: 95,
            tablesUsed: ['sales', 'invoices', 'customers'],
        };
    }

    if (query.toLowerCase().includes('inventory') || query.toLowerCase().includes('stock')) {
        return {
            title: 'Inventory Status',
            keyMetric: {
                value: '12,450',
                label: 'Total SKUs',
                change: '234 at risk',
                changeType: 'negative',
            },
            chartData: {
                type: 'pie',
                data: [
                    { name: 'Healthy', value: 8500, color: '#4caf50' },
                    { name: 'Low', value: 2200, color: '#ff9800' },
                    { name: 'Critical', value: 1516, color: '#f44336' },
                    { name: 'Stockout', value: 234, color: '#9c27b0' },
                ],
            },
            insights: [
                '234 items currently out of stock',
                '1,516 items at critical levels (< 1 week)',
                'Electronics category has the highest stockout rate',
            ],
            drillDownOptions: [
                { label: 'By Category', icon: '📂', query: 'Inventory by category' },
                { label: 'Stockouts', icon: '⚠️', query: 'Show all stockout items' },
                { label: 'Reorder', icon: '🔄', query: 'Items needing reorder' },
            ],
            confidence: 88,
            tablesUsed: ['inventory', 'products', 'warehouses'],
        };
    }

    // Default response
    return {
        title: 'Query Results',
        keyMetric: {
            value: '1,234',
            label: 'Records found',
            changeType: 'neutral',
        },
        insights: [
            'Query executed successfully',
            'Results based on current data snapshot',
        ],
        drillDownOptions: [
            { label: 'Details', icon: '📋', query: 'Show more details' },
            { label: 'Export', icon: '📥', query: 'Export to CSV' },
        ],
        confidence: 85,
        tablesUsed: ['data'],
    };
};
