// Smart Query Analyzer and Response Generator
// Analyzes user questions and generates appropriate data responses

import {
    salesOrders,
    monthlyRevenue,
    revenueByRegion,
    topCustomers,
    products,
    inventory,
    orderFulfillment,
    lateOrdersByPlant,
    invoices,
    expenses,
    suppliers,
    employees,
    formatCurrency,
} from './mockDatabase';

export interface TableColumn {
    key: string;
    label: string;
    type: 'text' | 'number' | 'currency' | 'percentage' | 'status';
}

export interface TableData {
    columns: TableColumn[];
    rows: Record<string, any>[];
    title: string;
}

export interface ChartDataPoint {
    name: string;
    value?: number;
    revenue?: number;
    target?: number;
    orders?: number;
    [key: string]: any;
}

export interface AnalyticsResponse {
    title: string;
    content: string;
    keyMetric?: {
        value: string;
        label: string;
        change: string;
        changeType: 'positive' | 'negative' | 'neutral';
    };
    tableData?: TableData;
    chartData?: {
        type: 'bar' | 'line' | 'pie' | 'area';
        data: ChartDataPoint[];
        xKey?: string;
        yKey?: string;
        colors?: string[];
    };
    insights: string[];
    drillDownOptions: string[];
    sqlQuery: string;
    tablesUsed: string[];
    confidence: number;
}

// Query pattern matching
const queryPatterns = {
    revenue: /revenue|sales|income|earnings|turnover/i,
    orders: /order|purchase|transaction|booking/i,
    customers: /customer|client|buyer|account/i,
    products: /product|item|sku|catalog|inventory/i,
    inventory: /inventory|stock|warehouse|supply/i,
    fulfillment: /fulfillment|delivery|shipping|late|delay/i,
    invoices: /invoice|payment|billing|overdue|receivable/i,
    expenses: /expense|cost|spending|budget/i,
    suppliers: /supplier|vendor|procurement/i,
    employees: /employee|staff|team|performance/i,
    trend: /trend|growth|change|month|quarter|year/i,
    top: /top|best|highest|leading|most/i,
    comparison: /compare|versus|vs|against/i,
    region: /region|area|territory|location/i,
    plant: /plant|factory|facility|manufacturing/i,
};

export function analyzeQuery(query: string): AnalyticsResponse {
    const lowerQuery = query.toLowerCase();

    // Detect query intent
    const hasRevenue = queryPatterns.revenue.test(lowerQuery);
    const hasOrders = queryPatterns.orders.test(lowerQuery);
    const hasCustomers = queryPatterns.customers.test(lowerQuery);
    const hasProducts = queryPatterns.products.test(lowerQuery);
    const hasInventory = queryPatterns.inventory.test(lowerQuery);
    const hasFulfillment = queryPatterns.fulfillment.test(lowerQuery);
    const hasInvoices = queryPatterns.invoices.test(lowerQuery);
    const hasExpenses = queryPatterns.expenses.test(lowerQuery);
    const hasSuppliers = queryPatterns.suppliers.test(lowerQuery);
    const hasEmployees = queryPatterns.employees.test(lowerQuery);
    const hasTrend = queryPatterns.trend.test(lowerQuery);
    const hasTop = queryPatterns.top.test(lowerQuery);
    const hasRegion = queryPatterns.region.test(lowerQuery);
    const hasPlant = queryPatterns.plant.test(lowerQuery);

    // Route to appropriate response generator
    if (hasRevenue && hasTrend) {
        return generateRevenueTrendResponse();
    } else if (hasRevenue && hasRegion) {
        return generateRevenueByRegionResponse();
    } else if (hasRevenue || (hasTop && !hasCustomers && !hasProducts)) {
        return generateRevenueOverviewResponse();
    } else if (hasTop && hasCustomers) {
        return generateTopCustomersResponse();
    } else if (hasTop && hasProducts) {
        return generateTopProductsResponse();
    } else if (hasOrders && (hasFulfillment || hasPlant)) {
        return generateOrderFulfillmentResponse();
    } else if (hasFulfillment || (hasOrders && queryPatterns.plant.test(lowerQuery))) {
        return generateLateOrdersResponse();
    } else if (hasInventory || hasProducts) {
        return generateInventoryResponse();
    } else if (hasInvoices) {
        return generateInvoicesResponse();
    } else if (hasExpenses) {
        return generateExpensesResponse();
    } else if (hasSuppliers) {
        return generateSuppliersResponse();
    } else if (hasEmployees) {
        return generateEmployeesResponse();
    } else if (hasOrders) {
        return generateOrdersResponse();
    } else if (hasCustomers) {
        return generateTopCustomersResponse();
    } else {
        return generateRevenueOverviewResponse();
    }
}

function generateRevenueTrendResponse(): AnalyticsResponse {
    const data = monthlyRevenue.slice(-6);
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    const change = ((current.revenue - previous.revenue) / previous.revenue * 100);

    return {
        title: 'Revenue Trend Analysis',
        content: `Revenue for ${current.month} is ${formatCurrency(current.revenue)}, showing a ${change >= 0 ? 'growth' : 'decline'} of ${Math.abs(change).toFixed(1)}% compared to ${previous.month}. The 6-month trend shows consistent growth with revenue exceeding targets in most months.`,
        keyMetric: {
            value: formatCurrency(current.revenue),
            label: `Revenue - ${current.month}`,
            change: `${change >= 0 ? '+' : ''}${change.toFixed(1)}% vs last month`,
            changeType: change >= 0 ? 'positive' : 'negative'
        },
        tableData: {
            title: 'Monthly Revenue Summary',
            columns: [
                { key: 'month', label: 'Month', type: 'text' },
                { key: 'revenue', label: 'Revenue', type: 'currency' },
                { key: 'target', label: 'Target', type: 'currency' },
                { key: 'orders', label: 'Orders', type: 'number' },
                { key: 'variance', label: 'Variance', type: 'percentage' }
            ],
            rows: data.slice(0, 5).map(d => ({
                ...d,
                variance: ((d.revenue - d.target) / d.target * 100).toFixed(1) + '%'
            }))
        },
        chartData: {
            type: 'line',
            data: data.map(d => ({ name: d.month.split(' ')[0], revenue: d.revenue, target: d.target })),
            xKey: 'name',
            yKey: 'revenue',
            colors: ['#1a7b8c', '#e53935']
        },
        insights: [
            `Revenue exceeded target by ${((current.revenue - current.target) / current.target * 100).toFixed(1)}% in ${current.month}`,
            `Average monthly revenue: ${formatCurrency(data.reduce((a, b) => a + b.revenue, 0) / data.length)}`,
            `Total orders in period: ${data.reduce((a, b) => a + b.orders, 0).toLocaleString()}`,
            'Q4 showed strongest performance with 23.8% YoY growth'
        ],
        drillDownOptions: ['By Region', 'By Product', 'By Customer', 'Compare YoY'],
        sqlQuery: `SELECT 
  DATE_FORMAT(order_date, '%b %Y') as month,
  SUM(total_amount) as revenue,
  COUNT(*) as orders
FROM sales_orders
WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY DATE_FORMAT(order_date, '%b %Y')
ORDER BY order_date DESC;`,
        tablesUsed: ['sales_orders', 'sales_targets'],
        confidence: 94
    };
}

function generateRevenueByRegionResponse(): AnalyticsResponse {
    const totalRevenue = revenueByRegion.reduce((a, b) => a + b.revenue, 0);
    const topRegion = revenueByRegion[0];

    return {
        title: 'Revenue by Region',
        content: `Total revenue across all regions is ${formatCurrency(totalRevenue)}. The ${topRegion.region} region leads with ${formatCurrency(topRegion.revenue)} (${topRegion.percentage}% of total), showing ${topRegion.growth}% growth.`,
        keyMetric: {
            value: formatCurrency(totalRevenue),
            label: 'Total Revenue',
            change: '+12.5% vs last quarter',
            changeType: 'positive'
        },
        tableData: {
            title: 'Top 5 Regions by Revenue',
            columns: [
                { key: 'region', label: 'Region', type: 'text' },
                { key: 'revenue', label: 'Revenue', type: 'currency' },
                { key: 'percentage', label: '% of Total', type: 'percentage' },
                { key: 'growth', label: 'Growth', type: 'percentage' },
                { key: 'customers', label: 'Customers', type: 'number' }
            ],
            rows: revenueByRegion.slice(0, 5)
        },
        chartData: {
            type: 'pie',
            data: revenueByRegion.map(r => ({ name: r.region, value: r.revenue })),
            colors: ['#1a7b8c', '#2196a8', '#4db6ac', '#80cbc4', '#b2dfdb']
        },
        insights: [
            `${topRegion.region} region dominates with ${topRegion.percentage}% market share`,
            `Central region shows highest growth at ${revenueByRegion.find(r => r.region === 'Central')?.growth}%`,
            `Total customers across all regions: ${revenueByRegion.reduce((a, b) => a + b.customers, 0)}`,
            'South region underperforming - potential for improvement'
        ],
        drillDownOptions: ['North Details', 'West Details', 'By Customer', 'By Product'],
        sqlQuery: `SELECT 
  r.region_name as region,
  SUM(so.total_amount) as revenue,
  ROUND(SUM(so.total_amount) * 100.0 / (SELECT SUM(total_amount) FROM sales_orders), 1) as percentage,
  COUNT(DISTINCT so.customer_id) as customers
FROM sales_orders so
JOIN regions r ON so.region_id = r.id
GROUP BY r.region_name
ORDER BY revenue DESC
LIMIT 5;`,
        tablesUsed: ['sales_orders', 'regions', 'customers'],
        confidence: 96
    };
}

function generateRevenueOverviewResponse(): AnalyticsResponse {
    const current = monthlyRevenue[monthlyRevenue.length - 1];
    const ytdRevenue = monthlyRevenue.filter(m => m.month.includes('2026')).reduce((a, b) => a + b.revenue, 0);

    return {
        title: 'Revenue Overview',
        content: `Current month revenue stands at ${formatCurrency(current.revenue)} with ${current.orders} orders processed. Year-to-date revenue is ${formatCurrency(ytdRevenue)}, tracking 8.5% above target.`,
        keyMetric: {
            value: formatCurrency(current.revenue),
            label: `${current.month} Revenue`,
            change: '+8.5% vs target',
            changeType: 'positive'
        },
        tableData: {
            title: 'Top 5 Recent Months',
            columns: [
                { key: 'month', label: 'Month', type: 'text' },
                { key: 'revenue', label: 'Revenue', type: 'currency' },
                { key: 'target', label: 'Target', type: 'currency' },
                { key: 'orders', label: 'Orders', type: 'number' }
            ],
            rows: monthlyRevenue.slice(-5).reverse()
        },
        chartData: {
            type: 'bar',
            data: monthlyRevenue.slice(-6).map(d => ({ name: d.month.split(' ')[0], revenue: d.revenue, target: d.target })),
            xKey: 'name',
            yKey: 'revenue',
            colors: ['#1a7b8c', '#e53935']
        },
        insights: [
            'Revenue consistently exceeding targets for 4 consecutive months',
            `Average order value: ${formatCurrency(current.revenue / current.orders)}`,
            'December showed peak performance with $5.2M revenue',
            'Q1 2026 on track to exceed Q4 2025'
        ],
        drillDownOptions: ['By Region', 'By Product', 'Top Customers', 'Trend Analysis'],
        sqlQuery: `SELECT 
  DATE_FORMAT(order_date, '%b %Y') as month,
  SUM(total_amount) as revenue,
  COUNT(*) as orders
FROM sales_orders
WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(order_date, '%b %Y')
ORDER BY order_date DESC
LIMIT 5;`,
        tablesUsed: ['sales_orders'],
        confidence: 95
    };
}

function generateTopCustomersResponse(): AnalyticsResponse {
    const topFive = topCustomers.slice(0, 5);
    const totalTopFiveRevenue = topFive.reduce((a, b) => a + b.revenue, 0);

    return {
        title: 'Top Customers Analysis',
        content: `Your top 5 customers generated ${formatCurrency(totalTopFiveRevenue)} in revenue. ${topFive[0].name} leads with ${formatCurrency(topFive[0].revenue)} across ${topFive[0].orders} orders.`,
        keyMetric: {
            value: formatCurrency(topFive[0].revenue),
            label: `${topFive[0].name}`,
            change: '+15.2% vs last year',
            changeType: 'positive'
        },
        tableData: {
            title: 'Top 5 Customers',
            columns: [
                { key: 'name', label: 'Customer', type: 'text' },
                { key: 'revenue', label: 'Revenue', type: 'currency' },
                { key: 'orders', label: 'Orders', type: 'number' },
                { key: 'avgOrderValue', label: 'Avg Order', type: 'currency' },
                { key: 'region', label: 'Region', type: 'text' }
            ],
            rows: topFive
        },
        chartData: {
            type: 'bar',
            data: topFive.map(c => ({ name: c.name.split(' ')[0], value: c.revenue })),
            xKey: 'name',
            yKey: 'value',
            colors: ['#1a7b8c']
        },
        insights: [
            `Top 5 customers represent ${(totalTopFiveRevenue / topCustomers.reduce((a, b) => a + b.revenue, 0) * 100).toFixed(0)}% of total revenue`,
            `Average order value across top customers: ${formatCurrency(topFive.reduce((a, b) => a + b.avgOrderValue, 0) / 5)}`,
            `${topFive[0].name} customer since ${topFive[0].since} - loyal partner`,
            'West region has highest concentration of top customers'
        ],
        drillDownOptions: ['Customer Details', 'Order History', 'By Product', 'Growth Trend'],
        sqlQuery: `SELECT 
  c.customer_name as name,
  SUM(so.total_amount) as revenue,
  COUNT(*) as orders,
  AVG(so.total_amount) as avgOrderValue,
  c.region
FROM customers c
JOIN sales_orders so ON c.id = so.customer_id
GROUP BY c.id, c.customer_name, c.region
ORDER BY revenue DESC
LIMIT 5;`,
        tablesUsed: ['customers', 'sales_orders'],
        confidence: 97
    };
}

function generateTopProductsResponse(): AnalyticsResponse {
    const topFive = products.slice(0, 5);
    const totalRevenue = topFive.reduce((a, b) => a + b.revenue, 0);

    return {
        title: 'Top Products Performance',
        content: `Your top 5 products generated ${formatCurrency(totalRevenue)} in revenue. ${topFive[0].name} is the best performer with ${formatCurrency(topFive[0].revenue)} from ${topFive[0].unitsSold.toLocaleString()} units sold.`,
        keyMetric: {
            value: formatCurrency(topFive[0].revenue),
            label: topFive[0].name,
            change: '+12.3% vs last quarter',
            changeType: 'positive'
        },
        tableData: {
            title: 'Top 5 Products',
            columns: [
                { key: 'name', label: 'Product', type: 'text' },
                { key: 'revenue', label: 'Revenue', type: 'currency' },
                { key: 'unitsSold', label: 'Units Sold', type: 'number' },
                { key: 'unitPrice', label: 'Unit Price', type: 'currency' },
                { key: 'stock', label: 'In Stock', type: 'number' }
            ],
            rows: topFive
        },
        chartData: {
            type: 'bar',
            data: topFive.map(p => ({ name: p.name.replace(/[A-Z]$/, ''), value: p.revenue })),
            xKey: 'name',
            yKey: 'value',
            colors: ['#1a7b8c']
        },
        insights: [
            `${topFive[1].name} has highest unit sales (${topFive[1].unitsSold.toLocaleString()} units)`,
            `Average unit price: ${formatCurrency(topFive.reduce((a, b) => a + b.unitPrice, 0) / 5)}`,
            `Valves category dominates with Control Valve B leading`,
            'Consider bundling slow movers with top performers'
        ],
        drillDownOptions: ['Inventory Status', 'By Category', 'Sales Trend', 'Margin Analysis'],
        sqlQuery: `SELECT 
  p.product_name as name,
  SUM(oi.quantity * oi.unit_price) as revenue,
  SUM(oi.quantity) as unitsSold,
  p.unit_price as unitPrice,
  p.stock_quantity as stock
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.product_name, p.unit_price, p.stock_quantity
ORDER BY revenue DESC
LIMIT 5;`,
        tablesUsed: ['products', 'order_items', 'sales_orders'],
        confidence: 95
    };
}

function generateOrderFulfillmentResponse(): AnalyticsResponse {
    const current = orderFulfillment[0];
    const previous = orderFulfillment[1];

    return {
        title: 'Order Fulfillment Analysis',
        content: `Current fulfillment rate is ${current.fulfillmentRate}% with ${current.onTime} orders delivered on time out of ${current.totalOrders}. ${current.late} orders were late and ${current.cancelled} cancelled.`,
        keyMetric: {
            value: `${current.fulfillmentRate}%`,
            label: 'On-Time Fulfillment Rate',
            change: `${(current.fulfillmentRate - previous.fulfillmentRate).toFixed(1)}% vs last month`,
            changeType: current.fulfillmentRate >= previous.fulfillmentRate ? 'positive' : 'negative'
        },
        tableData: {
            title: 'Fulfillment by Month',
            columns: [
                { key: 'month', label: 'Month', type: 'text' },
                { key: 'totalOrders', label: 'Total Orders', type: 'number' },
                { key: 'onTime', label: 'On Time', type: 'number' },
                { key: 'late', label: 'Late', type: 'number' },
                { key: 'fulfillmentRate', label: 'Rate %', type: 'percentage' }
            ],
            rows: orderFulfillment.slice(0, 5)
        },
        chartData: {
            type: 'line',
            data: orderFulfillment.slice(0, 6).reverse().map(d => ({ name: d.month.split(' ')[0], value: d.fulfillmentRate })),
            xKey: 'name',
            yKey: 'value',
            colors: ['#4caf50']
        },
        insights: [
            `${current.late} late orders this month - down from ${previous.late} last month`,
            'December had highest fulfillment rate at 92.8%',
            `Total cancelled orders YTD: ${orderFulfillment.reduce((a, b) => a + b.cancelled, 0)}`,
            'Plant-IL showing best on-time performance'
        ],
        drillDownOptions: ['Late Orders Detail', 'By Plant', 'By Product', 'Root Cause Analysis'],
        sqlQuery: `SELECT 
  DATE_FORMAT(order_date, '%b %Y') as month,
  COUNT(*) as totalOrders,
  SUM(CASE WHEN delivery_date <= expected_date THEN 1 ELSE 0 END) as onTime,
  SUM(CASE WHEN delivery_date > expected_date THEN 1 ELSE 0 END) as late,
  ROUND(SUM(CASE WHEN delivery_date <= expected_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) as fulfillmentRate
FROM sales_orders
WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY DATE_FORMAT(order_date, '%b %Y')
ORDER BY order_date DESC;`,
        tablesUsed: ['sales_orders', 'shipments'],
        confidence: 92
    };
}

function generateLateOrdersResponse(): AnalyticsResponse {
    const totalLate = lateOrdersByPlant.reduce((a, b) => a + b.lateOrders, 0);
    const worstPlant = lateOrdersByPlant[0];

    return {
        title: 'Late Orders by Plant',
        content: `There are ${totalLate} late orders across all plants. ${worstPlant.plant} has the highest with ${worstPlant.lateOrders} late orders (${worstPlant.latePercentage}% of their total), averaging ${worstPlant.avgDelayDays} days delay.`,
        keyMetric: {
            value: totalLate.toString(),
            label: 'Total Late Orders',
            change: '-15% vs last month',
            changeType: 'positive'
        },
        tableData: {
            title: 'Late Orders by Plant',
            columns: [
                { key: 'plant', label: 'Plant', type: 'text' },
                { key: 'lateOrders', label: 'Late Orders', type: 'number' },
                { key: 'totalOrders', label: 'Total Orders', type: 'number' },
                { key: 'latePercentage', label: 'Late %', type: 'percentage' },
                { key: 'avgDelayDays', label: 'Avg Delay (days)', type: 'number' }
            ],
            rows: lateOrdersByPlant.slice(0, 5)
        },
        chartData: {
            type: 'bar',
            data: lateOrdersByPlant.map(p => ({ name: p.plant.replace('Plant-', ''), value: p.lateOrders })),
            xKey: 'name',
            yKey: 'value',
            colors: ['#e53935']
        },
        insights: [
            `${worstPlant.plant} needs immediate attention - 15.4% late rate`,
            'Plant-IL has perfect on-time record',
            `Average delay across all plants: ${(lateOrdersByPlant.reduce((a, b) => a + b.avgDelayDays * b.lateOrders, 0) / totalLate).toFixed(1)} days`,
            'Capacity constraints at TX plant causing delays'
        ],
        drillDownOptions: ['Plant-TX Details', 'Order List', 'Root Cause', 'Trend Analysis'],
        sqlQuery: `SELECT 
  p.plant_name as plant,
  SUM(CASE WHEN so.delivery_date > so.expected_date THEN 1 ELSE 0 END) as lateOrders,
  COUNT(*) as totalOrders,
  ROUND(SUM(CASE WHEN so.delivery_date > so.expected_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) as latePercentage,
  AVG(DATEDIFF(so.delivery_date, so.expected_date)) as avgDelayDays
FROM plants p
JOIN sales_orders so ON p.id = so.plant_id
WHERE so.delivery_date IS NOT NULL
GROUP BY p.plant_name
ORDER BY lateOrders DESC
LIMIT 5;`,
        tablesUsed: ['sales_orders', 'plants', 'shipments'],
        confidence: 91
    };
}

function generateInventoryResponse(): AnalyticsResponse {
    const totalValue = inventory.reduce((a, b) => a + b.value, 0);
    const lowStock = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Critical');

    return {
        title: 'Inventory Status',
        content: `Total inventory value is ${formatCurrency(totalValue)} across ${inventory.length} SKU-warehouse combinations. ${lowStock.length} items are at low/critical stock levels requiring attention.`,
        keyMetric: {
            value: formatCurrency(totalValue),
            label: 'Total Inventory Value',
            change: '-5.2% vs last month',
            changeType: 'neutral'
        },
        tableData: {
            title: 'Inventory Overview',
            columns: [
                { key: 'product', label: 'Product', type: 'text' },
                { key: 'warehouse', label: 'Warehouse', type: 'text' },
                { key: 'quantity', label: 'Qty', type: 'number' },
                { key: 'value', label: 'Value', type: 'currency' },
                { key: 'status', label: 'Status', type: 'status' }
            ],
            rows: inventory.slice(0, 5)
        },
        chartData: {
            type: 'pie',
            data: [
                { name: 'Adequate', value: inventory.filter(i => i.status === 'Adequate').length },
                { name: 'Overstocked', value: inventory.filter(i => i.status === 'Overstocked').length },
                { name: 'Low Stock', value: inventory.filter(i => i.status === 'Low Stock').length },
                { name: 'Critical', value: inventory.filter(i => i.status === 'Critical').length },
            ],
            colors: ['#4caf50', '#ff9800', '#f44336', '#9c27b0']
        },
        insights: [
            `${lowStock.length} items need reordering immediately`,
            'Electric Motor H at critical level in WH-TX',
            `Overstocked items worth ${formatCurrency(inventory.filter(i => i.status === 'Overstocked').reduce((a, b) => a + b.value, 0))}`,
            'Consider redistributing stock from CA to TX'
        ],
        drillDownOptions: ['Low Stock Items', 'By Warehouse', 'Reorder Suggestions', 'Value Analysis'],
        sqlQuery: `SELECT 
  p.product_name as product,
  w.warehouse_name as warehouse,
  i.quantity,
  i.quantity * p.unit_price as value,
  CASE 
    WHEN i.quantity < p.reorder_level * 0.5 THEN 'Critical'
    WHEN i.quantity < p.reorder_level THEN 'Low Stock'
    WHEN i.quantity > p.reorder_level * 3 THEN 'Overstocked'
    ELSE 'Adequate'
  END as status
FROM inventory i
JOIN products p ON i.product_id = p.id
JOIN warehouses w ON i.warehouse_id = w.id
ORDER BY i.quantity ASC
LIMIT 5;`,
        tablesUsed: ['inventory', 'products', 'warehouses'],
        confidence: 93
    };
}

function generateInvoicesResponse(): AnalyticsResponse {
    const overdue = invoices.filter(i => i.status === 'Overdue');
    const totalOverdue = overdue.reduce((a, b) => a + b.amount, 0);

    return {
        title: 'Invoices & Receivables',
        content: `There are ${overdue.length} overdue invoices totaling ${formatCurrency(totalOverdue)}. The oldest overdue invoice is ${Math.max(...overdue.map(i => i.daysOverdue))} days past due.`,
        keyMetric: {
            value: formatCurrency(totalOverdue),
            label: 'Total Overdue',
            change: `${overdue.length} invoices`,
            changeType: 'negative'
        },
        tableData: {
            title: 'Recent Invoices',
            columns: [
                { key: 'id', label: 'Invoice #', type: 'text' },
                { key: 'customer', label: 'Customer', type: 'text' },
                { key: 'amount', label: 'Amount', type: 'currency' },
                { key: 'status', label: 'Status', type: 'status' },
                { key: 'daysOverdue', label: 'Days Overdue', type: 'number' }
            ],
            rows: invoices.slice(0, 5)
        },
        chartData: {
            type: 'pie',
            data: [
                { name: 'Paid', value: invoices.filter(i => i.status === 'Paid').length },
                { name: 'Pending', value: invoices.filter(i => i.status === 'Pending').length },
                { name: 'Overdue', value: invoices.filter(i => i.status === 'Overdue').length },
            ],
            colors: ['#4caf50', '#ff9800', '#f44336']
        },
        insights: [
            `${invoices.filter(i => i.status === 'Paid').length} invoices paid this period`,
            `Atlas Group has oldest overdue invoice (${Math.max(...overdue.map(i => i.daysOverdue))} days)`,
            'Collection rate at 78% - needs improvement',
            'Consider automated payment reminders'
        ],
        drillDownOptions: ['Overdue Details', 'By Customer', 'Aging Report', 'Collection History'],
        sqlQuery: `SELECT 
  i.invoice_number as id,
  c.customer_name as customer,
  i.amount,
  i.status,
  CASE WHEN i.status = 'Overdue' THEN DATEDIFF(CURDATE(), i.due_date) ELSE 0 END as daysOverdue
FROM invoices i
JOIN customers c ON i.customer_id = c.id
ORDER BY i.due_date DESC
LIMIT 5;`,
        tablesUsed: ['invoices', 'customers', 'payments'],
        confidence: 94
    };
}

function generateExpensesResponse(): AnalyticsResponse {
    const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
    const topCategory = expenses[0];

    return {
        title: 'Expense Analysis',
        content: `Total expenses are ${formatCurrency(totalExpenses)}. ${topCategory.category} is the largest expense at ${formatCurrency(topCategory.amount)} (${topCategory.percentage}% of total), trending ${topCategory.trend} by ${topCategory.change}%.`,
        keyMetric: {
            value: formatCurrency(totalExpenses),
            label: 'Total Expenses',
            change: '+4.8% vs last quarter',
            changeType: 'negative'
        },
        tableData: {
            title: 'Expenses by Category',
            columns: [
                { key: 'category', label: 'Category', type: 'text' },
                { key: 'amount', label: 'Amount', type: 'currency' },
                { key: 'percentage', label: '% of Total', type: 'percentage' },
                { key: 'trend', label: 'Trend', type: 'text' },
                { key: 'change', label: 'Change %', type: 'percentage' }
            ],
            rows: expenses.slice(0, 5)
        },
        chartData: {
            type: 'pie',
            data: expenses.map(e => ({ name: e.category, value: e.amount })),
            colors: ['#1a7b8c', '#2196a8', '#4db6ac', '#80cbc4', '#b2dfdb', '#e0f2f1', '#ffd54f', '#ffb74d']
        },
        insights: [
            `Raw Materials consuming ${topCategory.percentage}% of budget`,
            'Logistics costs up 8.5% - review shipping contracts',
            'R&D investment up 15.8% - good for long-term growth',
            'Admin costs reduced by 2.1% through automation'
        ],
        drillDownOptions: ['Raw Materials Detail', 'By Department', 'Trend Analysis', 'Budget vs Actual'],
        sqlQuery: `SELECT 
  category,
  SUM(amount) as amount,
  ROUND(SUM(amount) * 100.0 / (SELECT SUM(amount) FROM expenses), 1) as percentage
FROM expenses
WHERE expense_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
GROUP BY category
ORDER BY amount DESC
LIMIT 5;`,
        tablesUsed: ['expenses', 'budget', 'departments'],
        confidence: 90
    };
}

function generateSuppliersResponse(): AnalyticsResponse {
    const totalSpend = suppliers.reduce((a, b) => a + b.totalSpend, 0);
    const topSupplier = suppliers[0];

    return {
        title: 'Supplier Performance',
        content: `Total supplier spend is ${formatCurrency(totalSpend)} across ${suppliers.length} suppliers. ${topSupplier.name} is your top supplier with ${formatCurrency(topSupplier.totalSpend)} spend and ${topSupplier.onTimeDelivery}% on-time delivery.`,
        keyMetric: {
            value: formatCurrency(topSupplier.totalSpend),
            label: topSupplier.name,
            change: `${topSupplier.onTimeDelivery}% on-time`,
            changeType: 'positive'
        },
        tableData: {
            title: 'Top 5 Suppliers',
            columns: [
                { key: 'name', label: 'Supplier', type: 'text' },
                { key: 'category', label: 'Category', type: 'text' },
                { key: 'totalSpend', label: 'Total Spend', type: 'currency' },
                { key: 'onTimeDelivery', label: 'On-Time %', type: 'percentage' },
                { key: 'rating', label: 'Rating', type: 'number' }
            ],
            rows: suppliers
        },
        chartData: {
            type: 'bar',
            data: suppliers.map(s => ({ name: s.name.split(' ')[0], value: s.totalSpend })),
            xKey: 'name',
            yKey: 'value',
            colors: ['#1a7b8c']
        },
        insights: [
            `ChemSource Ltd has highest on-time delivery at ${suppliers.find(s => s.name === 'ChemSource Ltd')?.onTimeDelivery}%`,
            'ElectroCom needs improvement - 88% on-time rate',
            `Average supplier rating: ${(suppliers.reduce((a, b) => a + b.rating, 0) / suppliers.length).toFixed(1)}/5`,
            'Consider consolidating orders for better pricing'
        ],
        drillDownOptions: ['Supplier Details', 'Order History', 'Performance Trend', 'Contract Terms'],
        sqlQuery: `SELECT 
  s.supplier_name as name,
  s.category,
  SUM(po.amount) as totalSpend,
  ROUND(AVG(CASE WHEN po.delivery_date <= po.expected_date THEN 100 ELSE 0 END), 0) as onTimeDelivery,
  s.rating
FROM suppliers s
JOIN purchase_orders po ON s.id = po.supplier_id
GROUP BY s.id, s.supplier_name, s.category, s.rating
ORDER BY totalSpend DESC
LIMIT 5;`,
        tablesUsed: ['suppliers', 'purchase_orders'],
        confidence: 92
    };
}

function generateEmployeesResponse(): AnalyticsResponse {
    const salesTeam = employees.filter(e => e.department === 'Sales');
    const topPerformer = salesTeam.sort((a, b) => b.performance - a.performance)[0];

    return {
        title: 'Employee Performance',
        content: `Top performer is ${topPerformer.name} with ${topPerformer.performance}% performance score and ${formatCurrency(topPerformer.sales)} in sales. Sales team average performance is ${(salesTeam.reduce((a, b) => a + b.performance, 0) / salesTeam.length).toFixed(0)}%.`,
        keyMetric: {
            value: `${topPerformer.performance}%`,
            label: topPerformer.name,
            change: formatCurrency(topPerformer.sales) + ' in sales',
            changeType: 'positive'
        },
        tableData: {
            title: 'Top 5 Employees',
            columns: [
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'department', label: 'Department', type: 'text' },
                { key: 'role', label: 'Role', type: 'text' },
                { key: 'performance', label: 'Performance %', type: 'percentage' },
                { key: 'sales', label: 'Sales', type: 'currency' }
            ],
            rows: employees
        },
        chartData: {
            type: 'bar',
            data: employees.map(e => ({ name: e.name.split(' ')[0], value: e.performance })),
            xKey: 'name',
            yKey: 'value',
            colors: ['#1a7b8c']
        },
        insights: [
            `${topPerformer.name} exceeds target by 15%`,
            'Sales team showing strong performance overall',
            `Total sales by team: ${formatCurrency(salesTeam.reduce((a, b) => a + b.sales, 0))}`,
            'Consider performance incentive program'
        ],
        drillDownOptions: ['Sales Team Detail', 'By Region', 'Trend Analysis', 'Goals vs Actual'],
        sqlQuery: `SELECT 
  e.name,
  d.department_name as department,
  e.role,
  e.performance_score as performance,
  COALESCE(SUM(so.total_amount), 0) as sales
FROM employees e
JOIN departments d ON e.department_id = d.id
LEFT JOIN sales_orders so ON e.id = so.sales_rep_id
GROUP BY e.id, e.name, d.department_name, e.role, e.performance_score
ORDER BY performance DESC
LIMIT 5;`,
        tablesUsed: ['employees', 'departments', 'sales_orders'],
        confidence: 89
    };
}

function generateOrdersResponse(): AnalyticsResponse {
    const recentOrders = salesOrders.slice(0, 5);
    const totalValue = salesOrders.reduce((a, b) => a + b.total, 0);

    return {
        title: 'Recent Orders',
        content: `Showing your most recent orders. Total order value is ${formatCurrency(totalValue)} across ${salesOrders.length} orders. ${salesOrders.filter(o => o.status === 'Delivered').length} orders have been delivered.`,
        keyMetric: {
            value: formatCurrency(totalValue),
            label: 'Total Order Value',
            change: `${salesOrders.length} orders`,
            changeType: 'positive'
        },
        tableData: {
            title: 'Recent Orders',
            columns: [
                { key: 'id', label: 'Order ID', type: 'text' },
                { key: 'customer', label: 'Customer', type: 'text' },
                { key: 'product', label: 'Product', type: 'text' },
                { key: 'total', label: 'Total', type: 'currency' },
                { key: 'status', label: 'Status', type: 'status' }
            ],
            rows: recentOrders
        },
        chartData: {
            type: 'pie',
            data: [
                { name: 'Delivered', value: salesOrders.filter(o => o.status === 'Delivered').length },
                { name: 'In Transit', value: salesOrders.filter(o => o.status === 'In Transit').length },
                { name: 'Pending', value: salesOrders.filter(o => o.status === 'Pending').length },
            ],
            colors: ['#4caf50', '#2196f3', '#ff9800']
        },
        insights: [
            `${salesOrders.filter(o => o.status === 'Delivered').length} orders delivered successfully`,
            `Average order value: ${formatCurrency(totalValue / salesOrders.length)}`,
            'North region has most orders this period',
            'Industrial Pump A is most ordered product'
        ],
        drillDownOptions: ['Pending Orders', 'By Customer', 'By Product', 'By Region'],
        sqlQuery: `SELECT 
  so.order_number as id,
  c.customer_name as customer,
  p.product_name as product,
  so.total_amount as total,
  so.status
FROM sales_orders so
JOIN customers c ON so.customer_id = c.id
JOIN order_items oi ON so.id = oi.order_id
JOIN products p ON oi.product_id = p.id
ORDER BY so.order_date DESC
LIMIT 5;`,
        tablesUsed: ['sales_orders', 'customers', 'order_items', 'products'],
        confidence: 96
    };
}

export default analyzeQuery;
