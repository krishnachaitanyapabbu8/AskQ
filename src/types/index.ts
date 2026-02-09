export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
    sqlQuery?: string;
    dataSource?: string;
}

export interface Chat {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
    dataSource?: string;
}

export interface DataSource {
    id: string;
    name: string;
    type: 'SAP' | 'RAMCO' | 'EHR' | 'Custom';
    icon: string;
    connected: boolean;
}

export type Theme = 'dark' | 'light';
