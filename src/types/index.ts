export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
    sqlQuery?: string;
    dataSource?: string;
    // Enhanced fields for structured analytics
    title?: string;
    keyMetric?: {
        value: string;
        label: string;
        change?: string;
        changeType?: 'positive' | 'negative' | 'neutral';
    };
    chartData?: ChartData;
    tableData?: TableData;
    insights?: string[];
    drillDownOptions?: string[];
    confidence?: number;
    tablesUsed?: string[];
    lastRefresh?: Date;
}

export interface TableData {
    title: string;
    columns: TableColumn[];
    rows: Record<string, any>[];
}

export interface TableColumn {
    key: string;
    label: string;
    type: 'text' | 'number' | 'currency' | 'percentage' | 'status';
}

export interface ChartData {
    type: 'bar' | 'line' | 'pie' | 'table';
    data: Record<string, unknown>[];
    xKey?: string;
    yKey?: string;
    colors?: string[];
}

export interface DrillDownOption {
    label: string;
    icon: string;
    query: string;
}

export interface Chat {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
    dataSource?: string;
    isPinned?: boolean;
}

export interface SavedInsight {
    id: string;
    name: string;
    description: string;
    query: string;
    chartData?: ChartData;
    schedule?: {
        frequency: 'daily' | 'weekly' | 'monthly';
        time: string;
        recipients: string[];
    };
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}

export interface Playbook {
    id: string;
    name: string;
    description: string;
    icon: string;
    steps: PlaybookStep[];
    category: string;
}

export interface PlaybookStep {
    id: string;
    title: string;
    query: string;
    description: string;
}

export interface DataSource {
    id: string;
    name: string;
    type: 'SAP' | 'RAMCO' | 'EHR' | 'Custom';
    icon: string;
    connected: boolean;
    lastSync?: Date;
    tables?: number;
    rows?: string;
}

export interface FilterContext {
    dateRange: {
        start: Date;
        end: Date;
        label: string;
    };
    dataSource: string;
    filters: { key: string; value: string }[];
}

export type Theme = 'dark' | 'light';
