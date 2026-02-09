// Mock Database - Enterprise Data for AskQ
// Contains realistic data for SAP ERP, RAMCO, and Healthcare systems

// ============ SALES & ORDERS DATA ============
export const salesOrders = [
    { id: 'SO-2026-001', customer: 'Acme Corp', region: 'North', product: 'Industrial Pump A', quantity: 150, unitPrice: 2500, total: 375000, status: 'Delivered', orderDate: '2026-01-05', deliveryDate: '2026-01-12', plant: 'Plant-TX' },
    { id: 'SO-2026-002', customer: 'TechFlow Inc', region: 'West', product: 'Control Valve B', quantity: 200, unitPrice: 1800, total: 360000, status: 'Delivered', orderDate: '2026-01-08', deliveryDate: '2026-01-15', plant: 'Plant-CA' },
    { id: 'SO-2026-003', customer: 'Global Mfg', region: 'East', product: 'Pressure Sensor C', quantity: 500, unitPrice: 450, total: 225000, status: 'Delivered', orderDate: '2026-01-10', deliveryDate: '2026-01-18', plant: 'Plant-NY' },
    { id: 'SO-2026-004', customer: 'Prime Industries', region: 'South', product: 'Flow Meter D', quantity: 75, unitPrice: 3200, total: 240000, status: 'In Transit', orderDate: '2026-01-12', deliveryDate: '2026-01-22', plant: 'Plant-FL' },
    { id: 'SO-2026-005', customer: 'Vertex Solutions', region: 'North', product: 'Industrial Pump A', quantity: 100, unitPrice: 2500, total: 250000, status: 'Delivered', orderDate: '2026-01-15', deliveryDate: '2026-01-23', plant: 'Plant-TX' },
    { id: 'SO-2026-006', customer: 'Omega Tech', region: 'West', product: 'Control Valve B', quantity: 300, unitPrice: 1800, total: 540000, status: 'Delivered', orderDate: '2026-01-18', deliveryDate: '2026-01-26', plant: 'Plant-CA' },
    { id: 'SO-2026-007', customer: 'Atlas Group', region: 'East', product: 'Hydraulic Actuator E', quantity: 50, unitPrice: 5500, total: 275000, status: 'Pending', orderDate: '2026-01-20', deliveryDate: null, plant: 'Plant-NY' },
    { id: 'SO-2026-008', customer: 'Pinnacle Corp', region: 'Central', product: 'Pressure Sensor C', quantity: 800, unitPrice: 450, total: 360000, status: 'Delivered', orderDate: '2026-01-22', deliveryDate: '2026-01-30', plant: 'Plant-IL' },
    { id: 'SO-2026-009', customer: 'Summit Enterprises', region: 'North', product: 'Flow Meter D', quantity: 120, unitPrice: 3200, total: 384000, status: 'Delivered', orderDate: '2026-01-25', deliveryDate: '2026-02-02', plant: 'Plant-TX' },
    { id: 'SO-2026-010', customer: 'Horizon Ltd', region: 'South', product: 'Industrial Pump A', quantity: 80, unitPrice: 2500, total: 200000, status: 'In Transit', orderDate: '2026-01-28', deliveryDate: '2026-02-05', plant: 'Plant-FL' },
    { id: 'SO-2026-011', customer: 'Nexus Manufacturing', region: 'West', product: 'Control Valve B', quantity: 250, unitPrice: 1800, total: 450000, status: 'Delivered', orderDate: '2026-02-01', deliveryDate: '2026-02-08', plant: 'Plant-CA' },
    { id: 'SO-2026-012', customer: 'Quantum Industries', region: 'East', product: 'Hydraulic Actuator E', quantity: 40, unitPrice: 5500, total: 220000, status: 'Delivered', orderDate: '2026-02-03', deliveryDate: '2026-02-10', plant: 'Plant-NY' },
];

// ============ REVENUE BY MONTH ============
export const monthlyRevenue = [
    { month: 'Jan 2025', revenue: 3200000, target: 3000000, orders: 145, region: 'All' },
    { month: 'Feb 2025', revenue: 2850000, target: 3100000, orders: 132, region: 'All' },
    { month: 'Mar 2025', revenue: 3650000, target: 3200000, orders: 168, region: 'All' },
    { month: 'Apr 2025', revenue: 3100000, target: 3300000, orders: 142, region: 'All' },
    { month: 'May 2025', revenue: 3850000, target: 3400000, orders: 175, region: 'All' },
    { month: 'Jun 2025', revenue: 4200000, target: 3500000, orders: 189, region: 'All' },
    { month: 'Jul 2025', revenue: 3950000, target: 3600000, orders: 178, region: 'All' },
    { month: 'Aug 2025', revenue: 4100000, target: 3700000, orders: 185, region: 'All' },
    { month: 'Sep 2025', revenue: 4350000, target: 3800000, orders: 195, region: 'All' },
    { month: 'Oct 2025', revenue: 4600000, target: 3900000, orders: 208, region: 'All' },
    { month: 'Nov 2025', revenue: 4450000, target: 4000000, orders: 201, region: 'All' },
    { month: 'Dec 2025', revenue: 5200000, target: 4200000, orders: 235, region: 'All' },
    { month: 'Jan 2026', revenue: 4800000, target: 4300000, orders: 218, region: 'All' },
    { month: 'Feb 2026', revenue: 4250000, target: 4400000, orders: 192, region: 'All' },
];

// ============ REVENUE BY REGION ============
export const revenueByRegion = [
    { region: 'North', revenue: 4250000, percentage: 28, growth: 12.5, customers: 45 },
    { region: 'West', revenue: 3800000, percentage: 25, growth: 8.3, customers: 38 },
    { region: 'East', revenue: 3200000, percentage: 21, growth: 15.2, customers: 32 },
    { region: 'South', revenue: 2450000, percentage: 16, growth: 5.8, customers: 28 },
    { region: 'Central', revenue: 1550000, percentage: 10, growth: 22.1, customers: 18 },
];

// ============ TOP CUSTOMERS ============
export const topCustomers = [
    { id: 'C001', name: 'Omega Tech', revenue: 2850000, orders: 45, avgOrderValue: 63333, region: 'West', since: '2019' },
    { id: 'C002', name: 'Acme Corp', revenue: 2450000, orders: 38, avgOrderValue: 64474, region: 'North', since: '2018' },
    { id: 'C003', name: 'Global Mfg', revenue: 1980000, orders: 52, avgOrderValue: 38077, region: 'East', since: '2020' },
    { id: 'C004', name: 'TechFlow Inc', revenue: 1750000, orders: 31, avgOrderValue: 56452, region: 'West', since: '2021' },
    { id: 'C005', name: 'Prime Industries', revenue: 1620000, orders: 28, avgOrderValue: 57857, region: 'South', since: '2019' },
    { id: 'C006', name: 'Nexus Manufacturing', revenue: 1450000, orders: 35, avgOrderValue: 41429, region: 'West', since: '2020' },
    { id: 'C007', name: 'Summit Enterprises', revenue: 1380000, orders: 24, avgOrderValue: 57500, region: 'North', since: '2022' },
    { id: 'C008', name: 'Quantum Industries', revenue: 1250000, orders: 22, avgOrderValue: 56818, region: 'East', since: '2021' },
    { id: 'C009', name: 'Horizon Ltd', revenue: 1120000, orders: 29, avgOrderValue: 38621, region: 'South', since: '2020' },
    { id: 'C010', name: 'Atlas Group', revenue: 980000, orders: 18, avgOrderValue: 54444, region: 'East', since: '2023' },
];

// ============ PRODUCTS ============
export const products = [
    { id: 'P001', name: 'Industrial Pump A', category: 'Pumps', unitPrice: 2500, stock: 450, reorderLevel: 100, unitsSold: 1250, revenue: 3125000 },
    { id: 'P002', name: 'Control Valve B', category: 'Valves', unitPrice: 1800, stock: 680, reorderLevel: 150, unitsSold: 1850, revenue: 3330000 },
    { id: 'P003', name: 'Pressure Sensor C', category: 'Sensors', unitPrice: 450, stock: 2200, reorderLevel: 500, unitsSold: 4500, revenue: 2025000 },
    { id: 'P004', name: 'Flow Meter D', category: 'Meters', unitPrice: 3200, stock: 180, reorderLevel: 50, unitsSold: 620, revenue: 1984000 },
    { id: 'P005', name: 'Hydraulic Actuator E', category: 'Actuators', unitPrice: 5500, stock: 95, reorderLevel: 25, unitsSold: 280, revenue: 1540000 },
    { id: 'P006', name: 'Temperature Controller F', category: 'Controllers', unitPrice: 1200, stock: 520, reorderLevel: 100, unitsSold: 980, revenue: 1176000 },
    { id: 'P007', name: 'Pneumatic Cylinder G', category: 'Cylinders', unitPrice: 850, stock: 890, reorderLevel: 200, unitsSold: 1650, revenue: 1402500 },
    { id: 'P008', name: 'Electric Motor H', category: 'Motors', unitPrice: 4200, stock: 125, reorderLevel: 30, unitsSold: 410, revenue: 1722000 },
];

// ============ INVENTORY ============
export const inventory = [
    { id: 'INV001', product: 'Industrial Pump A', warehouse: 'WH-TX', quantity: 180, value: 450000, lastUpdated: '2026-02-08', status: 'Adequate' },
    { id: 'INV002', product: 'Industrial Pump A', warehouse: 'WH-CA', quantity: 150, value: 375000, lastUpdated: '2026-02-08', status: 'Adequate' },
    { id: 'INV003', product: 'Industrial Pump A', warehouse: 'WH-NY', quantity: 120, value: 300000, lastUpdated: '2026-02-08', status: 'Adequate' },
    { id: 'INV004', product: 'Control Valve B', warehouse: 'WH-TX', quantity: 250, value: 450000, lastUpdated: '2026-02-08', status: 'Overstocked' },
    { id: 'INV005', product: 'Control Valve B', warehouse: 'WH-CA', quantity: 280, value: 504000, lastUpdated: '2026-02-08', status: 'Overstocked' },
    { id: 'INV006', product: 'Control Valve B', warehouse: 'WH-NY', quantity: 150, value: 270000, lastUpdated: '2026-02-08', status: 'Adequate' },
    { id: 'INV007', product: 'Pressure Sensor C', warehouse: 'WH-TX', quantity: 800, value: 360000, lastUpdated: '2026-02-08', status: 'Adequate' },
    { id: 'INV008', product: 'Pressure Sensor C', warehouse: 'WH-CA', quantity: 900, value: 405000, lastUpdated: '2026-02-08', status: 'Overstocked' },
    { id: 'INV009', product: 'Flow Meter D', warehouse: 'WH-TX', quantity: 45, value: 144000, lastUpdated: '2026-02-08', status: 'Low Stock' },
    { id: 'INV010', product: 'Flow Meter D', warehouse: 'WH-CA', quantity: 85, value: 272000, lastUpdated: '2026-02-08', status: 'Adequate' },
    { id: 'INV011', product: 'Hydraulic Actuator E', warehouse: 'WH-NY', quantity: 25, value: 137500, lastUpdated: '2026-02-08', status: 'Low Stock' },
    { id: 'INV012', product: 'Electric Motor H', warehouse: 'WH-TX', quantity: 18, value: 75600, lastUpdated: '2026-02-08', status: 'Critical' },
];

// ============ ORDER FULFILLMENT ============
export const orderFulfillment = [
    { month: 'Jan 2026', totalOrders: 218, onTime: 195, late: 18, cancelled: 5, fulfillmentRate: 89.4 },
    { month: 'Dec 2025', totalOrders: 235, onTime: 218, late: 12, cancelled: 5, fulfillmentRate: 92.8 },
    { month: 'Nov 2025', totalOrders: 201, onTime: 182, late: 15, cancelled: 4, fulfillmentRate: 90.5 },
    { month: 'Oct 2025', totalOrders: 208, onTime: 188, late: 16, cancelled: 4, fulfillmentRate: 90.4 },
    { month: 'Sep 2025', totalOrders: 195, onTime: 175, late: 17, cancelled: 3, fulfillmentRate: 89.7 },
    { month: 'Aug 2025', totalOrders: 185, onTime: 168, late: 14, cancelled: 3, fulfillmentRate: 90.8 },
];

// ============ LATE ORDERS BY PLANT ============
export const lateOrdersByPlant = [
    { plant: 'Plant-TX', lateOrders: 8, totalOrders: 52, latePercentage: 15.4, avgDelayDays: 3.2 },
    { plant: 'Plant-CA', lateOrders: 5, totalOrders: 48, latePercentage: 10.4, avgDelayDays: 2.1 },
    { plant: 'Plant-NY', lateOrders: 3, totalOrders: 45, latePercentage: 6.7, avgDelayDays: 1.8 },
    { plant: 'Plant-FL', lateOrders: 2, totalOrders: 38, latePercentage: 5.3, avgDelayDays: 1.5 },
    { plant: 'Plant-IL', lateOrders: 0, totalOrders: 35, latePercentage: 0, avgDelayDays: 0 },
];

// ============ INVOICES ============
export const invoices = [
    { id: 'INV-2026-001', customer: 'Acme Corp', amount: 375000, status: 'Paid', dueDate: '2026-02-05', paidDate: '2026-02-03', daysOverdue: 0 },
    { id: 'INV-2026-002', customer: 'TechFlow Inc', amount: 360000, status: 'Paid', dueDate: '2026-02-08', paidDate: '2026-02-07', daysOverdue: 0 },
    { id: 'INV-2026-003', customer: 'Global Mfg', amount: 225000, status: 'Overdue', dueDate: '2026-02-01', paidDate: null, daysOverdue: 8 },
    { id: 'INV-2026-004', customer: 'Prime Industries', amount: 240000, status: 'Pending', dueDate: '2026-02-15', paidDate: null, daysOverdue: 0 },
    { id: 'INV-2026-005', customer: 'Vertex Solutions', amount: 250000, status: 'Paid', dueDate: '2026-02-10', paidDate: '2026-02-09', daysOverdue: 0 },
    { id: 'INV-2026-006', customer: 'Omega Tech', amount: 540000, status: 'Paid', dueDate: '2026-02-12', paidDate: '2026-02-11', daysOverdue: 0 },
    { id: 'INV-2026-007', customer: 'Atlas Group', amount: 275000, status: 'Overdue', dueDate: '2026-01-28', paidDate: null, daysOverdue: 12 },
    { id: 'INV-2026-008', customer: 'Pinnacle Corp', amount: 360000, status: 'Paid', dueDate: '2026-02-06', paidDate: '2026-02-05', daysOverdue: 0 },
];

// ============ EXPENSES ============
export const expenses = [
    { category: 'Raw Materials', amount: 2850000, percentage: 38, trend: 'up', change: 5.2 },
    { category: 'Labor', amount: 1650000, percentage: 22, trend: 'stable', change: 1.1 },
    { category: 'Logistics', amount: 980000, percentage: 13, trend: 'up', change: 8.5 },
    { category: 'Utilities', amount: 520000, percentage: 7, trend: 'down', change: -3.2 },
    { category: 'Maintenance', amount: 450000, percentage: 6, trend: 'stable', change: 0.8 },
    { category: 'Marketing', amount: 380000, percentage: 5, trend: 'up', change: 12.3 },
    { category: 'R&D', amount: 420000, percentage: 6, trend: 'up', change: 15.8 },
    { category: 'Admin', amount: 250000, percentage: 3, trend: 'down', change: -2.1 },
];

// ============ SUPPLIERS ============
export const suppliers = [
    { id: 'SUP001', name: 'SteelWorks Global', category: 'Raw Materials', ordersPlaced: 45, totalSpend: 1250000, onTimeDelivery: 94, rating: 4.5 },
    { id: 'SUP002', name: 'PrecisionParts Inc', category: 'Components', ordersPlaced: 68, totalSpend: 890000, onTimeDelivery: 91, rating: 4.2 },
    { id: 'SUP003', name: 'ElectroCom', category: 'Electronics', ordersPlaced: 52, totalSpend: 650000, onTimeDelivery: 88, rating: 3.9 },
    { id: 'SUP004', name: 'ChemSource Ltd', category: 'Chemicals', ordersPlaced: 28, totalSpend: 420000, onTimeDelivery: 96, rating: 4.7 },
    { id: 'SUP005', name: 'PackRight Solutions', category: 'Packaging', ordersPlaced: 35, totalSpend: 180000, onTimeDelivery: 92, rating: 4.3 },
];

// ============ EMPLOYEES ============
export const employees = [
    { id: 'EMP001', name: 'John Smith', department: 'Sales', role: 'Sales Manager', performance: 95, sales: 2850000, region: 'North' },
    { id: 'EMP002', name: 'Sarah Johnson', department: 'Sales', role: 'Account Executive', performance: 92, sales: 1950000, region: 'West' },
    { id: 'EMP003', name: 'Mike Chen', department: 'Operations', role: 'Plant Manager', performance: 88, sales: 0, region: 'East' },
    { id: 'EMP004', name: 'Emily Davis', department: 'Sales', role: 'Account Executive', performance: 87, sales: 1680000, region: 'South' },
    { id: 'EMP005', name: 'Robert Wilson', department: 'Finance', role: 'Controller', performance: 91, sales: 0, region: 'Central' },
];

// ============ HELPER FUNCTIONS ============
export const formatCurrency = (value: number): string => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
};

export const formatNumber = (value: number): string => {
    return value.toLocaleString();
};

export const calculatePercentChange = (current: number, previous: number): { value: string; type: 'positive' | 'negative' | 'neutral' } => {
    const change = ((current - previous) / previous) * 100;
    return {
        value: change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`,
        type: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'
    };
};

// ============ SQL QUERY SIMULATOR ============
export const simulateSQLQuery = (query: string): { sql: string; executionTime: number; rowsAffected: number } => {
    return {
        sql: query,
        executionTime: Math.floor(Math.random() * 500) + 50,
        rowsAffected: Math.floor(Math.random() * 1000) + 10
    };
};
