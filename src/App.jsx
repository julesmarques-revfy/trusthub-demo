import React, { useState, useMemo, useCallback, useRef, useEffect, Fragment } from 'react';
import { Home, Database, Table2, Users, Send, RefreshCw, Brain, Shield, DollarSign, Building2, Plug, UserCog, Calendar, Plus, Trash2, MoreVertical, Check, AlertCircle, Link2, Cloud, FileSpreadsheet, Cog, Radio, TrendingUp, Zap, UserPlus, FileText, ShieldCheck, Wrench, ClipboardList, Megaphone, Ban, Search, Archive, BarChart3, Pause, Play, CircleDot, Upload, FolderSync, Webhook, ChevronRight, ChevronDown, Activity, Target, Eye, FileDown, Lock, Filter, GitCompareArrows, ArrowUpRight, ArrowDownRight, ArrowRight, ArrowLeft, ArrowLeftRight, ArrowDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = {
  primary: '#1B59F8',
  darkBlue: '#1442C4',
  cyan: '#00C2CB',
  bgBlue: 'rgba(20,66,196,0.08)',
  pageBg: '#F9F9F9',
  cardBg: '#FFFFFF',
  border: '#EFF0F6',
  success: '#1FE08F',
  error: '#FF3E13',
  muted: '#808080',
  shadow: '0 5px 20px rgba(0,0,0,.05)',
  lightGray: '#F5F5F5',
};

const NAVIGATION = [
  {
    section: 'Plataforma',
    items: [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'datasync', label: 'Data Sync', icon: Database },
      { id: 'audiencias', label: 'Audiências', icon: Users },
      { id: 'destinos', label: 'Destinos', icon: Send },
      { id: 'revfyiq', label: 'RevFy IQ', icon: Brain },
    ]
  },
  {
    section: 'Trust Hub',
    items: [
      { id: 'governanca', label: 'Governança', icon: Shield },
      { id: 'faturamento', label: 'Faturamento', icon: DollarSign },
      { id: 'coligados', label: 'Colaboração', icon: Building2 },
    ]
  },
  {
    section: 'Configuração',
    items: [
      { id: 'usuarios', label: 'Usuários', icon: UserCog },
      { id: 'ajuda', label: 'Ajuda', icon: ClipboardList },
    ]
  }
];

// Deterministic seeded pseudo-random generator for stable data
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateSourceDatasets = (sourceName) => {
  const seed = sourceName.charCodeAt(0) * sourceName.charCodeAt(sourceName.length - 1);
  const count = 3 + Math.floor(seededRandom(seed) * 4);
  const datasets = [];

  for (let i = 0; i < count; i++) {
    const datasetNames = {
      'BigQuery': ['bq_contacts', 'bq_transactions', 'bq_campaign_events', 'bq_segments_ml', 'bq_customer_360'],
      'Revfy Warehouse': ['rw_customers', 'rw_events', 'rw_transactions', 'rw_segments'],
      'HubSpot': ['hubspot_contacts', 'hubspot_companies', 'hubspot_deals'],
      'Salesforce': ['sf_leads', 'sf_accounts', 'sf_opportunities'],
      'Redshift': ['rs_analytics', 'rs_events', 'rs_customers'],
      'PostgreSQL': ['pg_users', 'pg_orders', 'pg_events', 'pg_segments'],
      'MySQL': ['mysql_products', 'mysql_sales', 'mysql_customers', 'mysql_logs'],
      'Google Sheets': ['gs_import_1', 'gs_import_2'],
      'API REST': ['api_users', 'api_events'],
      'Webhook': ['webhook_events', 'webhook_logs'],
      'SFTP': ['sftp_upload_1', 'sftp_upload_2'],
    };

    const names = datasetNames[sourceName] || [`${sourceName.toLowerCase()}_data_${i}`];
    const name = names[i % names.length];
    const recordCounts = {
      'BigQuery': [1203847, 847293, 2341567, 1567890, 923456],
      'Revfy Warehouse': [1203847, 923456, 847293, 1456789],
      'HubSpot': [1200532, 156234, 89234],
      'Salesforce': [845231, 567890, 234567],
      'Redshift': [980000, 654321, 789012],
      'PostgreSQL': [520000, 387654, 456789, 234567],
      'MySQL': [310000, 245678, 198765, 145632],
      'Google Sheets': [15000, 8500],
      'API REST': [312104],
      'Webhook': [89000, 45600],
      'SFTP': [78000, 42300],
    };

    const records = recordCounts[sourceName]?.[i] || Math.floor(seededRandom(seed + i) * 1000000);

    datasets.push({
      nome: name,
      fonte: sourceName,
      tipo: i === 0 ? 'Tabela' : i === 1 ? 'Evento' : 'Dados',
      registros: records.toLocaleString(),
      atualizacao: ['Tempo real', 'Horária', 'Diária', 'A cada 6h'][Math.floor(seededRandom(seed + i) * 4)],
      qualidade: (91 + Math.floor(seededRandom(seed + i * 2) * 9)) + '%',
      status: 'Ativo'
    });
  }

  return datasets;
};

const MOCK_DATA = {
  kpis: [
    { label: 'Registros Ativados', value: '0', change: '+0', icon: 'send', computed: true, info: 'Total de registros enviados com sucesso para destinos de ativação. Mede o volume real do pipeline — se esse número para, nada está sendo ativado.' },
    { label: 'Match Rate Médio', value: '79.8%', change: '+3.2%', icon: 'trending', info: 'Taxa média de correspondência entre seus registros e as plataformas de destino. Quanto maior, mais do seu investimento está atingindo pessoas reais.' },
    { label: 'Audiências em Sync', value: '3', change: 'de 4 total', icon: 'activity', info: 'Audiências com sync ativo enviando dados para destinos. Audiências pausadas ou em rascunho não contam — só o que está rodando de verdade.' },
    { label: 'Score Compliance', value: '94%', change: '+2.1%', icon: 'shield', info: 'Conformidade com LGPD, ISO 27001 e SOC 2. Essencial para contratos públicos e governamentais — abaixo de 90% bloqueia ativações automaticamente.' },
    { label: 'Créditos Consumidos', value: '62.5K', change: 'este mês', icon: 'dollar', info: 'Total de créditos consumidos no mês corrente por todos os serviços (Ativação, RevFy IQ, Openflow, Armazenamento, Governança).' },
    { label: 'Feedback Coverage', value: '50%', change: '2 de 4 canais', icon: 'radar', info: 'Percentual de destinos com retorno de métricas via Openflow. Canais sem feedback são "caixas-pretas" — você ativa mas não sabe o resultado.' },
  ],
  sources: [
    { id: 4, name: 'Upload CSV', type: 'Arquivo (Manual)', status: 'Ativo', extra: '3 arquivos • 45K registros', lastSync: '15min atrás', color: '#FFF8E8', connectedExtra: '3 arquivos • 45K registros', connectedSync: '15min atrás', autoRefresh: true },
    { id: 6, name: 'Revfy Pixel', type: 'Native First-Party', status: 'Nativo', extra: '3.1M eventos', lastSync: 'Tempo real', color: '#E8F0FF', native: true },
  ],
  destinations: [
    { id: 1, name: 'Meta', type: 'Custom Audiences + CAPI', icon: 'f', match: '87%', status: 'Conectado', feedbackType: 'full_loop' },
    { id: 2, name: 'Google Ads', type: 'Customer Match', icon: 'g', match: '82%', status: 'Conectado', feedbackType: 'full_loop' },
    { id: 3, name: 'TikTok', type: 'Audiences API', icon: 'tt', match: '79%', status: 'Conectado', feedbackType: 'activation_only' },
    { id: 4, name: 'X (Twitter)', type: 'Custom Audiences', icon: 'x', match: '71%', status: 'Conectado', feedbackType: 'activation_only' },
  ],
  audiences: [
    { id: 1, name: 'Segmento SP 25-44', size: 847293, status: 'Ativo', created: '2026-03-10' },
    { id: 2, name: 'Lookalike Sudeste', size: 1567890, status: 'Ativo', created: '2026-03-08' },
    { id: 3, name: 'Alto Valor - Classe A/B', size: 234567, status: 'Teste', created: '2026-03-15' },
    { id: 4, name: 'Base Inativa 90d', size: 123456, status: 'Rascunho', created: '2026-03-20' },
  ],
  datasets: [
    { nome: 'revfy_events', fonte: 'Revfy Pixel', tipo: 'Streaming', registros: '3,100,000', atualizacao: 'Tempo real', qualidade: '99%', status: 'Ativo', grupo: 'Revfy Pixel — Clientes' },
    { nome: 'page_views', fonte: 'Revfy Pixel', tipo: 'Streaming', registros: '12,450,000', atualizacao: 'Tempo real', qualidade: '99%', status: 'Ativo', grupo: 'Revfy Pixel — Clientes' },
    { nome: 'conversions', fonte: 'Revfy Pixel', tipo: 'Streaming', registros: '847,293', atualizacao: 'Tempo real', qualidade: '98%', status: 'Ativo', grupo: 'Revfy Pixel — Clientes' },
    { nome: 'user_profiles', fonte: 'Revfy Pixel', tipo: 'Incremental', registros: '1,892,340', atualizacao: 'Horária', qualidade: '97%', status: 'Ativo', grupo: 'Revfy Pixel — Clientes' },
    { nome: 'golden_profiles', fonte: 'Warehouse', tipo: 'Materialized View', registros: '1,203,847', atualizacao: 'Horária', qualidade: '99%', status: 'Ativo', grupo: 'Revfy Warehouse — Perfis Enriquecidos' },
    { nome: 'transactions', fonte: 'Warehouse', tipo: 'Incremental', registros: '4,567,890', atualizacao: 'A cada 15min', qualidade: '98%', status: 'Ativo', grupo: 'Revfy Warehouse — Perfis Enriquecidos' },
    { nome: 'enrichment_3p', fonte: 'Serasa/IBGE', tipo: 'Batch', registros: '1,023,456', atualizacao: 'Semanal', qualidade: '95%', status: 'Ativo', grupo: 'Revfy Warehouse — Perfis Enriquecidos' },
    { nome: 'addresses', fonte: 'Warehouse', tipo: 'Incremental', registros: '1,189,234', atualizacao: 'Diária', qualidade: '96%', status: 'Ativo', grupo: 'Revfy Warehouse — Perfis Enriquecidos' },
    { nome: 'ml_scores', fonte: 'RevFy IQ', tipo: 'Model Output', registros: '1,567,890', atualizacao: 'Diária', qualidade: '94%', status: 'Ativo', grupo: 'RevFy IQ — ML Embeddings' },
    { nome: 'embeddings_v3', fonte: 'RevFy IQ', tipo: 'Vector Store', registros: '1,567,890', atualizacao: 'Diária', qualidade: '97%', status: 'Ativo', grupo: 'RevFy IQ — ML Embeddings' },
    { nome: 'clusters', fonte: 'RevFy IQ', tipo: 'Model Output', registros: '1,567,890', atualizacao: 'Semanal', qualidade: '93%', status: 'Ativo', grupo: 'RevFy IQ — ML Embeddings' },
    { nome: 'meta_campaign_metrics', fonte: 'Openflow', tipo: 'Ingest', registros: '2,100,000', atualizacao: 'A cada 6h', qualidade: '98%', status: 'Ativo', grupo: '' },
    { nome: 'google_campaign_metrics', fonte: 'Openflow', tipo: 'Ingest', registros: '1,400,000', atualizacao: 'A cada 6h', qualidade: '97%', status: 'Ativo', grupo: '' },
    { nome: 'Upload Março', fonte: 'CSV', tipo: 'Arquivo', registros: '45,231', atualizacao: 'Manual', qualidade: '91%', status: 'Revisão', grupo: '' },
  ],
  syncs: [
    { id: 1, audiencia: 'Segmento SP 25-44', destino: 'Meta', modo: 'Upsert', records: 847293, frequencia: 'Diária', lastRun: 'Há 2h', status: 'Sucesso', cdc: true, mappings: [{ source: 'email', dest: 'hashed_email' }, { source: 'segment_id', dest: 'custom_audience_id' }, { source: 'device_id', dest: 'device_match' }] },
    { id: 2, audiencia: 'Lookalike Sudeste', destino: 'Google Ads', modo: 'Mirror', records: 1567890, frequencia: 'A cada 6h', lastRun: 'Há 30min', status: 'Sucesso', cdc: false, mappings: [{ source: 'email', dest: 'email_address' }, { source: 'id', dest: 'user_id' }] },
    { id: 3, audiencia: 'Alto Valor - Classe A/B', destino: 'TikTok', modo: 'Upsert', records: 234567, frequencia: 'Horária', lastRun: 'Há 12min', status: 'Sucesso', cdc: true, mappings: [{ source: 'phone', dest: 'phone_number' }, { source: 'location', dest: 'region' }] },
    { id: 4, audiencia: 'Base Inativa 90d', destino: 'X', modo: 'Add/Remove', records: 123456, frequencia: 'Diária', lastRun: 'Há 4h', status: 'Aviso', cdc: false, mappings: [{ source: 'user_id', dest: 'account_id' }] },
    { id: 5, audiencia: 'Segmento SP 25-44', destino: 'TikTok', modo: 'CDC', records: 847293, frequencia: 'A cada 12h', lastRun: 'Há 6h', status: 'Sucesso', cdc: true, mappings: [{ source: 'email', dest: 'email' }, { source: 'name', dest: 'user_name' }, { source: 'age', dest: 'age_group' }] },
  ],
  users: [
    { id: 1, name: 'Jules Marques', email: 'jules@revfy.io', role: 'Admin', lastAccess: 'Agora', status: 'Ativo' },
    { id: 2, name: 'Maria Silva', email: 'maria@cliente.com', role: 'Operador', lastAccess: '2h atrás', status: 'Ativo' },
    { id: 3, name: 'Carlos Gomes', email: 'carlos@compliance.com', role: 'Auditor', lastAccess: '1d atrás', status: 'Ativo' },
    { id: 4, name: 'Ana Costa', email: 'ana@parceiro.com', role: 'Parceiro', lastAccess: '3h atrás', status: 'Ativo' },
    { id: 5, name: 'Pedro Agência', email: 'pedro@agencia.com', role: 'Agência', lastAccess: '5d atrás', status: 'Inativo' },
  ],
  compliance: [
    { req: 'LGPD Art. 7 — Base legal para tratamento', status: 'Ativo', detail: 'consentimento ativo' },
    { req: 'LGPD Art. 37 — Registro de operações', status: 'Ativo', detail: 'logs imutáveis ativos' },
    { req: 'LGPD Art. 46 — Segurança de dados', status: 'Ativo', detail: 'criptografia AES-256' },
    { req: 'ISO 27001 — Gestão de segurança da informação', status: 'Ativo', detail: 'certificado válido' },
    { req: 'SOC 2 Type II — Controles de acesso', status: 'Aviso', detail: '2 controles pendentes de revisão', action: 'Revisar controles de acesso', page: 'usuarios' },
    { req: 'SHA-256 — Hash de cada operação', status: 'Ativo', detail: '100%' },
  ],
  calendar: [
    { date: 'Mar-Mai', phase: 'Setup & Integração', status: 'current', icon: 'wrench' },
    { date: 'Jun', phase: 'Onboard base de dados', status: 'upcoming', icon: 'clipboard' },
    { date: 'Jul', phase: 'Ativação de audiências', status: 'upcoming', icon: 'megaphone' },
    { date: 'Ago', phase: 'Início de campanhas pagas', status: 'upcoming', icon: 'zap' },
    { date: 'Set', phase: 'Revisão de compliance LGPD', status: 'upcoming', icon: 'ban' },
    { date: 'Out', phase: 'Otimização & escala', status: 'upcoming', icon: 'trending' },
    { date: 'Nov', phase: 'Auditoria & relatórios', status: 'upcoming', icon: 'search' },
    { date: 'Dez', phase: 'Custódia / Archival', status: 'upcoming', icon: 'archive' },
  ],
  chartData: [
    { day: '1', records: 120000 }, { day: '2', records: 132000 }, { day: '3', records: 115000 },
    { day: '4', records: 156000 }, { day: '5', records: 148000 }, { day: '6', records: 172000 },
    { day: '7', records: 165000 }, { day: '8', records: 189000 }, { day: '9', records: 201000 }, { day: '10', records: 198000 },
  ],
  spendData: [
    { channel: 'Meta', spend: 2100000 },
    { channel: 'Google', spend: 1400000 },
    { channel: 'TikTok', spend: 890000 },
    { channel: 'X', spend: 410000 },
  ],
  coalitions: [
    { name: 'Organização Alpha', role: 'Titular', access: 'Acesso Total', color: '#1B59F8' },
    { name: 'Organização Beta', role: 'Parceiro', access: 'Audiências + Relatórios', color: '#00C2CB' },
    { name: 'Organização Gamma', role: 'Parceiro', access: 'Somente Relatórios', color: '#1FE08F' },
  ],
  billing: {
    plan: { name: 'Enterprise', creditPrice: 4.50, currency: 'USD' },
    contract: { totalCredits: 500000, start: '01/01/2026', end: '31/12/2026', model: 'Capacidade Pré-paga' },
    currentMonth: {
      label: 'Março 2026',
      usedCredits: 62483,
      projectedCredits: 74200,
      daysElapsed: 25,
      daysTotal: 31,
    },
    ytdUsedCredits: 187450,
    services: [
      { id: 'activation', name: 'Ativação', desc: 'Syncs para destinos de mídia', credits: 32490, multiplier: 1.0, icon: 'send' },
      { id: 'revfyiq', name: 'RevFy IQ', desc: 'ML scoring, lookalikes, propensão', credits: 14996, multiplier: 1.5, icon: 'brain' },
      { id: 'openflow', name: 'Openflow', desc: 'Ingestão de métricas de campanha', credits: 7497, multiplier: 0.5, icon: 'refresh' },
      { id: 'storage', name: 'Armazenamento', desc: 'Dados em repouso compactados', credits: 4374, multiplier: 0.3, icon: 'database' },
      { id: 'governance', name: 'Governança', desc: 'Compliance, auditoria, masking', credits: 3126, multiplier: 0.8, icon: 'shield' },
    ],
    statement: [
      { date: '25/03', time: '14:32', service: 'Ativação', detail: 'Sync Segmento SP 25-44 → Meta', credits: 1240, records: 847293 },
      { date: '25/03', time: '14:06', service: 'Openflow', detail: 'Ingest meta_campaign_metrics', credits: 78, records: 2100000 },
      { date: '25/03', time: '08:00', service: 'Ativação', detail: 'Sync Lookalike Sudeste → Google Ads', credits: 1890, records: 1567890 },
      { date: '24/03', time: '22:15', service: 'RevFy IQ', detail: 'Lookalike scoring batch — Sudeste', credits: 2340, records: 1567890 },
      { date: '24/03', time: '18:00', service: 'Ativação', detail: 'Sync Alto Valor → TikTok', credits: 456, records: 234567 },
      { date: '24/03', time: '12:00', service: 'Governança', detail: 'Auditoria LGPD — scan mensal', credits: 180, records: 0 },
      { date: '24/03', time: '06:00', service: 'Armazenamento', detail: 'Compactação diária — all datasets', credits: 145, records: 0 },
      { date: '23/03', time: '14:00', service: 'Ativação', detail: 'Sync Base Inativa 90d → X', credits: 312, records: 123456 },
      { date: '23/03', time: '09:30', service: 'RevFy IQ', detail: 'Propensão engajamento — retraining', credits: 3100, records: 3100000 },
      { date: '23/03', time: '06:00', service: 'Openflow', detail: 'Ingest google_campaign_metrics', credits: 52, records: 1400000 },
      { date: '22/03', time: '20:00', service: 'Ativação', detail: 'Sync Segmento SP 25-44 → TikTok', credits: 1240, records: 847293 },
      { date: '22/03', time: '14:00', service: 'RevFy IQ', detail: 'Cluster analysis — segmentação', credits: 1870, records: 2341567 },
    ],
    invoices: [
      { id: 'INV-2026-003', period: 'Março 2026', status: 'Aberta', credits: 62483, amount: 281174, dueDate: '10/04/2026', paidDate: null },
      { id: 'INV-2026-002', period: 'Fevereiro 2026', status: 'Paga', credits: 65200, amount: 293400, dueDate: '10/03/2026', paidDate: '08/03/2026' },
      { id: 'INV-2026-001', period: 'Janeiro 2026', status: 'Paga', credits: 59767, amount: 268952, dueDate: '10/02/2026', paidDate: '07/02/2026' },
    ],
    paymentMethod: { type: 'invoice', company: 'Cliente Demo S.A.', cnpj: '12.345.678/0001-90', bank: 'Banco do Brasil', due: 'Net 30' },
    monthlyHistory: [
      { month: 'Jan', credits: 59767 }, { month: 'Fev', credits: 65200 }, { month: 'Mar', credits: 62483 },
    ],
    dailyConsumption: [
      { day: '01', credits: 1820 }, { day: '02', credits: 2100 }, { day: '03', credits: 1950 }, { day: '04', credits: 2400 },
      { day: '05', credits: 2200 }, { day: '06', credits: 1100 }, { day: '07', credits: 980 }, { day: '08', credits: 2300 },
      { day: '09', credits: 2600 }, { day: '10', credits: 2450 }, { day: '11', credits: 2800 }, { day: '12', credits: 2200 },
      { day: '13', credits: 1200 }, { day: '14', credits: 1050 }, { day: '15', credits: 2700 }, { day: '16', credits: 2900 },
      { day: '17', credits: 3100 }, { day: '18', credits: 2650 }, { day: '19', credits: 2400 }, { day: '20', credits: 1300 },
      { day: '21', credits: 1100 }, { day: '22', credits: 2800 }, { day: '23', credits: 3200 }, { day: '24', credits: 2950 },
      { day: '25', credits: 2833 },
    ],
  },
};

const Badge = ({ children, color = 'green', variant = 'solid' }) => {
  const bgMap = { green: COLORS.success, blue: COLORS.primary, yellow: '#FFA500', red: COLORS.error };
  const bgColor = bgMap[color] || bgMap.green;
  return (
    <span style={{
      display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
      backgroundColor: variant === 'solid' ? bgColor : `${bgColor}20`, color: variant === 'solid' ? '#fff' : bgColor,
    }}>{children}</span>
  );
};

const getKPIIcon = (name) => {
  const iconMap = {
    'database': <Database size={24} />,
    'users': <Users size={24} />,
    'link': <Link2 size={24} />,
    'shield': <ShieldCheck size={24} />,
    'dollar': <DollarSign size={24} />,
    'trending': <TrendingUp size={24} />,
    'send': <Send size={24} />,
    'activity': <Activity size={24} />,
    'radar': <Radio size={24} />,
  };
  return iconMap[name] || null;
};

const getSourceIcon = (name) => {
  const iconMap = {
    'Revfy Warehouse': { icon: Database, bg: '#E8F4FF' },
    'HubSpot': { icon: Link2, bg: '#F0E8FF' },
    'Salesforce': { icon: Cloud, bg: '#E8FFF4' },
    'Upload CSV': { icon: FileSpreadsheet, bg: '#FFF8E8' },
    'API REST': { icon: Cog, bg: '#FFF0E8' },
    'Revfy Pixel': { icon: Radio, bg: '#E8F0FF' },
    'BigQuery': { icon: BarChart3, bg: '#E8F4FF' },
    'Redshift': { icon: Database, bg: '#E8F4FF' },
    'PostgreSQL': { icon: Database, bg: '#E8F4FF' },
    'MySQL': { icon: Database, bg: '#E8F4FF' },
    'Google Sheets': { icon: FileSpreadsheet, bg: '#FFF8E8' },
    'Webhook': { icon: Zap, bg: '#FFF0E8' },
    'SFTP': { icon: FolderSync, bg: '#E8F4FF' },
  };
  const config = iconMap[name] || { icon: Database, bg: '#F5F5F5' };
  const IconComponent = config.icon;
  return (
    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent size={20} color={COLORS.primary} />
    </div>
  );
};

const getCalendarIcon = (name) => {
  const iconMap = {
    'wrench': Wrench,
    'clipboard': ClipboardList,
    'megaphone': Megaphone,
    'zap': Zap,
    'ban': Ban,
    'trending': TrendingUp,
    'search': Search,
    'archive': Archive,
  };
  const IconComponent = iconMap[name] || Wrench;
  return <IconComponent size={18} />;
};

const KPICard = ({ label, value, change, icon }) => (
  <div style={{ padding: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, transition: 'all 0.3s ease', cursor: 'pointer' }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.08)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = COLORS.shadow; }}>
    <div style={{ marginBottom: '8px' }}>{getKPIIcon(icon)}</div>
    <div style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '22px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>{value}</div>
    <div style={{ fontSize: '12px', color: COLORS.success, fontWeight: '600' }}>{change}</div>
  </div>
);

const SourceCard = ({ source, onConnect, onAction }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = source.status;
  const isNative = status === 'Nativo';
  const isActive = status === 'Ativo' || status === 'Conectado';
  const isPaused = status === 'Pausado';
  const isDisconnected = status === 'Desconectado';
  const isLoading = status === 'Conectando...';
  const hasData = isActive || isPaused || isNative;

  const statusConfig = {
    'Nativo': { badge: 'blue', label: 'Nativo', sub: 'Sempre ativo' },
    'Ativo': { badge: 'green', label: 'Ativo', sub: `Última sync: ${source.lastSync}` },
    'Conectado': { badge: 'green', label: 'Conectado', sub: `Última sync: ${source.lastSync}` },
    'Pausado': { badge: 'yellow', label: 'Pausado', sub: 'Sync pausado' },
    'Desconectado': { badge: 'yellow', label: 'Desconectado', sub: 'Clique para conectar' },
    'Conectando...': { badge: 'blue', label: 'Conectando...', sub: 'Aguarde...' },
  };
  const cfg = statusConfig[status] || statusConfig['Desconectado'];

  const menuItems = [];
  if (isActive || status === 'Conectado') {
    menuItems.push({ label: 'Pausar', action: 'pause', icon: Pause },
                    { label: 'Desconectar', action: 'disconnect', icon: Ban },
                    { label: 'Eliminar', action: 'delete', icon: Trash2 });
  } else if (isPaused) {
    menuItems.push({ label: 'Ativar', action: 'activate', icon: Play },
                    { label: 'Desconectar', action: 'disconnect', icon: Ban },
                    { label: 'Eliminar', action: 'delete', icon: Trash2 });
  } else if (isDisconnected) {
    menuItems.push({ label: 'Ativar', action: 'connect', icon: Play },
                    { label: 'Eliminar', action: 'delete', icon: Trash2 });
  } else if (isNative) {
    menuItems.push({ label: 'Pausar', action: 'pause', icon: Pause },
                    { label: 'Desconectar', action: 'disconnect', icon: Ban },
                    { label: 'Eliminar', action: 'delete', icon: Trash2 });
  }

  const handleMenuAction = (action) => {
    if (action === 'connect') {
      onConnect && onConnect(source);
    } else {
      onAction && onAction(source, action);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: hasData ? (source.color || COLORS.cardBg) : COLORS.cardBg, borderRadius: '12px', border: `1px solid ${isNative ? COLORS.primary + '40' : isPaused ? '#FFA50040' : COLORS.border}`, boxShadow: COLORS.shadow, transition: 'all 0.3s ease', cursor: isDisconnected ? 'pointer' : 'default', minHeight: '200px', display: 'flex', flexDirection: 'column', opacity: isLoading ? 0.7 : isPaused ? 0.75 : 1, position: 'relative' }}
      onClick={() => isDisconnected && onConnect && onConnect(source)}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = isNative ? COLORS.primary + '40' : isPaused ? '#FFA50040' : COLORS.border; e.currentTarget.style.boxShadow = COLORS.shadow; setMenuOpen(false); }}>

      {(menuItems.length > 0 || !isLoading) && (
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: COLORS.muted, fontSize: '18px', lineHeight: 1 }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.lightGray}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <MoreVertical size={16} />
          </button>
          {menuOpen && menuItems.length > 0 && (
            <div style={{ position: 'absolute', top: '32px', right: '0', backgroundColor: COLORS.cardBg, borderRadius: '8px', border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 24px rgba(0,0,0,.15)', zIndex: 50, minWidth: '160px', overflow: 'hidden' }}>
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button key={item.action} onClick={(e) => { e.stopPropagation(); setMenuOpen(false); handleMenuAction(item.action); }}
                    style={{ width: '100%', padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', textAlign: 'left', color: item.action === 'delete' ? COLORS.error : '#000', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = item.action === 'delete' ? COLORS.error + '10' : COLORS.lightGray}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <IconComponent size={14} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {getSourceIcon(source.name)}
      <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{source.name}</div>
      <div style={{ fontSize: '13px', color: COLORS.muted, marginBottom: '12px' }}>{source.type}</div>
      {hasData && source.extra && <div style={{ fontSize: '12px', fontWeight: '600', color: COLORS.primary, marginBottom: '8px' }}>{source.extra}</div>}
      {isLoading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '14px', height: '14px', border: `2px solid ${COLORS.border}`, borderTopColor: COLORS.primary, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '12px', color: COLORS.primary, fontWeight: '600' }}>Sincronizando...</span>
        </div>
      )}
      {source.autoRefresh && hasData && <div style={{ fontSize: '11px', color: COLORS.cyan, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><RefreshCw size={12} /> Auto-refresh 24h</div>}
      <div style={{ marginTop: 'auto', marginBottom: '8px' }}><Badge color={cfg.badge} variant={isDisconnected ? 'outline' : 'solid'}>{cfg.label}</Badge></div>
      <div style={{ fontSize: '11px', color: COLORS.muted }}>{cfg.sub}</div>
    </div>
  );
};

const Sidebar = ({ currentPage, onNavigate, alerts = {} }) => (
  <div style={{ width: '240px', backgroundColor: '#fff', borderRight: `1px solid ${COLORS.border}`, overflowY: 'auto', display: 'flex', flexDirection: 'column', height: '100vh', boxShadow: '2px 0 8px rgba(0,0,0,.04)' }}>
    <div style={{ padding: '24px 20px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => onNavigate('overview')}>
      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '16px' }}>R</div>
      <div><div style={{ fontSize: '14px', fontWeight: '700', color: '#000' }}>Revfy</div><div style={{ fontSize: '11px', color: COLORS.muted }}>Trust Hub</div></div>
    </div>
    <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
      {NAVIGATION.map((section, idx) => (
        <div key={idx} style={{ marginBottom: '16px' }}>
          <div style={{ padding: '0 16px', fontSize: '11px', fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', marginBottom: '8px' }}>{section.section}</div>
          {section.items.map((item) => {
            const IconComponent = item.icon;
            const alertCount = alerts[item.id] || 0;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)} style={{ width: 'calc(100% - 20px)', margin: '0 10px', padding: '8px 10px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: currentPage === item.id ? '600' : '400', color: currentPage === item.id ? COLORS.primary : '#000', backgroundColor: currentPage === item.id ? COLORS.bgBlue : 'transparent', transition: 'all 0.2s', position: 'relative' }}
                onMouseEnter={(e) => { if (currentPage !== item.id) e.currentTarget.style.backgroundColor = COLORS.lightGray; }}
                onMouseLeave={(e) => { if (currentPage !== item.id) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <IconComponent size={16} />
                {item.label}
                {alertCount > 0 && (
                  <span style={{ marginLeft: 'auto', minWidth: '18px', height: '18px', borderRadius: '9px', backgroundColor: '#F59E0B', color: '#fff', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>{alertCount}</span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  </div>
);

const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,.3)', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ padding: '24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: COLORS.cardBg, zIndex: 101 }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: COLORS.muted }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const SOURCE_CATALOG = [
  { name: 'Revfy Warehouse', category: 'ETL', auth: 'credentials', fields: ['Account URL', 'Warehouse', 'Database', 'Schema', 'Username', 'Password'] },
  { name: 'BigQuery', category: 'ETL', auth: 'credentials', fields: ['Project ID', 'Dataset', 'Service Account Email', 'Private Key (JSON)'] },
  { name: 'HubSpot', category: 'ETL', auth: 'oauth', fields: [] },
  { name: 'Salesforce', category: 'ETL', auth: 'oauth', fields: [] },
  { name: 'Redshift', category: 'ETL', auth: 'credentials', fields: ['Host', 'Port', 'Database', 'Username', 'Password'] },
  { name: 'PostgreSQL', category: 'ETL', auth: 'credentials', fields: ['Host', 'Port', 'Database', 'Username', 'Password'] },
  { name: 'MySQL', category: 'ETL', auth: 'credentials', fields: ['Host', 'Port', 'Database', 'Username', 'Password'] },
  { name: 'Google Sheets', category: 'ETL', auth: 'oauth', fields: [] },
  { name: 'API REST', category: 'API', auth: 'credentials', fields: ['Base URL', 'API Key', 'Header Auth'] },
  { name: 'Webhook', category: 'API', auth: 'credentials', fields: ['Endpoint URL', 'Secret Token'] },
  { name: 'CSV Upload', category: 'CSV', auth: 'none', fields: [] },
  { name: 'SFTP', category: 'CSV', auth: 'credentials', fields: ['Host', 'Port', 'Username', 'Password', 'Remote Path'] },
];

const SOURCE_CONNECTED_DATA = {
  'Revfy Warehouse': { type: 'Data Warehouse', extra: '1,203,847 registros • 4 tabelas', lastSync: '2min atrás', color: '#E8F4FF', log: { source: 'Revfy Warehouse', records: '1,203,847', duration: '2m 14s', time: '25/03 14:32', status: 'Sucesso' },
    fields: [
      { name: 'Estado', desc: 'UF do cliente (Revfy)', icon: 'Aa', type: 'geo', values: ['SP', 'RJ', 'MG', 'BA', 'RS', 'PR', 'PE', 'CE'] },
      { name: 'Faixa Etária', desc: 'Faixa etária (Revfy)', icon: 'Aa', type: 'demo', values: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'] },
      { name: 'Classe Social', desc: 'Classe socioeconômica', icon: 'Aa', type: 'demo', values: ['A', 'B', 'C', 'D', 'E'] },
      { name: 'Score Engajamento', desc: 'Propensão de engajamento digital', icon: '12', type: 'model', values: ['Alto', 'Médio-Alto', 'Médio', 'Baixo'] },
      { name: 'Propensão Conversão', desc: 'Score preditivo de conversão', icon: '12', type: 'model', values: ['> 0.8', '> 0.6', '> 0.4', '< 0.4'] },
    ] },
  'BigQuery': { type: 'Data Warehouse (GCP)', extra: '2.4M registros • 6 tabelas', lastSync: '5min atrás', color: '#EEF1FF', log: { source: 'BigQuery', records: '2,400,000', duration: '3m 05s', time: '25/03 13:10', status: 'Sucesso' },
    fields: [
      { name: 'Região', desc: 'Macro-região (BigQuery)', icon: 'Aa', type: 'geo', values: ['Sudeste', 'Nordeste', 'Sul', 'Norte', 'Centro-Oeste'] },
      { name: 'Canal Digital', desc: 'Canal de aquisição', icon: 'Aa', type: 'demo', values: ['Orgânico', 'Paid Social', 'Search', 'Email', 'Referral'] },
      { name: 'Evento Campanha', desc: 'Participou de evento', icon: 'Aa', type: 'event', values: ['Sim', 'Não'] },
      { name: 'Valor Doação', desc: 'Total doado para campanha', icon: '12', type: 'transaction', values: ['> R$ 1.000', '> R$ 500', '> R$ 100', '= 0'] },
    ] },
  'HubSpot': { type: 'CRM (OAuth)', extra: '1,200,532 contatos • 3 objetos', lastSync: '3min atrás', color: '#FFF3E8', log: { source: 'HubSpot', records: '1,200,532', duration: '3m 42s', time: '25/03 12:15', status: 'Sucesso' },
    fields: [
      { name: 'Lead Score', desc: 'Score de qualificação (HubSpot)', icon: '12', type: 'model', values: ['Quente', 'Morno', 'Frio'] },
      { name: 'Lifecycle Stage', desc: 'Estágio do contato', icon: 'Aa', type: 'demo', values: ['Subscriber', 'Lead', 'MQL', 'SQL', 'Customer'] },
      { name: 'Última Interação', desc: 'Dias desde última interação', icon: '12', type: 'event', values: ['< 7 dias', '< 30 dias', '< 90 dias', '> 90 dias'] },
    ] },
  'Salesforce': { type: 'CRM (OAuth)', extra: '845,231 leads • 2 objetos', lastSync: '10min atrás', color: '#E8F0FF', log: { source: 'Salesforce', records: '845,231', duration: '4m 08s', time: '25/03 10:00', status: 'Sucesso' },
    fields: [
      { name: 'Account Type', desc: 'Tipo de conta (Salesforce)', icon: 'Aa', type: 'demo', values: ['Prospect', 'Customer', 'Partner', 'Competitor'] },
      { name: 'Opportunity Stage', desc: 'Fase da oportunidade', icon: 'Aa', type: 'demo', values: ['Prospecting', 'Qualification', 'Proposal', 'Closed Won'] },
    ] },
  'Redshift': { type: 'Data Warehouse', extra: '980K registros • 3 tabelas', lastSync: '8min atrás', color: '#FFE8E8', log: { source: 'Redshift', records: '980,000', duration: '1m 55s', time: '25/03 11:45', status: 'Sucesso' },
    fields: [
      { name: 'Frequência Acesso', desc: 'Frequência de acesso ao site', icon: '12', type: 'event', values: ['Diário', 'Semanal', 'Mensal', 'Inativo'] },
      { name: 'Device Type', desc: 'Dispositivo principal', icon: 'Aa', type: 'demo', values: ['Mobile', 'Desktop', 'Tablet'] },
    ] },
  'PostgreSQL': { type: 'Database', extra: '520K registros • 5 tabelas', lastSync: '6min atrás', color: '#E8F8FF', log: { source: 'PostgreSQL', records: '520,000', duration: '1m 12s', time: '25/03 09:30', status: 'Sucesso' },
    fields: [
      { name: 'Cidade', desc: 'Cidade de residência (PG)', icon: 'Aa', type: 'geo', values: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Curitiba', 'Recife'] },
      { name: 'Gênero', desc: 'Gênero declarado', icon: 'Aa', type: 'demo', values: ['Masculino', 'Feminino', 'Não Declarado'] },
    ] },
  'MySQL': { type: 'Database', extra: '310K registros • 4 tabelas', lastSync: '12min atrás', color: '#FFF8E8', log: { source: 'MySQL', records: '310,000', duration: '0m 48s', time: '25/03 08:00', status: 'Sucesso' },
    fields: [
      { name: 'Renda Familiar', desc: 'Estimativa de renda (MySQL)', icon: '12', type: 'demo', values: ['> R$ 20K', '> R$ 10K', '> R$ 5K', '< R$ 5K'] },
    ] },
  'Google Sheets': { type: 'Planilha (OAuth)', extra: '15K registros • 2 sheets', lastSync: '1min atrás', color: '#E8FFE8', log: { source: 'Google Sheets', records: '15,000', duration: '0m 05s', time: '25/03 14:00', status: 'Sucesso' },
    fields: [] },
  'API REST': { type: 'API Endpoint', extra: '312K registros', lastSync: '4min atrás', color: '#F0E8FF', log: { source: 'API REST', records: '312,104', duration: '1m 22s', time: '25/03 14:32', status: 'Sucesso' },
    fields: [
      { name: 'Engajamento SMS', desc: 'Respondeu SMS de campanha', icon: 'Aa', type: 'event', values: ['Sim', 'Não'] },
    ] },
  'Webhook': { type: 'Webhook Endpoint', extra: '89K eventos', lastSync: 'Tempo real', color: '#FFE8F8', log: { source: 'Webhook', records: '89,000', duration: '—', time: 'Tempo real', status: 'Ativo' },
    fields: [
      { name: 'Evento Realtime', desc: 'Eventos em tempo real', icon: 'Aa', type: 'event', values: ['page_view', 'form_submit', 'video_play', 'share'] },
    ] },
  'SFTP': { type: 'Arquivo Remoto', extra: '78K registros • 4 arquivos', lastSync: '1h atrás', color: '#F5F0E8', log: { source: 'SFTP', records: '78,000', duration: '0m 32s', time: '25/03 07:00', status: 'Sucesso' },
    fields: [] },
};

const INGESTION_LOG = [
  { source: 'Upload CSV', records: '45,231', duration: '0m 18s', time: '24/03 09:15', status: 'Sucesso' },
  { source: 'Revfy Pixel', records: '3,100,000', duration: '—', time: 'Tempo real', status: 'Ativo' },
];

const FilterDropdown = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '13px', fontWeight: '500',
        backgroundColor: value !== options[0] ? COLORS.bgBlue : COLORS.cardBg, color: value !== options[0] ? COLORS.primary : '#333',
        border: `1px solid ${value !== options[0] ? COLORS.primary + '40' : COLORS.border}`, borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'all 0.15s ease',
      }}>
        {label}: {value} <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, backgroundColor: COLORS.cardBg, borderRadius: '10px',
          border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 24px rgba(0,0,0,.12)', zIndex: 50, minWidth: '180px', padding: '4px',
          animation: 'fadeInDown 0.15s ease',
        }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onChange(opt); setOpen(false); }} style={{
              padding: '8px 14px', fontSize: '13px', cursor: 'pointer', borderRadius: '6px', fontWeight: opt === value ? '600' : '400',
              backgroundColor: opt === value ? COLORS.bgBlue : 'transparent', color: opt === value ? COLORS.primary : '#333',
              transition: 'background-color 0.1s ease',
            }}
              onMouseEnter={e => { if (opt !== value) e.currentTarget.style.backgroundColor = COLORS.lightGray; }}
              onMouseLeave={e => { if (opt !== value) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const CalendarPicker = ({ startDate, endDate, onChangeStart, onChangeEnd, onClose }) => {
  const [viewMonth, setViewMonth] = useState(() => {
    const d = startDate ? new Date(startDate) : new Date(2026, 2, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const daysInMonth = new Date(viewMonth.year, viewMonth.month + 1, 0).getDate();
  const firstDow = new Date(viewMonth.year, viewMonth.month, 1).getDay();
  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const dayNames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const prevMonth = () => setViewMonth(p => p.month === 0 ? { year: p.year - 1, month: 11 } : { ...p, month: p.month - 1 });
  const nextMonth = () => setViewMonth(p => p.month === 11 ? { year: p.year + 1, month: 0 } : { ...p, month: p.month + 1 });
  const fmt = (y, m, d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const isInRange = (day) => {
    if (!startDate || !endDate) return false;
    const d = fmt(viewMonth.year, viewMonth.month, day);
    return d >= startDate && d <= endDate;
  };
  const isStart = (day) => startDate === fmt(viewMonth.year, viewMonth.month, day);
  const isEnd = (day) => endDate === fmt(viewMonth.year, viewMonth.month, day);
  const handleClick = (day) => {
    const d = fmt(viewMonth.year, viewMonth.month, day);
    if (!startDate || (startDate && endDate) || d < startDate) { onChangeStart(d); onChangeEnd(''); }
    else { onChangeEnd(d); }
  };
  return (
    <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 60, backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: '0 12px 32px rgba(0,0,0,.15)', padding: '16px', minWidth: '300px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: COLORS.primary, fontWeight: '700' }}>&lt;</button>
        <span style={{ fontSize: '14px', fontWeight: '700', color: '#000' }}>{monthNames[viewMonth.month]} {viewMonth.year}</span>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: COLORS.primary, fontWeight: '700' }}>&gt;</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' }}>
        {dayNames.map(dn => <div key={dn} style={{ fontSize: '10px', fontWeight: '600', color: COLORS.muted, padding: '4px 0' }}>{dn}</div>)}
        {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const inRange = isInRange(day);
          const start = isStart(day);
          const end = isEnd(day);
          return (
            <div key={day} onClick={() => handleClick(day)} style={{
              padding: '6px 0', fontSize: '12px', fontWeight: (start || end) ? '700' : '400', cursor: 'pointer', borderRadius: '6px',
              backgroundColor: (start || end) ? COLORS.primary : inRange ? COLORS.bgBlue : 'transparent',
              color: (start || end) ? '#fff' : inRange ? COLORS.primary : '#333',
            }}
              onMouseEnter={e => { if (!start && !end) e.currentTarget.style.backgroundColor = COLORS.lightGray; }}
              onMouseLeave={e => { if (!start && !end && !inRange) e.currentTarget.style.backgroundColor = 'transparent'; else if (inRange && !start && !end) e.currentTarget.style.backgroundColor = COLORS.bgBlue; }}
            >{day}</div>
          );
        })}
      </div>
      {startDate && endDate && (
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: COLORS.muted }}>{startDate.split('-').reverse().join('/')} — {endDate.split('-').reverse().join('/')}</span>
          <button onClick={onClose} style={{ padding: '6px 16px', fontSize: '12px', fontWeight: '600', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Aplicar</button>
        </div>
      )}
    </div>
  );
};

// Helper: relative time from Date object
const formatRelativeTime = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Agora';
  if (diffMin < 60) return `Há ${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Há ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'Há 1d';
  if (diffD < 7) return `Há ${diffD}d`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

const OverviewPage = ({ platformData, activityLog = [], logActivity }) => {
  const [timeframe, setTimeframe] = useState('Últimos 30 dias');
  const [audience, setAudience] = useState('Todas');
  const [destino, setDestino] = useState('Todos');
  const [compare, setCompare] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const audienceOptions = ['Todas', ...MOCK_DATA.audiences.map(a => a.name)];
  const destinoOptions = ['Todos', ...MOCK_DATA.destinations.map(d => d.name)];
  const timeframeOptions = ['Hoje', 'Últimos 7 dias', 'Últimos 30 dias', 'Últimos 90 dias', 'Este mês', 'Mês anterior', 'Personalizado'];

  const handleTimeframeChange = (val) => {
    setTimeframe(val);
    if (val === 'Personalizado') { setShowCalendar(true); }
    else { setShowCalendar(false); if (logActivity && val !== timeframe) logActivity('Filtro alterado', `Período → ${val}`, { category: 'general' }); }
  };
  const handleAudienceChange = (val) => { setAudience(val); if (logActivity && val !== audience) logActivity('Filtro alterado', `Audiência → ${val}`, { category: 'general' }); };
  const handleDestinoChange = (val) => { setDestino(val); if (logActivity && val !== destino) logActivity('Filtro alterado', `Destino → ${val}`, { category: 'general' }); };

  const handleCalendarClose = () => { setShowCalendar(false); };

  // Filter weighting for KPI calculations
  const audienceRecordWeights = {
    'Todas': 1,
    'Segmento SP 25-44': 0.28,
    'Lookalike Sudeste': 0.35,
    'Alto Valor - Classe A/B': 0.12,
    'Base Inativa 90d': 0.06,
  };
  const destinoRecordWeights = { 'Todos': 1, 'Meta': 0.42, 'Google Ads': 0.30, 'TikTok': 0.21, 'X (Twitter)': 0.07 };

  // Timeframe multiplier
  const timeMultiplier = useMemo(() => {
    if (timeframe === 'Personalizado' && customStart && customEnd) {
      const d1 = new Date(customStart); const d2 = new Date(customEnd);
      const days = Math.max(1, Math.round((d2 - d1) / 86400000));
      return days / 30;
    }
    const m = { 'Hoje': 0.08, 'Últimos 7 dias': 0.25, 'Últimos 30 dias': 1, 'Últimos 90 dias': 2.8, 'Este mês': 0.9, 'Mês anterior': 0.95 };
    return m[timeframe] || 1;
  }, [timeframe, customStart, customEnd]);

  // Combined filter multiplier
  const filterMultiplier = useMemo(() => {
    const aw = audienceRecordWeights[audience] || 0.2;
    const dw = destinoRecordWeights[destino] || 0.2;
    return aw * dw;
  }, [audience, destino]);

  // Filtered syncs — core data used by KPIs, Pipeline, Saúde
  const filteredSyncs = useMemo(() => {
    let syncs = MOCK_DATA.syncs;
    if (audience !== 'Todas') syncs = syncs.filter(s => s.audiencia === audience);
    if (destino !== 'Todos') syncs = syncs.filter(s => s.destino === destino || s.destino === destino.replace(' Ads', '').replace(' (Twitter)', ''));
    return syncs;
  }, [audience, destino]);

  const filteredDests = useMemo(() => {
    if (destino !== 'Todos') return MOCK_DATA.destinations.filter(d => d.name === destino);
    return MOCK_DATA.destinations;
  }, [destino]);

  // Match Rate data — reactive to destino + audience filters
  const matchRateByDest = useMemo(() => {
    const audienceMatchAdj = audience === 'Segmento SP 25-44' ? 3.2 : audience === 'Lookalike Sudeste' ? 1.5 : audience === 'Alto Valor - Classe A/B' ? 5.1 : audience === 'Base Inativa 90d' ? -6.2 : 0;
    return filteredDests.map(d => ({
      name: d.name,
      match: Math.min(99, Math.max(40, parseFloat(d.match) + audienceMatchAdj)),
      feedbackType: d.feedbackType,
    }));
  }, [filteredDests, audience]);

  // Filtered KPIs — all reactive to Período + Audiência + Destino
  const filteredKpis = useMemo(() => {
    const isFiltered = audience !== 'Todas' || destino !== 'Todos';

    // 1. Registros Ativados
    const baseSyncRecords = filteredSyncs.reduce((sum, s) => sum + s.records, 0);
    const filteredActivated = Math.round(baseSyncRecords * timeMultiplier);
    const activatedChange = Math.round(filteredActivated * 0.08);

    // 2. Match Rate Médio — weighted by filtered destinations
    const matchRates = filteredDests.map(d => parseFloat(d.match));
    const avgMatch = matchRates.length > 0 ? (matchRates.reduce((a, b) => a + b, 0) / matchRates.length) : 0;
    const audienceMatchAdj = audience === 'Segmento SP 25-44' ? 3.2 : audience === 'Lookalike Sudeste' ? 1.5 : audience === 'Alto Valor - Classe A/B' ? 5.1 : audience === 'Base Inativa 90d' ? -6.2 : 0;
    const finalMatchNum = Math.min(99, avgMatch + audienceMatchAdj);
    const finalMatch = finalMatchNum.toFixed(1);

    // 3. Audiências em Sync
    const uniqueSyncAuds = [...new Set(filteredSyncs.filter(s => s.status === 'Sucesso' || s.status === 'Aviso').map(s => s.audiencia))];
    const totalAuds = audience !== 'Todas' ? 1 : MOCK_DATA.audiences.length;

    // 4. Score Compliance — varies by audience risk + destination compliance
    const baseCompliance = 94;
    const audComplianceAdj = audience === 'Base Inativa 90d' ? -4 : audience === 'Alto Valor - Classe A/B' ? 1 : 0;
    const destComplianceAdj = destino === 'TikTok' ? -2 : destino === 'X (Twitter)' ? -3 : destino === 'Meta' ? 1 : 0;
    const timeComplianceAdj = timeMultiplier > 2 ? -1 : timeMultiplier < 0.3 ? 0.5 : 0;
    const complianceVal = Math.min(100, Math.max(80, baseCompliance + audComplianceAdj + destComplianceAdj + timeComplianceAdj));
    const compliancePrev = 91.9;
    const complianceDelta = (complianceVal - compliancePrev).toFixed(1);

    // 5. Créditos Consumidos — based on billing data, reactive to time filter
    const billing = MOCK_DATA.billing;
    const baseMonthCredits = billing.currentMonth.usedCredits;
    const filteredCredits = Math.round(baseMonthCredits * Math.min(timeMultiplier, 3));
    const fmtCredits = filteredCredits >= 1000 ? `${(filteredCredits/1000).toFixed(1)}K` : String(filteredCredits);
    const creditsPct = ((billing.ytdUsedCredits / billing.contract.totalCredits) * 100).toFixed(0);
    const creditsSubtext = `${creditsPct}% do contrato YTD`;

    // 6. Feedback Coverage
    const openflowCount = filteredDests.filter(d => d.feedbackType === 'full_loop').length;
    const feedbackPct = filteredDests.length > 0 ? Math.round((openflowCount / filteredDests.length) * 100) : 0;

    const kpiInfoMap = {
      'Registros Ativados': 'Total de registros enviados com sucesso para destinos de ativação. Mede o volume real do pipeline — se esse número para, nada está sendo ativado.',
      'Match Rate Médio': 'Taxa média de correspondência entre seus registros e as plataformas de destino. Quanto maior, mais do seu investimento está atingindo pessoas reais.',
      'Audiências em Sync': 'Audiências com sync ativo enviando dados para destinos. Audiências pausadas ou em rascunho não contam — só o que está rodando de verdade.',
      'Score Compliance': 'Conformidade com LGPD, ISO 27001 e SOC 2. Essencial para contratos públicos — abaixo de 90% bloqueia ativações automaticamente.',
      'Créditos Consumidos': 'Total de créditos consumidos no mês corrente por todos os serviços (Ativação, RevFy IQ, Openflow, Armazenamento, Governança).',
      'Feedback Coverage': 'Percentual de destinos retornando métricas via Openflow. Canais sem feedback são "caixas-pretas" — você ativa mas não sabe o resultado.',
    };

    return [
      { label: 'Registros Ativados', value: filteredActivated.toLocaleString('pt-BR'), change: `+${activatedChange.toLocaleString('pt-BR')}`, icon: 'send', info: kpiInfoMap['Registros Ativados'] },
      { label: 'Match Rate Médio', value: `${finalMatch}%`, change: `${(finalMatchNum - 76.6) >= 0 ? '+' : ''}${(finalMatchNum - 76.6).toFixed(1)}%`, icon: 'trending', info: kpiInfoMap['Match Rate Médio'] },
      { label: 'Audiências em Sync', value: String(uniqueSyncAuds.length), change: `de ${totalAuds} total`, icon: 'activity', info: kpiInfoMap['Audiências em Sync'] },
      { label: 'Score Compliance', value: `${complianceVal.toFixed(0)}%`, change: `${complianceDelta >= 0 ? '+' : ''}${complianceDelta}%`, icon: 'shield', info: kpiInfoMap['Score Compliance'] },
      { label: 'Créditos Consumidos', value: fmtCredits, change: creditsSubtext, icon: 'dollar', info: kpiInfoMap['Créditos Consumidos'] },
      { label: 'Feedback Coverage', value: `${feedbackPct}%`, change: `${openflowCount} de ${filteredDests.length} canal${filteredDests.length !== 1 ? 'is' : ''}`, icon: 'radar', info: kpiInfoMap['Feedback Coverage'] },
    ];
  }, [platformData.kpis, timeMultiplier, audience, destino, filteredSyncs, filteredDests]);

  // Activated records chart — reactive to all filters
  const filteredChartData = useMemo(() => {
    const base = MOCK_DATA.chartData;
    const dw = destinoRecordWeights[destino] || 1;
    const aw = audience !== 'Todas' ? (audienceRecordWeights[audience] || 0.2) * 2.5 : 1;
    return base.map(d => ({ ...d, activated: Math.round(d.records * 0.82 * timeMultiplier * dw * aw) }));
  }, [timeMultiplier, destino, audience]);

  const timeframeLabel = timeframe === 'Personalizado' && customStart && customEnd
    ? `${customStart.split('-').reverse().join('/')} — ${customEnd.split('-').reverse().join('/')}`
    : timeframe;

  // Count active filters
  const activeFilterCount = [audience !== 'Todas', destino !== 'Todos', timeframe !== 'Últimos 30 dias'].filter(Boolean).length;

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#000', margin: 0 }}>Overview</h1>
          <div style={{ fontSize: '12px', color: COLORS.muted }}>Última atualização: Hoje, 14:32</div>
        </div>

        {/* Global Filters Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', marginBottom: '28px',
          backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow,
          flexWrap: 'wrap',
        }}>
          <Filter size={16} color={COLORS.muted} />
          {/* Timeframe with calendar support */}
          <div style={{ position: 'relative' }}>
            <FilterDropdown label="Período" options={timeframeOptions} value={timeframe === 'Personalizado' && customStart && customEnd ? `${customStart.split('-').reverse().join('/')} — ${customEnd.split('-').reverse().join('/')}` : timeframe} onChange={handleTimeframeChange} />
            {showCalendar && (
              <CalendarPicker startDate={customStart} endDate={customEnd} onChangeStart={setCustomStart} onChangeEnd={setCustomEnd} onClose={handleCalendarClose} />
            )}
          </div>
          <FilterDropdown label="Audiência" options={audienceOptions} value={audience} onChange={handleAudienceChange} />
          <FilterDropdown label="Destino" options={destinoOptions} value={destino} onChange={handleDestinoChange} />
          {activeFilterCount > 0 && (
            <div style={{ padding: '4px 10px', fontSize: '11px', fontWeight: '600', backgroundColor: COLORS.primary + '15', color: COLORS.primary, borderRadius: '12px' }}>
              {activeFilterCount} filtro{activeFilterCount > 1 ? 's' : ''} ativo{activeFilterCount > 1 ? 's' : ''}
            </div>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeFilterCount > 0 && (
              <button onClick={() => { setTimeframe('Últimos 30 dias'); setAudience('Todas'); setDestino('Todos'); setShowCalendar(false); setCustomStart(''); setCustomEnd(''); }} style={{
                padding: '5px 12px', fontSize: '11px', fontWeight: '500', color: COLORS.muted, backgroundColor: COLORS.lightGray, border: `1px solid ${COLORS.border}`, borderRadius: '6px', cursor: 'pointer',
              }}>Limpar filtros</button>
            )}
            <span style={{ fontSize: '12px', color: COLORS.muted, fontWeight: '500' }}>Comparar</span>
            <div onClick={() => setCompare(!compare)} style={{
              width: '36px', height: '20px', borderRadius: '10px', cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s',
              backgroundColor: compare ? COLORS.primary : '#D1D5DB',
            }}>
              <div style={{
                width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '2px',
                transition: 'left 0.2s', left: compare ? '18px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
              }} />
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {filteredKpis.map((kpi, idx) => (
            <div key={idx} style={{
              padding: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`,
              boxShadow: COLORS.shadow, transition: 'all 0.3s ease', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = COLORS.shadow; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <div style={{ fontSize: '12px', color: COLORS.muted, fontWeight: '500' }}>{kpi.label}</div>
                    {kpi.info && <InfoTooltip text={kpi.info} />}
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: '#000', marginBottom: '6px' }}>{kpi.value}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600',
                    color: kpi.change.startsWith('-') ? COLORS.error : (kpi.change.startsWith('de ') || kpi.change === 'via Openflow' || kpi.change === 'sem Openflow') ? COLORS.muted : COLORS.success }}>
                    {!kpi.change.startsWith('de ') && !kpi.change.startsWith('Todos') && kpi.change !== 'via Openflow' && kpi.change !== 'sem Openflow' && !kpi.change.match(/^\d+ de \d+/) && (
                      kpi.change.startsWith('-') ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />
                    )}
                    {kpi.change}
                  </div>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: COLORS.bgBlue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getKPIIcon(kpi.icon)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', margin: 0 }}>Registros Ativados</h3>
                <InfoTooltip text="Evolução diária dos registros enviados com sucesso para destinos de ativação. Se essa curva cai, o pipeline parou de entregar." />
              </div>
              <span style={{ fontSize: '11px', color: COLORS.muted, padding: '4px 10px', backgroundColor: COLORS.lightGray, borderRadius: '6px' }}>{timeframeLabel}</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={filteredChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="day" stroke={COLORS.muted} fontSize={11} />
                <YAxis stroke={COLORS.muted} fontSize={11} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                <Tooltip formatter={(v) => [v.toLocaleString(), 'Ativados']} />
                <Line type="monotone" dataKey="activated" stroke={COLORS.primary} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', margin: 0 }}>Match Rate por Destino</h3>
              <InfoTooltip text="Qualidade de correspondência dos seus registros com cada plataforma. Verde = excelente, amarelo = atenção. Canais com Openflow retornam métricas de feedback." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {matchRateByDest.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: COLORS.muted }}>Nenhum destino para os filtros selecionados</div>
              )}
              {matchRateByDest.map((entry, index) => {
                const matchVal = entry.match;
                const color = matchVal >= 85 ? COLORS.success : matchVal >= 75 ? COLORS.primary : matchVal >= 70 ? '#F59E0B' : COLORS.error;
                const isOpenflow = entry.feedbackType === 'full_loop';
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#000' }}>{entry.name}</span>
                        {isOpenflow && <span style={{ fontSize: '9px', fontWeight: '600', color: COLORS.primary, opacity: 0.7 }}>OPENFLOW</span>}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '700', color }}>{matchVal}%</span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: '#F1F3F5', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${matchVal}%`, height: '100%', borderRadius: '2px', backgroundColor: color, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Row: Pipeline ao Vivo + Saúde dos Destinos + Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          {/* Pipeline ao Vivo */}
          <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', margin: 0 }}>Pipeline ao Vivo</h3>
              <InfoTooltip text="Status em tempo real de cada sync ativo — qual audiência está sendo enviada para qual destino, volume e última execução." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredSyncs.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: COLORS.muted }}>Nenhum sync para os filtros selecionados</div>
              )}
              {filteredSyncs.map((sync, i) => {
                const statusColor = sync.status === 'Sucesso' ? COLORS.success : sync.status === 'Aviso' ? '#F59E0B' : COLORS.error;
                return (
                  <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', borderLeft: `3px solid ${statusColor}`, backgroundColor: COLORS.lightGray }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>{sync.audiencia}</span>
                      <span style={{ fontSize: '10px', fontWeight: '600', color: statusColor }}>{sync.status}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: COLORS.muted }}>→ {sync.destino} · {Math.round(sync.records * timeMultiplier).toLocaleString('pt-BR')} reg · {sync.lastRun}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saúde dos Destinos */}
          <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', margin: 0 }}>Saúde dos Destinos</h3>
              <InfoTooltip text="Visão geral de cada destino conectado — match rate, audiências vinculadas e último sync. Canais com Openflow retornam métricas de campanha." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredDests.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: COLORS.muted }}>Nenhum destino para os filtros selecionados</div>
              )}
              {filteredDests.map((dest, i) => {
                const audienceMatchAdj = audience === 'Segmento SP 25-44' ? 3.2 : audience === 'Lookalike Sudeste' ? 1.5 : audience === 'Alto Valor - Classe A/B' ? 5.1 : audience === 'Base Inativa 90d' ? -6.2 : 0;
                const matchVal = Math.min(99, Math.max(40, parseFloat(dest.match) + audienceMatchAdj));
                const matchColor = matchVal >= 85 ? COLORS.success : matchVal >= 75 ? COLORS.primary : matchVal >= 70 ? '#F59E0B' : COLORS.error;
                const syncsForDest = filteredSyncs.filter(s => s.destino === dest.name || s.destino === dest.name.replace(' Ads', '').replace(' (Twitter)', ''));
                const audCount = syncsForDest.length;
                const lastSync = syncsForDest.length > 0 ? syncsForDest[0].lastRun : '—';
                const isOpenflow = dest.feedbackType === 'full_loop';
                return (
                  <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: COLORS.lightGray }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: COLORS.success }} />
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>{dest.name}</span>
                        {isOpenflow && <span style={{ fontSize: '9px', fontWeight: '600', color: COLORS.primary, opacity: 0.7 }}>OPENFLOW</span>}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: matchColor }}>{matchVal.toFixed(0)}%</span>
                    </div>
                    <div style={{ fontSize: '11px', color: COLORS.muted }}>{audCount} audiência{audCount !== 1 ? 's' : ''} · Último sync: {lastSync}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Feed */}
          <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', margin: 0 }}>Atividade Recente</h3>
              <InfoTooltip text="Log de todas as ações na plataforma — navegação, edições, syncs, aprovações. Alimenta o Audit Trail em Governança para compliance LGPD." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
              {activityLog.slice(0, 12).map((entry, idx) => {
                const catColors = { navigation: COLORS.primary, source: '#8B5CF6', sync: COLORS.success, audience: '#F59E0B', destination: '#EC4899', governance: '#06B6D4', user: '#6366F1', general: COLORS.primary };
                return (
                  <div key={idx} style={{ padding: '10px 12px', borderRadius: '8px', borderLeft: `3px solid ${catColors[entry.category] || COLORS.primary}`, backgroundColor: COLORS.lightGray }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontWeight: '600', color: '#000', fontSize: '13px' }}>{entry.action}</span>
                      <span style={{ fontSize: '10px', color: COLORS.muted, whiteSpace: 'nowrap', marginLeft: '8px' }}>{formatRelativeTime(entry.ts)}</span>
                    </div>
                    <div style={{ color: COLORS.muted, fontSize: '11px' }}>{entry.user}{entry.detail ? ` · ${entry.detail}` : ''}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DataSyncPage = ({ sourceState, sourceActions, platformData, logActivity }) => {
  const [activeTab, setActiveTab] = useState('connections');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [selectedSource, setSelectedSource] = useState(null);
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [testing, setTesting] = useState(false);
  const [testDone, setTestDone] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [authDone, setAuthDone] = useState(false);
  const [authStage, setAuthStage] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const resetWizard = () => { setShowWizard(false); setWizardStep(0); setSelectedSource(null); setTesting(false); setTestDone(false); setAuthenticating(false); setAuthDone(false); setAuthStage(0); setFilterCategory('Todos'); };
  const handleSelectSource = (source) => { setSelectedSource(source); setWizardStep(1); setAuthenticating(false); setAuthDone(false); setAuthStage(0); };

  const authStagesCredentials = ['Verificando credenciais...', 'Validando permissões...', 'Escaneando schema...', 'Detectando tabelas...'];
  const authStagesOAuth = ['Redirecionando para autorização...', 'Aguardando callback...', 'Validando token de acesso...', 'Escaneando permissões...'];

  const handleAuthenticate = () => {
    setAuthenticating(true);
    setAuthStage(0);
    const stages = selectedSource?.auth === 'oauth' ? authStagesOAuth : authStagesCredentials;
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < stages.length) {
        setAuthStage(current);
      } else {
        clearInterval(interval);
        setAuthenticating(false);
        setAuthDone(true);
      }
    }, 1200);
  };
  const handleTestConnection = () => { setTesting(true); setTimeout(() => { setTesting(false); setTestDone(true); }, 2500); };

  const handleSaveAndClose = () => {
    if (selectedSource) {
      sourceActions.handleSaveAndClose(selectedSource);
      if (logActivity) logActivity('Nova source conectada', selectedSource.name, { category: 'source' });
      resetWizard();
    } else { resetWizard(); }
  };

  const handleCardConnect = (source) => {
    if (source.name === 'Upload CSV') { setShowUploadModal(true); return; }
    const catalogMatch = SOURCE_CATALOG.find(s => s.name === source.name);
    if (catalogMatch) { setSelectedSource(catalogMatch); setShowWizard(true); setWizardStep(1); }
    else { setShowWizard(true); }
  };

  const filteredSources = filterCategory === 'Todos' ? SOURCE_CATALOG : SOURCE_CATALOG.filter(s => s.category === filterCategory);
  const [schemaTable, setSchemaTable] = useState('');
  const [schemaUniqueKey, setSchemaUniqueKey] = useState('');
  const [schemaDedupe, setSchemaDedupe] = useState(false);
  const [schemaFields, setSchemaFields] = useState([]);
  const [joinTable, setJoinTable] = useState('');
  const [joinCardinality, setJoinCardinality] = useState('many-to-one');
  const [joinKeyLeft, setJoinKeyLeft] = useState('');
  const [joinKeyRight, setJoinKeyRight] = useState('');

  const SCHEMA_TABLES = {
    'Revfy Warehouse': { project: 'REVFY_PROD', schema: 'ANALYTICS', tables: ['customers_360', 'eventos_engagement', 'transacoes_compra', 'perfis_enriquecidos', 'scores_ml'] },
    BigQuery: { project: 'revfy-analytics', schema: 'campaign_data', tables: ['bq_contacts', 'bq_transactions', 'bq_campaign_events', 'bq_segments_ml'] },
    HubSpot: { project: 'hubspot-api', schema: 'crm', tables: ['hubspot_contacts', 'hubspot_companies', 'hubspot_deals'] },
    Salesforce: { project: 'sf-api', schema: 'sobjects', tables: ['sf_leads', 'sf_accounts', 'sf_opportunities'] },
    Redshift: { project: 'revfy-cluster', schema: 'public', tables: ['rs_analytics', 'rs_events', 'rs_customers'] },
    PostgreSQL: { project: 'revfy-db', schema: 'public', tables: ['pg_users', 'pg_orders', 'pg_events', 'pg_segments'] },
  };

  const FIELD_DEFS = [
    { name: 'customer_id', type: 'STRING', alias: 'ID Cliente', pii: false, showDefault: true, excludePersonalization: false },
    { name: 'email', type: 'STRING', alias: 'Email', pii: true, showDefault: false, excludePersonalization: false },
    { name: 'cpf_hash', type: 'STRING', alias: 'CPF (Hash)', pii: true, showDefault: false, excludePersonalization: true },
    { name: 'nome_completo', type: 'STRING', alias: 'Nome', pii: true, showDefault: false, excludePersonalization: false },
    { name: 'estado', type: 'STRING', alias: 'Estado', pii: false, showDefault: true, excludePersonalization: false },
    { name: 'cidade', type: 'STRING', alias: 'Cidade', pii: false, showDefault: true, excludePersonalization: false },
    { name: 'faixa_etaria', type: 'STRING', alias: 'Faixa Etária', pii: false, showDefault: true, excludePersonalization: false },
    { name: 'classe_social', type: 'STRING', alias: 'Classe Social', pii: false, showDefault: true, excludePersonalization: false },
    { name: 'score_engajamento', type: 'FLOAT', alias: 'Score Engajamento', pii: false, showDefault: true, excludePersonalization: false },
    { name: 'propensao_conversao', type: 'FLOAT', alias: 'Propensão de Conversão', pii: false, showDefault: true, excludePersonalization: false },
    { name: 'data_nascimento', type: 'DATE', alias: 'Data Nascimento', pii: true, showDefault: false, excludePersonalization: true },
    { name: 'telefone', type: 'STRING', alias: 'Telefone', pii: true, showDefault: false, excludePersonalization: true },
    { name: 'ultimo_engajamento', type: 'TIMESTAMP', alias: 'Último Engajamento', pii: false, showDefault: true, excludePersonalization: false },
    { name: 'canal_preferido', type: 'STRING', alias: 'Canal Preferido', pii: false, showDefault: false, excludePersonalization: false },
  ];

  const initSchemaFields = () => { setSchemaFields(FIELD_DEFS.map(f => ({ ...f }))); };

  const INGEST_SOURCES = [
    { name: 'Meta Ads', desc: 'Facebook & Instagram Ads', icon: 'f', color: '#1877F2', authFields: ['Ad Account ID', 'Access Token'], protocol: 'openflow', protocolLabel: 'Openflow', metrics: '2.1M métricas', syncFreq: 'A cada 6h' },
    { name: 'Google Ads', desc: 'Search, Display & YouTube', icon: 'g', color: '#4285F4', authFields: ['Customer ID', 'Developer Token', 'OAuth Client ID'], protocol: 'openflow', protocolLabel: 'Openflow', metrics: '1.4M métricas', syncFreq: 'A cada 6h' },
  ];

  const [ingestWizard, setIngestWizard] = useState(null);
  const [ingestStep, setIngestStep] = useState(0);
  const [ingestConnecting, setIngestConnecting] = useState(false);
  const [ingestConnected, setIngestConnected] = useState({ 'Meta Ads': true, 'Google Ads': true });
  const [showIngestCatalog, setShowIngestCatalog] = useState(false);

  const INGEST_CATALOG = [
    { name: 'TikTok Ads', desc: 'Ingest TikTok campaign performance', icon: 'tt', color: '#000', authFields: ['Advertiser ID', 'Access Token'], protocol: 'api' },
    { name: 'DV360', desc: 'Display & Video 360 metrics', icon: 'dv', color: '#4285F4', authFields: ['Partner ID', 'OAuth Client ID'], protocol: 'api' },
    { name: 'Snapchat Ads', desc: 'Snap campaign metrics', icon: 'S', color: '#FFFC00', authFields: ['Organization ID', 'Access Token'], protocol: 'api' },
    { name: 'LinkedIn Ads', desc: 'LinkedIn Campaign Manager', icon: 'in', color: '#0A66C2', authFields: ['Account ID', 'Access Token'], protocol: 'api' },
    { name: 'Pinterest Ads', desc: 'Pinterest campaign metrics', icon: 'P', color: '#E60023', authFields: ['Ad Account ID', 'Access Token'], protocol: 'api' },
    { name: 'The Trade Desk', desc: 'Programmatic DSP metrics', icon: 'TD', color: '#00B140', authFields: ['Partner ID', 'API Token'], protocol: 'api' },
    { name: 'Microsoft Ads', desc: 'Bing & Microsoft Ads', icon: 'M', color: '#00A4EF', authFields: ['Account ID', 'Developer Token'], protocol: 'api' },
  ];

  // Dataset Group creation wizard
  const [showGroupWizard, setShowGroupWizard] = useState(false);
  const [groupWizardStep, setGroupWizardStep] = useState(0);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupPrimary, setNewGroupPrimary] = useState('');
  const [newGroupGranularity, setNewGroupGranularity] = useState('Individual');
  const [dynamicGroups, setDynamicGroups] = useState([]);

  const handleCreateGroup = () => {
    if (newGroupName && newGroupPrimary) {
      setDynamicGroups(prev => [...prev, {
        name: newGroupName, desc: newGroupDesc || 'Grupo personalizado', primary: newGroupPrimary,
        tables: [{ name: newGroupPrimary, role: 'Primary', records: '—', join: null }],
      }]);
      setShowGroupWizard(false); setGroupWizardStep(0); setNewGroupName(''); setNewGroupDesc(''); setNewGroupPrimary('');
    }
  };

  // Dataset creation wizard
  const [showDatasetWizard, setShowDatasetWizard] = useState(false);
  const [datasetWizardStep, setDatasetWizardStep] = useState(0);
  const [newDsGroup, setNewDsGroup] = useState('');
  const [newDsSource, setNewDsSource] = useState('');
  const [newDsTable, setNewDsTable] = useState('');
  const [newDsType, setNewDsType] = useState('Events');
  const [newDsKey, setNewDsKey] = useState('');
  const [newDsJoinKey, setNewDsJoinKey] = useState('');
  const [newDsCardinality, setNewDsCardinality] = useState('many-to-one');
  const [dynamicDatasetRows, setDynamicDatasetRows] = useState([]);
  const [syncingDs, setSyncingDs] = useState(null);
  const [editingDs, setEditingDs] = useState(null);
  const [dsStatusOverrides, setDsStatusOverrides] = useState({});
  const [deletedDs, setDeletedDs] = useState({});
  const [groupStatusOverrides, setGroupStatusOverrides] = useState({});
  const [deletedGroups, setDeletedGroups] = useState({});
  const [sourceMenuOpen, setSourceMenuOpen] = useState(null);
  const [sourceStatusOverrides, setSourceStatusOverrides] = useState({});
  const [ingestMenuOpen, setIngestMenuOpen] = useState(null);
  const [ingestStatusOverrides, setIngestStatusOverrides] = useState({});

  const handleCreateDataset = () => {
    if (newDsTable && newDsGroup) {
      setDynamicDatasetRows(prev => [...prev, {
        nome: newDsTable, fonte: newDsSource || 'Custom', tipo: newDsType, registros: '—', atualizacao: 'Configurando', qualidade: '—', status: 'Revisão',
      }]);
      setShowDatasetWizard(false); setDatasetWizardStep(0); setNewDsGroup(''); setNewDsSource(''); setNewDsTable(''); setNewDsKey(''); setNewDsJoinKey('');
    }
  };

  const handleIngestConnect = (src) => { setIngestWizard(src); setIngestStep(0); setIngestConnecting(false); };
  const handleIngestAuth = () => {
    setIngestConnecting(true);
    setTimeout(() => { setIngestConnecting(false); setIngestStep(1); }, 2000);
  };
  const handleIngestFinish = () => {
    setIngestConnected(prev => ({ ...prev, [ingestWizard.name]: true }));
    setIngestWizard(null); setIngestStep(0);
  };

  const DATASET_GROUPS = [
    { name: 'Clientes', desc: 'Perfis individuais de clientes', primary: 'customers_360', tables: [
      { name: 'customers_360', role: 'Primary', records: '3.1M', join: null },
      { name: 'eventos_engagement', role: 'Events', records: '12.4M', join: { key: 'customer_id', cardinality: 'Many-to-One' } },
      { name: 'transacoes_compra', role: 'Transactions', records: '847K', join: { key: 'customer_id', cardinality: 'Many-to-One' } },
      { name: 'scores_ml', role: 'ML Scores', records: '3.1M', join: { key: 'customer_id', cardinality: 'One-to-One' } },
    ]},
    { name: 'Households', desc: 'Audiências a nível de domicílio', primary: 'households_geo', tables: [
      { name: 'households_geo', role: 'Primary', records: '1.8M', join: null },
      { name: 'customers_360', role: 'Members', records: '3.1M', join: { key: 'household_id', cardinality: 'Many-to-One' } },
    ]},
  ];

  const stepLabels = ['Selecionar Fonte', 'Autenticação', 'Schema Mapping', 'Campos & Joins', 'Testar'];

  const tabs = ['connections', 'datasets', 'groups', 'ingest', 'logs'];
  const tabLabels = { connections: 'Data Source', datasets: 'Datasets', groups: 'Groups', ingest: 'Data Media Channels', logs: 'Logs' };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '32px' }}>
        <div style={{ marginBottom: '0' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#000' }}>Data Sync</h1>
        </div>

        <div style={{ display: 'flex', borderBottom: `2px solid ${COLORS.border}`, margin: '20px 0 24px' }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '600', color: activeTab === tab ? COLORS.primary : COLORS.muted, cursor: 'pointer', borderBottom: activeTab === tab ? `2px solid ${COLORS.primary}` : '2px solid transparent', marginBottom: '-2px', background: 'none', border: 'none', borderBottomStyle: 'solid', borderBottomWidth: '2px', borderBottomColor: activeTab === tab ? COLORS.primary : 'transparent', transition: 'all 0.15s' }}>{tabLabels[tab]}</button>
          ))}
        </div>

        {activeTab === 'connections' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {sourceState.visibleSources.map((source) => {
                const resolved = sourceState.getSourceStatus(source);
                const overrideStatus = sourceStatusOverrides[source.name];
                const effectiveStatus = overrideStatus || resolved.status;
                const isActive = effectiveStatus === 'Ativo' || effectiveStatus === 'Conectado' || effectiveStatus === 'Nativo';
                const isPaused = effectiveStatus === 'Pausado';
                return (
                  <div key={source.id} style={{ padding: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${isPaused ? '#F59E0B40' : isActive ? COLORS.primary + '25' : COLORS.border}`, cursor: 'pointer', transition: 'all 0.2s', opacity: isPaused ? 0.65 : 1, position: 'relative' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary + '60'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = isPaused ? '#F59E0B40' : isActive ? COLORS.primary + '25' : COLORS.border; e.currentTarget.style.boxShadow = 'none'; }}
                    onClick={() => handleCardConnect(source)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      {getSourceIcon(source.name)}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#000' }}>{source.name}</div>
                        <div style={{ fontSize: '12px', color: COLORS.muted }}>{source.type}</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setSourceMenuOpen(sourceMenuOpen === source.name ? null : source.name); }} style={{ padding: '4px 6px', fontSize: '14px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', background: 'none', cursor: 'pointer', color: COLORS.muted, lineHeight: 1 }}>⋯</button>
                    </div>
                    {sourceMenuOpen === source.name && (
                      <div style={{ position: 'absolute', right: '12px', top: '52px', backgroundColor: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,.1)', zIndex: 10, minWidth: '150px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                        <div onClick={() => { handleCardConnect(source); setSourceMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#000' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Edit</div>
                        {isPaused ? (
                          <div onClick={() => { setSourceStatusOverrides(p => ({...p, [source.name]: 'Ativo'})); logActivity('Source reativada', source.name, { category: 'source' }); setSourceMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: COLORS.success }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Resume</div>
                        ) : (
                          <div onClick={() => { setSourceStatusOverrides(p => ({...p, [source.name]: 'Pausado'})); logActivity('Source pausada', source.name, { category: 'source' }); setSourceMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#C2740C' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Pause</div>
                        )}
                        <div onClick={() => { sourceActions.handleSourceAction(source, 'delete'); setSourceMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#DC2626' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Disconnect</div>
                      </div>
                    )}
                    {resolved.extra && <div style={{ fontSize: '12px', color: COLORS.primary, fontWeight: '600', marginBottom: '8px' }}>{resolved.extra}</div>}
                    <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '12px' }}>Sync {resolved.lastSync === 'Tempo real' ? 'tempo real' : resolved.lastSync || '—'}</div>
                    <Badge color={isPaused ? 'yellow' : isActive ? (resolved.status === 'Nativo' ? 'blue' : 'green') : 'blue'}>{isPaused ? 'Pausado' : effectiveStatus}</Badge>
                  </div>
                );
              })}
              <div onClick={() => setShowWizard(true)} style={{ padding: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `2px dashed ${COLORS.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.backgroundColor = COLORS.bgBlue; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.backgroundColor = COLORS.cardBg; }}>
                <div style={{ textAlign: 'center' }}>
                  <Plus size={28} color={COLORS.primary} style={{ marginBottom: '6px' }} />
                  <div style={{ fontSize: '13px', fontWeight: '600', color: COLORS.primary }}>Connect Source</div>
                </div>
              </div>
            </div>
            <div style={{ padding: '12px 16px', backgroundColor: COLORS.bgBlue, borderRadius: '8px', fontSize: '13px', color: COLORS.primary }}>
              <strong>Sources are live inventories.</strong> You can add new tables to an existing connection at any time — your Audience builder will reflect changes on the next sync cycle.
            </div>
          </div>
        )}

        {activeTab === 'datasets' && (
          <div>
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Dataset</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Source</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Rows</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Last Sync</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Actions</th>
                </tr></thead>
                <tbody>
                  {[...platformData.allDatasets, ...dynamicDatasetRows].filter(ds => !deletedDs[ds.nome]).map((ds, idx) => {
                    const effectiveStatus = dsStatusOverrides[ds.nome] || ds.status;
                    const isPaused = effectiveStatus === 'Pausado';
                    const isReview = effectiveStatus === 'Review';
                    return (
                    <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.border}`, opacity: isPaused ? 0.6 : 1 }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '12px', fontSize: '13px' }}><div style={{ fontWeight: '600' }}>{ds.nome}</div></td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{ds.fonte}</td>
                      <td style={{ padding: '12px', fontSize: '13px', fontWeight: '600' }}>{ds.registros}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{isPaused ? <Badge color="yellow">Paused</Badge> : isReview ? <Badge color="yellow">Review</Badge> : <Badge color="green">Active</Badge>}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{ds.atualizacao}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', gap: '6px', position: 'relative' }}>
                          {!isPaused && <button onClick={() => { setSyncingDs(ds.nome); logActivity('Sync manual iniciado', ds.nome, { category: 'sync' }); setTimeout(() => setSyncingDs(null), 2500); }} style={{ padding: '4px 10px', fontSize: '11px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', background: syncingDs === ds.nome ? COLORS.primary + '15' : 'none', cursor: 'pointer', color: COLORS.primary }}>{syncingDs === ds.nome ? '⟳ Syncing...' : 'Sync'}</button>}
                          <button onClick={() => setEditingDs(editingDs === ds.nome ? null : ds.nome)} style={{ padding: '4px 8px', fontSize: '11px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', background: 'none', cursor: 'pointer', color: COLORS.muted }}>⋯</button>
                          {editingDs === ds.nome && (
                            <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '4px', backgroundColor: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,.1)', zIndex: 10, minWidth: '160px', overflow: 'hidden' }}>
                              {isReview && <div onClick={() => { setDsStatusOverrides(p => ({...p, [ds.nome]: 'Ativo'})); logActivity('Dataset aprovado', ds.nome, { category: 'sync' }); setEditingDs(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: COLORS.success, fontWeight: '600' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Approve</div>}
                              <div onClick={() => { logActivity('Dataset aberto para edição', ds.nome, { category: 'sync' }); setEditingDs(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#000' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Edit</div>
                              {isPaused ? (
                                <div onClick={() => { setDsStatusOverrides(p => ({...p, [ds.nome]: 'Ativo'})); logActivity('Dataset reativado', ds.nome, { category: 'sync' }); setEditingDs(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: COLORS.success }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Resume</div>
                              ) : (
                                <div onClick={() => { setDsStatusOverrides(p => ({...p, [ds.nome]: 'Pausado'})); logActivity('Dataset pausado', ds.nome, { category: 'sync' }); setEditingDs(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#C2740C' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Pause</div>
                              )}
                              <div onClick={() => { setDeletedDs(p => ({...p, [ds.nome]: true})); logActivity('Dataset removido', ds.nome, { category: 'sync' }); setEditingDs(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#DC2626' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Delete</div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                  {sourceState.activeSourceNames.length <= 1 && (
                    <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: COLORS.muted, fontSize: '13px' }}>
                      <Database size={24} style={{ marginBottom: '8px', opacity: 0.3 }} /><br />Conecte fontes de dados para ver os datasets disponíveis
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'groups' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', margin: 0 }}>Dataset Groups</h3>
                <p style={{ fontSize: '12px', color: COLORS.muted, margin: '4px 0 0' }}>Grupos de tabelas com joins pré-configurados. Cada grupo tem uma tabela primária que define o nível de granularidade.</p>
              </div>
              <button onClick={() => setShowGroupWizard(true)} style={{ padding: '8px 16px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>+ Novo Grupo</button>
            </div>
            {[...DATASET_GROUPS, ...dynamicGroups].filter(g => !deletedGroups[g.name]).map((group, gIdx) => {
              const grpStatus = groupStatusOverrides[group.name] || 'Ativo';
              const grpPaused = grpStatus === 'Pausado';
              return (
              <div key={gIdx} style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${grpPaused ? '#F59E0B40' : COLORS.border}`, boxShadow: COLORS.shadow, padding: '20px', marginBottom: '20px', opacity: grpPaused ? 0.65 : 1, transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: COLORS.bgBlue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={18} color={COLORS.primary} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#000' }}>{group.name}</div>
                      <div style={{ fontSize: '12px', color: COLORS.muted }}>{group.desc}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                    <Badge color={grpPaused ? 'yellow' : 'green'}>{grpPaused ? 'Pausado' : 'Ativo'}</Badge>
                    <button onClick={() => setEditingDs(editingDs === group.name ? null : group.name)} style={{ padding: '4px 8px', fontSize: '11px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', background: 'none', cursor: 'pointer', color: COLORS.muted }}>⋯</button>
                    {editingDs === group.name && (
                      <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '4px', backgroundColor: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,.1)', zIndex: 10, minWidth: '160px', overflow: 'hidden' }}>
                        <div onClick={() => { logActivity('Grupo aberto para edição', group.name, { category: 'governance' }); setEditingDs(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#000' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Edit</div>
                        {grpPaused ? (
                          <div onClick={() => { setGroupStatusOverrides(p => ({...p, [group.name]: 'Ativo'})); logActivity('Grupo reativado', group.name, { category: 'governance' }); setEditingDs(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: COLORS.success }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Resume</div>
                        ) : (
                          <div onClick={() => { setGroupStatusOverrides(p => ({...p, [group.name]: 'Pausado'})); logActivity('Grupo pausado', group.name, { category: 'governance' }); setEditingDs(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#C2740C' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Pause</div>
                        )}
                        <div onClick={() => { setDeletedGroups(p => ({...p, [group.name]: true})); logActivity('Grupo removido', group.name, { category: 'governance' }); setEditingDs(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#DC2626' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Delete</div>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {group.tables.map((t, tIdx) => (
                    <div key={tIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: t.role === 'Primary' ? COLORS.bgBlue : COLORS.lightGray, borderRadius: '8px', border: t.role === 'Primary' ? `1px solid ${COLORS.primary}30` : `1px solid ${COLORS.border}` }}>
                      {tIdx > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <div style={{ width: '20px', height: '1px', backgroundColor: COLORS.primary }} />
                          <span style={{ fontSize: '10px', fontWeight: '700', color: COLORS.primary, backgroundColor: COLORS.bgBlue, padding: '2px 6px', borderRadius: '3px', whiteSpace: 'nowrap' }}>{t.join.cardinality}</span>
                          <div style={{ width: '12px', height: '1px', backgroundColor: COLORS.primary }} />
                        </div>
                      )}
                      <div style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '600', color: '#000', flex: 1 }}>{t.name}</div>
                      <Badge color={t.role === 'Primary' ? 'blue' : 'green'} variant="soft">{t.role}</Badge>
                      <span style={{ fontSize: '11px', color: COLORS.muted }}>{t.records}</span>
                      {t.join && <span style={{ fontSize: '10px', color: COLORS.muted, fontFamily: 'monospace' }}>ON {t.join.key}</span>}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: COLORS.lightGray, borderRadius: '6px', fontSize: '11px', color: COLORS.muted }}>
                  <strong style={{ color: '#000' }}>Wide Table Recomendação:</strong> Para performance ótima em bancos colunares, consolide atributos do cliente diretamente na tabela primária para reduzir joins em runtime.
                </div>
              </div>
              );
            })}
          </div>
        )}

        {activeTab === 'ingest' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {INGEST_SOURCES.map((src, i) => {
                const connected = ingestConnected[src.name];
                const chStatus = ingestStatusOverrides[src.name];
                const chPaused = chStatus === 'Pausado';
                return (
                  <div key={i} onClick={() => !connected && handleIngestConnect(src)} style={{ padding: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${chPaused ? '#F59E0B40' : connected ? COLORS.primary + '25' : COLORS.border}`, cursor: connected ? 'default' : 'pointer', transition: 'all 0.2s', opacity: chPaused ? 0.65 : 1, position: 'relative' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary + '60'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = chPaused ? '#F59E0B40' : connected ? COLORS.primary + '25' : COLORS.border; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: src.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: src.icon.length > 2 ? '10px' : '14px', fontWeight: '700', color: src.color, flexShrink: 0 }}>{src.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#000' }}>{src.name}</div>
                        <div style={{ fontSize: '12px', color: COLORS.muted }}>{src.desc}</div>
                      </div>
                      {connected && <button onClick={(e) => { e.stopPropagation(); setIngestMenuOpen(ingestMenuOpen === src.name ? null : src.name); }} style={{ padding: '4px 6px', fontSize: '14px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', background: 'none', cursor: 'pointer', color: COLORS.muted, lineHeight: 1 }}>⋯</button>}
                    </div>
                    {ingestMenuOpen === src.name && (
                      <div style={{ position: 'absolute', right: '12px', top: '52px', backgroundColor: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,.1)', zIndex: 10, minWidth: '150px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                        <div onClick={() => { logActivity('Channel aberto para edição', src.name, { category: 'sync' }); setIngestMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#000' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Edit</div>
                        {chPaused ? (
                          <div onClick={() => { setIngestStatusOverrides(p => ({...p, [src.name]: 'Ativo'})); logActivity('Channel reativado', src.name, { category: 'sync' }); setIngestMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: COLORS.success }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Resume</div>
                        ) : (
                          <div onClick={() => { setIngestStatusOverrides(p => ({...p, [src.name]: 'Pausado'})); logActivity('Channel pausado', src.name, { category: 'sync' }); setIngestMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#C2740C' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Pause</div>
                        )}
                        <div onClick={() => { setIngestConnected(p => { const n = {...p}; delete n[src.name]; return n; }); logActivity('Channel desconectado', src.name, { category: 'sync' }); setIngestMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#DC2626' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Disconnect</div>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', fontSize: '10px', fontWeight: '600', color: '#065F46', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ArrowLeftRight size={10} /> Full Loop • Openflow</span>
                      {src.metrics && <span style={{ fontSize: '12px', color: COLORS.primary, fontWeight: '600' }}>{src.metrics}</span>}
                    </div>
                    <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '12px' }}>Sync {connected ? (chPaused ? 'pausado' : `ativo • ${src.syncFreq}`) : src.syncFreq.toLowerCase()}</div>
                    <Badge color={chPaused ? 'yellow' : connected ? 'green' : 'blue'}>{chPaused ? 'Pausado' : connected ? 'Conectado' : 'Conectar'}</Badge>
                  </div>
                );
              })}
              <div onClick={() => setShowIngestCatalog(true)} style={{ padding: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `2px dashed ${COLORS.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.backgroundColor = COLORS.bgBlue; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.backgroundColor = COLORS.cardBg; }}>
                <div style={{ textAlign: 'center' }}>
                  <Plus size={28} color={COLORS.primary} style={{ marginBottom: '6px' }} />
                  <div style={{ fontSize: '13px', fontWeight: '600', color: COLORS.primary }}>Add Feedback Channel</div>
                </div>
              </div>
            </div>
            <div style={{ padding: '12px 16px', backgroundColor: COLORS.bgBlue, borderRadius: '8px', fontSize: '13px', color: COLORS.primary }}>
              <strong>Feedback channels ingest campaign metrics via Openflow.</strong> Impressões, cliques, conversões e custos retornam nativamente ao Data Warehouse. Canais somente de ativação estão em Destinos.
            </div>
          </div>
        )}

        {/* Ingest Channel Catalog Modal */}
        <Modal isOpen={showIngestCatalog} title="Adicionar Canal de Mídia" onClose={() => setShowIngestCatalog(false)}>
          <p style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '16px', marginTop: 0 }}>Selecione um canal para conectar feedback de campanha ao seu Data Warehouse.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {INGEST_CATALOG.filter(c => !ingestConnected[c.name]).map((ch, i) => (
              <div key={i} onClick={() => { setShowIngestCatalog(false); handleIngestConnect(ch); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px', border: `1px solid ${COLORS.border}`, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = ch.color; e.currentTarget.style.backgroundColor = COLORS.lightGray; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: ch.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: ch.icon.length > 2 ? '10px' : '14px', fontWeight: '700', color: ch.color, flexShrink: 0 }}>{ch.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#000' }}>{ch.name}</div>
                  <div style={{ fontSize: '11px', color: COLORS.muted }}>{ch.desc}</div>
                </div>
                <span style={{ padding: '3px 10px', borderRadius: '20px', backgroundColor: '#FFF7ED', border: '1px solid #FED7AA', fontSize: '10px', fontWeight: '600', color: '#9A3412' }}>API</span>
              </div>
            ))}
          </div>
        </Modal>

        {/* Ingest Wizard Modal */}
        <Modal isOpen={!!ingestWizard} title={ingestWizard ? `Conectar ${ingestWizard.name}` : ''} onClose={() => setIngestWizard(null)}>
          {ingestWizard && ingestStep === 0 && !ingestConnecting && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '16px', backgroundColor: COLORS.lightGray, borderRadius: '10px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: ingestWizard.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: ingestWizard.color }}>{ingestWizard.icon}</div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#000' }}>{ingestWizard.name}</div>
                  <div style={{ fontSize: '12px', color: COLORS.muted }}>{ingestWizard.desc}</div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '16px' }}>Autentique sua conta para que a Revfy possa ingerir dados de performance (impressões, cliques, conversões, custos) diretamente no seu Data Warehouse.</p>
              {ingestWizard.authFields.map((field, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>{field}</label>
                  <input type={field.toLowerCase().includes('token') || field.toLowerCase().includes('secret') || field.toLowerCase().includes('key') ? 'password' : 'text'} placeholder={`Inserir ${field}`} style={{ width: '100%', padding: '9px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', backgroundColor: COLORS.lightGray, boxSizing: 'border-box', outline: 'none' }} onFocus={e => e.target.style.borderColor = ingestWizard.color} onBlur={e => e.target.style.borderColor = COLORS.border} />
                </div>
              ))}
              <button onClick={handleIngestAuth} style={{ width: '100%', padding: '12px', backgroundColor: ingestWizard.color, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>Autenticar e Conectar</button>
              <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: `${COLORS.success}10`, borderRadius: '6px', fontSize: '11px', color: COLORS.muted }}>
                <strong style={{ color: COLORS.success }}>Segurança:</strong> Credenciais criptografadas com AES-256. Dados fluem diretamente para o seu warehouse — a Revfy nunca armazena dados de campanha.
              </div>
            </div>
          )}
          {ingestWizard && ingestStep === 0 && ingestConnecting && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: '48px', height: '48px', border: `4px solid ${COLORS.border}`, borderTopColor: ingestWizard.color, borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>Conectando a {ingestWizard.name}...</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '280px', margin: '16px auto 0' }}>
                {['Validando credenciais...', 'Listando ad accounts...', 'Verificando permissões...'].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: COLORS.lightGray, borderRadius: '6px', fontSize: '12px', color: '#000' }}>
                    <div style={{ width: '14px', height: '14px', border: `2px solid ${COLORS.border}`, borderTopColor: ingestWizard.color, borderRadius: '50%', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
          {ingestWizard && ingestStep === 1 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: `${COLORS.success}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Check size={28} color={COLORS.success} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: COLORS.success }}>Autenticação bem-sucedida</h3>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>Conta / Propriedade</label>
                <select style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px' }}>
                  <option>Revfy Platform — Conta Principal</option>
                  <option>Revfy Platform — Conta Teste</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>Destino no Warehouse</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <select style={{ padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '12px' }}>
                    <option>REVFY_PROD</option>
                  </select>
                  <select style={{ padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '12px' }}>
                    <option>INGEST.{ingestWizard.name.toLowerCase().replace(/\s+/g, '_')}</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>Frequência de Ingestão</label>
                <select style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px' }}>
                  <option>Diária (recomendado)</option><option>A cada 6 horas</option><option>Horária</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>Dados a Ingerir</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {['Campanhas e Ad Sets', 'Métricas de Performance (impressões, cliques, CTR)', 'Custos e ROAS', 'Conversões e Atribuição'].map((item, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: COLORS.lightGray, borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ width: '14px', height: '14px' }} /> {item}
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={handleIngestFinish} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.success, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Ativar Ingestão</button>
            </div>
          )}
        </Modal>

        {activeTab === 'logs' && (
          <div>
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
              {(() => {
                const visibleRows = platformData.allLogs.filter(r => sourceState.activeSourceNames.includes(r.source));
                if (visibleRows.length === 0) return (
                  <div style={{ textAlign: 'center', padding: '48px 20px', color: COLORS.muted }}>
                    <Database size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Nenhum log disponível</div>
                    <div style={{ fontSize: '12px' }}>Conecte uma fonte para ver o histórico de sincronização</div>
                  </div>
                );
                return (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead><tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Source</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Records</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Duration</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Timestamp</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Status</th>
                    </tr></thead>
                    <tbody>
                      {visibleRows.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.border}` }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td style={{ padding: '12px', fontWeight: '600' }}>{row.source}</td>
                          <td style={{ padding: '12px' }}>{row.records}</td>
                          <td style={{ padding: '12px' }}>{row.duration}</td>
                          <td style={{ padding: '12px' }}>{row.time}</td>
                          <td style={{ padding: '12px' }}><Badge color={row.status === 'Sucesso' || row.status === 'Ativo' ? 'green' : 'yellow'}>{row.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={showWizard} title={selectedSource ? `Conectar ${selectedSource.name}` : 'Conectar Nova Fonte'} onClose={resetWizard}>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px' }}>
          {stepLabels.map((label, idx) => (
            <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ height: '4px', borderRadius: '2px', backgroundColor: idx <= wizardStep ? COLORS.primary : COLORS.border, marginBottom: '8px', transition: 'all 0.3s' }} />
              <span style={{ fontSize: '11px', fontWeight: idx === wizardStep ? '700' : '500', color: idx <= wizardStep ? COLORS.primary : COLORS.muted }}>{label}</span>
            </div>
          ))}
        </div>

        {wizardStep === 0 && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {['Todos', 'ETL', 'API', 'CSV'].map((cat) => (
                <button key={cat} onClick={() => setFilterCategory(cat)} style={{ padding: '6px 16px', borderRadius: '20px', border: `1px solid ${filterCategory === cat ? COLORS.primary : COLORS.border}`, backgroundColor: filterCategory === cat ? COLORS.bgBlue : 'transparent', color: filterCategory === cat ? COLORS.primary : COLORS.muted, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>{cat}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxHeight: '320px', overflowY: 'auto' }}>
              {filteredSources.map((s) => (
                <button key={s.name} onClick={() => handleSelectSource(s)} style={{ padding: '16px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: COLORS.cardBg, transition: 'all 0.2s', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = COLORS.bgBlue; e.currentTarget.style.borderColor = COLORS.primary; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = COLORS.cardBg; e.currentTarget.style.borderColor = COLORS.border; }}>
                  <div style={{ marginBottom: '8px' }}>{getSourceIcon(s.name)}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>{s.name}</div>
                  <div style={{ fontSize: '10px', color: COLORS.muted, marginTop: '4px', textTransform: 'uppercase' }}>{s.category}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {wizardStep === 1 && selectedSource && (
          <div>
            {authenticating && (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <div style={{ width: '56px', height: '56px', border: `4px solid ${COLORS.border}`, borderTopColor: COLORS.primary, borderRadius: '50%', margin: '0 auto 24px', animation: 'spin 1s linear infinite' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '24px' }}>
                  {selectedSource.auth === 'oauth' ? `Autenticando com ${selectedSource.name}...` : `Conectando a ${selectedSource.name}...`}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
                  {(selectedSource.auth === 'oauth' ? authStagesOAuth : authStagesCredentials).map((stage, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: idx <= authStage ? `${COLORS.success}10` : COLORS.lightGray, borderRadius: '8px', transition: 'all 0.4s ease' }}>
                      {idx < authStage ? <Check size={16} color={COLORS.success} /> : idx === authStage ? <div style={{ width: '16px', height: '16px', border: `2px solid ${COLORS.border}`, borderTopColor: COLORS.primary, borderRadius: '50%', animation: 'spin 1s linear infinite', flexShrink: 0 }} /> : <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${COLORS.border}`, flexShrink: 0 }} />}
                      <span style={{ fontSize: '13px', fontWeight: idx === authStage ? '600' : '400', color: idx <= authStage ? '#000' : COLORS.muted }}>{stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {authDone && (
              <div style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: `${COLORS.success}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={32} color={COLORS.success} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: COLORS.success, marginBottom: '8px' }}>
                  {selectedSource.auth === 'oauth' ? 'Autorização concluída!' : 'Credenciais validadas!'}
                </h3>
                <p style={{ fontSize: '13px', color: COLORS.muted, marginBottom: '16px' }}>Conexão com {selectedSource.name} verificada com sucesso.</p>
                <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px', padding: '12px 24px', backgroundColor: COLORS.lightGray, borderRadius: '8px', fontSize: '12px', color: COLORS.muted, marginBottom: '24px', textAlign: 'left' }}>
                  <span>Latência: <strong style={{ color: '#000' }}>38ms</strong></span>
                  <span>Permissões: <strong style={{ color: COLORS.success }}>Leitura OK</strong></span>
                  <span>Tabelas detectadas: <strong style={{ color: '#000' }}>4 objetos</strong></span>
                </div>
                <div><button onClick={() => setWizardStep(2)} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Continuar Configuração</button></div>
              </div>
            )}

            {!authenticating && !authDone && selectedSource.auth === 'credentials' && (
              <div>
                {selectedSource.fields.map(field => (
                  <div key={field} style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#000' }}>{field}</label>
                    <input type={field.toLowerCase().includes('password') || field.toLowerCase().includes('private key') || field.toLowerCase().includes('secret') ? 'password' : 'text'} placeholder={`Inserir ${field.toLowerCase()}`} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', backgroundColor: COLORS.lightGray, outline: 'none', boxSizing: 'border-box' }} onFocus={(e) => e.target.style.borderColor = COLORS.primary} onBlur={(e) => e.target.style.borderColor = COLORS.border} />
                  </div>
                ))}
                <button onClick={handleAuthenticate} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Zap size={16} /> Conectar a {selectedSource.name}</button>
                <div style={{ marginTop: '12px', padding: '10px 14px', backgroundColor: `${COLORS.success}10`, borderRadius: '8px', fontSize: '11px', color: COLORS.muted }}><strong style={{ color: COLORS.success }}>Segurança:</strong> Credenciais criptografadas com AES-256. Acesso somente leitura ao schema especificado.</div>
              </div>
            )}

            {!authenticating && !authDone && selectedSource.auth === 'oauth' && (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: `${COLORS.primary}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Link2 size={28} color={COLORS.primary} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '8px' }}>Autorizar {selectedSource.name}</h3>
                <p style={{ fontSize: '13px', color: COLORS.muted, marginBottom: '24px' }}>Você será redirecionado para autorizar o acesso via OAuth 2.0</p>
                <button onClick={handleAuthenticate} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Link2 size={16} /> Autorizar com {selectedSource.name}</button>
              </div>
            )}

            {!authenticating && !authDone && selectedSource.auth === 'none' && (
              <div style={{ textAlign: 'center', padding: '32px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}><FileSpreadsheet size={48} color={COLORS.muted} /></div>
                <p style={{ fontSize: '13px', color: COLORS.muted, marginBottom: '20px' }}>Arraste um arquivo CSV ou clique para selecionar</p>
                <div style={{ padding: '40px', border: `2px dashed ${COLORS.border}`, borderRadius: '12px', cursor: 'pointer', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.primary} onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.border}><Plus size={32} color={COLORS.muted} /></div>
                <button onClick={() => setWizardStep(2)} style={{ padding: '12px 32px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Upload e Continuar</button>
              </div>
            )}
          </div>
        )}

        {wizardStep === 2 && selectedSource && (
          <div>
            <div style={{ padding: '12px 16px', backgroundColor: `${COLORS.success}10`, borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', border: `1px solid ${COLORS.success}30` }}>
              <Check size={16} color={COLORS.success} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>Conexão com {selectedSource.name} ativa</span>
              <span style={{ fontSize: '11px', color: COLORS.muted, marginLeft: 'auto' }}>Schema detectado</span>
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>Mapear Tabela Primária</h4>
            <p style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '16px' }}>Selecione a tabela principal que será usada para construir audiências. Esta é a sua tabela de clientes/clientes.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.muted, marginBottom: '4px' }}>Projeto / Database</label>
                <select style={{ width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '12px', backgroundColor: COLORS.lightGray }}>
                  <option>{(SCHEMA_TABLES[selectedSource.name] || SCHEMA_TABLES['Revfy Warehouse']).project}</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.muted, marginBottom: '4px' }}>Schema</label>
                <select style={{ width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '12px', backgroundColor: COLORS.lightGray }}>
                  <option>{(SCHEMA_TABLES[selectedSource.name] || SCHEMA_TABLES['Revfy Warehouse']).schema}</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.muted, marginBottom: '4px' }}>Tabela Primária (Clientes)</label>
              <select value={schemaTable} onChange={e => { setSchemaTable(e.target.value); initSchemaFields(); }} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.primary}40`, borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                <option value="">Selecione uma tabela...</option>
                {(SCHEMA_TABLES[selectedSource.name] || SCHEMA_TABLES['Revfy Warehouse']).tables.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {schemaTable && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.muted, marginBottom: '4px' }}>Chave Única</label>
                    <select value={schemaUniqueKey} onChange={e => setSchemaUniqueKey(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '12px' }}>
                      <option value="">Selecione...</option>
                      <option value="customer_id">customer_id</option>
                      <option value="cpf_hash">cpf_hash</option>
                      <option value="email">email</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.muted, marginBottom: '4px' }}>Tipo do Dataset</label>
                    <select style={{ width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '12px' }}>
                      <option>Customers (Clientes)</option>
                      <option>Events</option>
                      <option>Transactions</option>
                    </select>
                  </div>
                </div>
                {schemaUniqueKey && (
                  <div style={{ padding: '10px 14px', backgroundColor: `${COLORS.success}10`, borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <Check size={14} color={COLORS.success} />
                    <span style={{ color: COLORS.success, fontWeight: '600' }}>Chave única "{schemaUniqueKey}" validada</span>
                    <span style={{ color: COLORS.muted }}>— 0 duplicatas detectadas</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: COLORS.lightGray, borderRadius: '8px', marginBottom: '16px' }}>
                  <div onClick={() => setSchemaDedupe(!schemaDedupe)} style={{ width: '32px', height: '18px', borderRadius: '9px', cursor: 'pointer', backgroundColor: schemaDedupe ? COLORS.primary : '#D1D5DB', position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '2px', left: schemaDedupe ? '16px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,.2)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#000' }}>Resolução de Duplicidade</div>
                    <div style={{ fontSize: '11px', color: COLORS.muted }}>Prioriza linhas com menos valores nulos — seleção determinística</div>
                  </div>
                </div>
              </div>
            )}
            <button onClick={() => { if (schemaTable) { if (schemaFields.length === 0) initSchemaFields(); setWizardStep(3); } }} disabled={!schemaTable} style={{ width: '100%', padding: '12px', backgroundColor: schemaTable ? COLORS.primary : COLORS.border, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: schemaTable ? 'pointer' : 'default' }}>Continuar — Configurar Campos</button>
          </div>
        )}

        {wizardStep === 3 && selectedSource && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>Configuração de Campos</h4>
            <p style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '16px' }}>Configure aliases, marque campos PII e selecione colunas visíveis por padrão.</p>
            <div style={{ maxHeight: '280px', overflowY: 'auto', border: `1px solid ${COLORS.border}`, borderRadius: '8px', marginBottom: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead><tr style={{ backgroundColor: COLORS.lightGray, position: 'sticky', top: 0 }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '700', color: COLORS.muted }}>Coluna</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '700', color: COLORS.muted }}>Tipo</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '700', color: COLORS.muted }}>Alias</th>
                  <th style={{ padding: '8px 6px', textAlign: 'center', fontWeight: '700', color: COLORS.muted }}>PII</th>
                  <th style={{ padding: '8px 6px', textAlign: 'center', fontWeight: '700', color: COLORS.muted }}>Padrão</th>
                  <th style={{ padding: '8px 6px', textAlign: 'center', fontWeight: '700', color: COLORS.muted }}>Excluir</th>
                </tr></thead>
                <tbody>
                  {schemaFields.map((f, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <td style={{ padding: '6px 10px', fontFamily: 'monospace', fontSize: '11px', fontWeight: '600' }}>{f.name}</td>
                      <td style={{ padding: '6px 10px' }}><span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: f.type === 'STRING' ? '#EEF2FF' : f.type === 'FLOAT' ? '#FEF3C7' : '#E0F2FE', color: f.type === 'STRING' ? '#4338CA' : f.type === 'FLOAT' ? '#92400E' : '#0369A1', fontWeight: '600' }}>{f.type}</span></td>
                      <td style={{ padding: '4px 6px' }}><input type="text" value={f.alias} onChange={e => { const nf = [...schemaFields]; nf[i] = { ...nf[i], alias: e.target.value }; setSchemaFields(nf); }} style={{ width: '100%', padding: '4px 6px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }} /></td>
                      <td style={{ padding: '4px', textAlign: 'center' }}><input type="checkbox" checked={f.pii} onChange={() => { const nf = [...schemaFields]; nf[i] = { ...nf[i], pii: !nf[i].pii }; setSchemaFields(nf); }} style={{ width: '14px', height: '14px', accentColor: COLORS.error }} /></td>
                      <td style={{ padding: '4px', textAlign: 'center' }}><input type="checkbox" checked={f.showDefault} onChange={() => { const nf = [...schemaFields]; nf[i] = { ...nf[i], showDefault: !nf[i].showDefault }; setSchemaFields(nf); }} style={{ width: '14px', height: '14px', accentColor: COLORS.primary }} /></td>
                      <td style={{ padding: '4px', textAlign: 'center' }}><input type="checkbox" checked={f.excludePersonalization} onChange={() => { const nf = [...schemaFields]; nf[i] = { ...nf[i], excludePersonalization: !nf[i].excludePersonalization }; setSchemaFields(nf); }} style={{ width: '14px', height: '14px', accentColor: '#F59E0B' }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '10px 12px', backgroundColor: COLORS.bgBlue, borderRadius: '8px', marginBottom: '16px', fontSize: '11px', color: COLORS.primary }}>
              <strong>PII:</strong> Oculta valores na UI e restringe filtros. <strong>Padrão:</strong> Aparece automaticamente no Audience Builder. <strong>Excluir:</strong> Permite filtros mas bloqueia exportação.
            </div>

            {/* Join Configuration */}
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '8px', borderTop: `1px solid ${COLORS.border}`, paddingTop: '16px' }}>Join de Tabelas</h4>
            <p style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '12px' }}>Configure como tabelas de eventos e transações se conectam à tabela primária.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: COLORS.muted, marginBottom: '4px' }}>Tabela para Join</label>
                <select value={joinTable} onChange={e => setJoinTable(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '12px' }}>
                  <option value="">Selecione...</option>
                  {(SCHEMA_TABLES[selectedSource.name] || SCHEMA_TABLES['Revfy Warehouse']).tables.filter(t => t !== schemaTable).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: COLORS.muted, marginBottom: '4px' }}>Cardinalidade</label>
                <select value={joinCardinality} onChange={e => setJoinCardinality(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '12px' }}>
                  <option value="many-to-one">Many-to-One</option>
                  <option value="one-to-one">One-to-One</option>
                  <option value="many-to-many">Many-to-Many</option>
                </select>
              </div>
            </div>
            {joinTable && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', backgroundColor: COLORS.lightGray, borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '2px' }}>{schemaTable || 'primary'}</div>
                  <select value={joinKeyLeft} onChange={e => setJoinKeyLeft(e.target.value)} style={{ width: '100%', padding: '6px 8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', fontSize: '11px' }}>
                    <option value="">Chave...</option>
                    <option value="customer_id">customer_id</option>
                    <option value="cpf_hash">cpf_hash</option>
                  </select>
                </div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: COLORS.primary, padding: '4px 8px', backgroundColor: COLORS.bgBlue, borderRadius: '4px' }}>=</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '2px' }}>{joinTable}</div>
                  <select value={joinKeyRight} onChange={e => setJoinKeyRight(e.target.value)} style={{ width: '100%', padding: '6px 8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', fontSize: '11px' }}>
                    <option value="">Chave...</option>
                    <option value="customer_id">customer_id</option>
                    <option value="transaction_id">transaction_id</option>
                  </select>
                </div>
              </div>
            )}
            <button onClick={() => setWizardStep(4)} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Testar e Finalizar</button>
          </div>
        )}

        {wizardStep === 4 && selectedSource && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            {!testing && !testDone && (
              <div>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{getSourceIcon(selectedSource.name)}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '16px' }}>Pronto para testar</h3>
                <p style={{ fontSize: '13px', color: COLORS.muted, marginBottom: '24px' }}>Vamos verificar a conexão com {selectedSource.name}.</p>
                <button onClick={handleTestConnection} style={{ padding: '12px 32px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Testar Conexão</button>
              </div>
            )}
            {testing && (
              <div>
                <div style={{ width: '48px', height: '48px', border: `4px solid ${COLORS.border}`, borderTopColor: COLORS.primary, borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>Testando conexão...</h3>
                <p style={{ fontSize: '13px', color: COLORS.muted }}>Verificando credenciais e permissões</p>
              </div>
            )}
            {testDone && (
              <div>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: `${COLORS.success}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Check size={32} color={COLORS.success} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: COLORS.success, marginBottom: '8px' }}>Conexão bem-sucedida!</h3>
                <p style={{ fontSize: '13px', color: COLORS.muted, marginBottom: '8px' }}>{selectedSource.name} conectado com sucesso.</p>
                <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px', padding: '12px 24px', backgroundColor: COLORS.lightGray, borderRadius: '8px', fontSize: '12px', color: COLORS.muted, marginBottom: '24px', textAlign: 'left' }}>
                  <span>Latência: <strong style={{ color: '#000' }}>42ms</strong></span>
                  <span>Objetos detectados: <strong style={{ color: '#000' }}>4 tabelas</strong></span>
                  <span>Registros estimados: <strong style={{ color: '#000' }}>1.2M</strong></span>
                </div>
                <div><button onClick={handleSaveAndClose} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.success, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Salvar e Conectar</button></div>
              </div>
            )}
          </div>
        )}

        {wizardStep > 0 && wizardStep < 4 && !authenticating && (
          <button onClick={() => { if (wizardStep === 1) { setAuthDone(false); setAuthStage(0); } setWizardStep(wizardStep - 1); }} style={{ width: '100%', marginTop: '12px', padding: '10px', backgroundColor: 'transparent', color: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>← Voltar</button>
        )}
      </Modal>

      <Modal isOpen={showUploadModal} title="Upload CSV / JSON" onClose={() => setShowUploadModal(false)}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ padding: '48px 24px', border: `2px dashed ${COLORS.border}`, borderRadius: '12px', textAlign: 'center', cursor: 'pointer', marginBottom: '20px', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.backgroundColor = COLORS.bgBlue; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <FileSpreadsheet size={40} color={COLORS.muted} style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Arraste seus arquivos aqui</div>
            <div style={{ fontSize: '12px', color: COLORS.muted }}>CSV, JSON, TSV — até 100MB por arquivo</div>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: COLORS.lightGray, borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '8px' }}>Arquivos carregados</div>
            {['audience_seed.csv (12K rows)', 'leads_q1.csv (18K rows)', 'eventos_mar.csv (15K rows)'].map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < 2 ? `1px solid ${COLORS.border}` : 'none' }}>
                <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={14} /> {f}</span>
                <Check size={14} color={COLORS.success} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: COLORS.bgBlue, borderRadius: '8px' }}>
            <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
            <span style={{ fontSize: '12px', color: COLORS.primary }}>Auto-refresh a cada 24h (verifica se há novos arquivos no mesmo path)</span>
          </div>
        </div>
        <button onClick={() => { setShowUploadModal(false); sourceActions.handleUploadCSV(); }} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.success, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Importar Arquivos</button>
      </Modal>

      {/* Dataset Group Creation Wizard */}
      <Modal isOpen={showGroupWizard} title="Criar Novo Dataset Group" onClose={() => { setShowGroupWizard(false); setGroupWizardStep(0); }}>
        {groupWizardStep === 0 && (
          <div>
            <p style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '16px' }}>Um Dataset Group define um universo de tabelas que se conectam via joins. Cada grupo tem uma tabela primária que determina o nível de granularidade (ex: 1 cliente, 1 domicílio).</p>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Nome do Grupo</label>
              <input type="text" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Ex: Clientes Nordeste, Prospects..." style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Descrição</label>
              <input type="text" value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} placeholder="Breve descrição do universo de dados" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Nível de Granularidade</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Individual', 'Domicílio', 'Empresa', 'Custom'].map(g => (
                  <button key={g} onClick={() => setNewGroupGranularity(g)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${newGroupGranularity === g ? COLORS.primary : COLORS.border}`, backgroundColor: newGroupGranularity === g ? COLORS.bgBlue : 'transparent', color: newGroupGranularity === g ? COLORS.primary : COLORS.muted, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>{g}</button>
                ))}
              </div>
            </div>
            <button onClick={() => { if (newGroupName) setGroupWizardStep(1); }} disabled={!newGroupName} style={{ width: '100%', padding: '12px', backgroundColor: newGroupName ? COLORS.primary : COLORS.border, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: newGroupName ? 'pointer' : 'default', marginTop: '8px' }}>Continuar — Selecionar Tabela Primária</button>
          </div>
        )}
        {groupWizardStep === 1 && (
          <div>
            <div style={{ padding: '10px 14px', backgroundColor: COLORS.bgBlue, borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: COLORS.primary }}>
              <strong>{newGroupName}</strong> — {newGroupGranularity}
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Source Connection</label>
              <select style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px' }}>
                <option>Revfy Warehouse — REVFY_PROD</option>
                <option>BigQuery — revfy-analytics</option>
                {platformData.activeSourceNames.filter(n => n !== 'Upload CSV' && n !== 'Revfy Pixel').map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Tabela Primária</label>
              <select value={newGroupPrimary} onChange={e => setNewGroupPrimary(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.primary}40`, borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                <option value="">Selecione a tabela base...</option>
                {['customers_360', 'perfis_enriquecidos', 'households_geo', 'prospects_digital', 'bq_contacts', 'bq_segments_ml'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div style={{ fontSize: '11px', color: COLORS.muted, marginTop: '4px' }}>Esta tabela define o que significa "1 registro" neste grupo (ex: 1 cliente).</div>
            </div>
            {newGroupPrimary && (
              <div style={{ padding: '10px 14px', backgroundColor: `${COLORS.success}10`, borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <Check size={14} color={COLORS.success} />
                <span style={{ fontWeight: '600', color: COLORS.success }}>Tabela "{newGroupPrimary}" selecionada como primária</span>
              </div>
            )}
            <button onClick={handleCreateGroup} disabled={!newGroupPrimary} style={{ width: '100%', padding: '12px', backgroundColor: newGroupPrimary ? COLORS.success : COLORS.border, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: newGroupPrimary ? 'pointer' : 'default' }}>Criar Dataset Group</button>
            <button onClick={() => setGroupWizardStep(0)} style={{ width: '100%', marginTop: '8px', padding: '10px', backgroundColor: 'transparent', color: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>← Voltar</button>
          </div>
        )}
      </Modal>

      {/* Dataset Creation Wizard */}
      <Modal isOpen={showDatasetWizard} title="Criar Novo Dataset" onClose={() => { setShowDatasetWizard(false); setDatasetWizardStep(0); }}>
        {datasetWizardStep === 0 && (
          <div>
            <p style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '16px' }}>Um Dataset é uma tabela individual que será conectada a um Dataset Group via join. Pode ser uma tabela de eventos, transações, ou scores de ML.</p>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Dataset Group de Destino</label>
              <select value={newDsGroup} onChange={e => setNewDsGroup(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px' }}>
                <option value="">Selecione o grupo...</option>
                {[...DATASET_GROUPS, ...dynamicGroups].map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Tipo do Dataset</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Events', 'Transactions', 'ML Scores', 'Reference'].map(t => (
                  <button key={t} onClick={() => setNewDsType(t)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${newDsType === t ? COLORS.primary : COLORS.border}`, backgroundColor: newDsType === t ? COLORS.bgBlue : 'transparent', color: newDsType === t ? COLORS.primary : COLORS.muted, fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Source Connection</label>
              <select value={newDsSource} onChange={e => setNewDsSource(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px' }}>
                <option value="">Selecione a fonte...</option>
                {platformData.activeSourceNames.map(n => <option key={n} value={n}>{n}</option>)}
                <option value="Revfy Warehouse">Revfy Warehouse</option>
                <option value="BigQuery">BigQuery</option>
              </select>
            </div>
            <button onClick={() => { if (newDsGroup && newDsSource) setDatasetWizardStep(1); }} disabled={!newDsGroup || !newDsSource} style={{ width: '100%', padding: '12px', backgroundColor: (newDsGroup && newDsSource) ? COLORS.primary : COLORS.border, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: (newDsGroup && newDsSource) ? 'pointer' : 'default', marginTop: '8px' }}>Continuar — Selecionar Tabela</button>
          </div>
        )}
        {datasetWizardStep === 1 && (
          <div>
            <div style={{ padding: '10px 14px', backgroundColor: COLORS.bgBlue, borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: COLORS.primary, display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>Grupo:</strong> {newDsGroup}</span>
              <span><strong>Tipo:</strong> {newDsType}</span>
              <span><strong>Fonte:</strong> {newDsSource}</span>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Tabela / View</label>
              <select value={newDsTable} onChange={e => setNewDsTable(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.primary}40`, borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                <option value="">Selecione...</option>
                {(SCHEMA_TABLES[newDsSource] || SCHEMA_TABLES['Revfy Warehouse']).tables.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {newDsTable && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Chave Única</label>
                    <select value={newDsKey} onChange={e => setNewDsKey(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '12px' }}>
                      <option value="">Selecione...</option>
                      <option value="id">id</option>
                      <option value="event_id">event_id</option>
                      <option value="transaction_id">transaction_id</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Cardinalidade do Join</label>
                    <select value={newDsCardinality} onChange={e => setNewDsCardinality(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '12px' }}>
                      <option value="many-to-one">Many-to-One</option>
                      <option value="one-to-one">One-to-One</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Chave de Join (com tabela primária)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', backgroundColor: COLORS.lightGray, borderRadius: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '10px', color: COLORS.muted, marginBottom: '2px' }}>{newDsTable}</div>
                      <select value={newDsJoinKey} onChange={e => setNewDsJoinKey(e.target.value)} style={{ width: '100%', padding: '6px 8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', fontSize: '11px' }}>
                        <option value="">Chave...</option>
                        <option value="customer_id">customer_id</option>
                        <option value="user_id">user_id</option>
                        <option value="customer_id">customer_id</option>
                      </select>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: COLORS.primary, padding: '4px 8px', backgroundColor: COLORS.bgBlue, borderRadius: '4px' }}>=</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '10px', color: COLORS.muted, marginBottom: '2px' }}>Primary table</div>
                      <select style={{ width: '100%', padding: '6px 8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', fontSize: '11px' }}>
                        <option>customer_id</option>
                        <option>user_id</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <button onClick={handleCreateDataset} disabled={!newDsTable} style={{ width: '100%', padding: '12px', backgroundColor: newDsTable ? COLORS.success : COLORS.border, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: newDsTable ? 'pointer' : 'default' }}>Criar Dataset</button>
            <button onClick={() => setDatasetWizardStep(0)} style={{ width: '100%', marginTop: '8px', padding: '10px', backgroundColor: 'transparent', color: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>← Voltar</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

const AudienciasPage = ({ platformData, logActivity }) => {
  const [selectedAudience, setSelectedAudience] = useState(MOCK_DATA.audiences[0]);
  const [activeTab, setActiveTab] = useState('construtor');
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [metricsTab, setMetricsTab] = useState('metrics');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(null);
  const [audienceDropdownOpen, setAudienceDropdownOpen] = useState(false);
  const [datasetDropdownOpen, setDatasetDropdownOpen] = useState(false);
  const [showNewAudienceWizard, setShowNewAudienceWizard] = useState(false);
  const [newAudName, setNewAudName] = useState('');
  const [newAudDataset, setNewAudDataset] = useState('');
  const [dynamicAudiences, setDynamicAudiences] = useState([]);
  const [exportingAudience, setExportingAudience] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [breakdowns, setBreakdowns] = useState([]);
  const BREAKDOWN_OPTIONS = ['Região', 'Faixa Etária', 'Score Engajamento', 'Dispositivo', 'Canal de Origem'];
  const [audMenuOpen, setAudMenuOpen] = useState(null);
  const [audStatusOverrides, setAudStatusOverrides] = useState({});
  const [deletedAudiences, setDeletedAudiences] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState({});
  const [savedNotif, setSavedNotif] = useState(false);
  const [showTreatmentInfo, setShowTreatmentInfo] = useState(false);
  const [breakdownDropdownOpen, setBreakdownDropdownOpen] = useState(false);
  const [loadingBreakdowns, setLoadingBreakdowns] = useState({});

  const BREAKDOWN_DATA = {
    'Região': [{ label: 'São Paulo', pct: 38, count: 0 }, { label: 'Rio de Janeiro', pct: 22, count: 0 }, { label: 'Minas Gerais', pct: 15, count: 0 }, { label: 'Paraná', pct: 12, count: 0 }, { label: 'Outros', pct: 13, count: 0 }],
    'Faixa Etária': [{ label: '18-24', pct: 14, count: 0 }, { label: '25-34', pct: 32, count: 0 }, { label: '35-44', pct: 28, count: 0 }, { label: '45-54', pct: 16, count: 0 }, { label: '55+', pct: 10, count: 0 }],
    'Score Engajamento': [{ label: 'Alto (>80)', pct: 24, count: 0 }, { label: 'Médio (50-80)', pct: 41, count: 0 }, { label: 'Baixo (<50)', pct: 35, count: 0 }],
    'Dispositivo': [{ label: 'Mobile', pct: 62, count: 0 }, { label: 'Desktop', pct: 28, count: 0 }, { label: 'Tablet', pct: 10, count: 0 }],
    'Canal de Origem': [{ label: 'Orgânico', pct: 34, count: 0 }, { label: 'Paid Social', pct: 29, count: 0 }, { label: 'Email', pct: 19, count: 0 }, { label: 'Referral', pct: 11, count: 0 }, { label: 'Direct', pct: 7, count: 0 }],
  };

  // Mutable builder state — initialized from templates, editable by user
  const builderTemplates = {
    'Segmento SP 25-44': {
      dataset: 'Revfy Pixel — Clientes',
      heading: 'Clientes SP Capital',
      sections: [
        { title: 'Segmentação Geográfica', filters: [
          { logic: 'Where', field: 'UF', op: 'é igual a', values: ['SP'], type: 'geo' },
          { logic: 'And', field: 'Cidade', op: 'está em', values: ['São Paulo', 'Campinas', 'Guarulhos'], type: 'geo' },
        ]},
        { title: 'Perfil Demográfico', filters: [
          { logic: 'Where', field: 'Faixa Etária', op: 'está em', values: ['25-34', '35-44'], type: 'demo' },
          { logic: 'And', field: 'Dispositivo', op: 'é igual a', values: ['Mobile'], type: 'demo' },
        ]},
        { title: 'Engajamento Digital', filters: [
          { logic: 'Where', field: 'Score Engajamento', op: 'é igual a', values: ['Alto'], type: 'model' },
          { logic: 'And', field: 'Interagiu Campanha', op: 'é igual a', values: ['Sim'], type: 'event' },
          { logic: 'And', field: 'Último Acesso', op: 'é igual a', values: ['< 7 dias'], type: 'event' },
        ]},
      ],
      exclusions: [{ name: 'Base Inativa 90d', size: 123456, type: 'exclude' }],
      audienceSize: 847293, treatment: 70, revenue: '$ 0',
    },
    'Lookalike Sudeste': {
      dataset: 'RevFy IQ — ML Embeddings',
      heading: 'Expansão Sudeste',
      sections: [
        { title: 'Modelo de Similaridade', filters: [
          { logic: 'Where', field: 'Score Similaridade', op: 'é igual a', values: ['> 0.90'], type: 'model' },
          { logic: 'And', field: 'Semelhante a', op: 'é igual a', values: ['Segmento SP 25-44'], type: 'audience' },
        ]},
        { title: 'Scores Preditivos', filters: [
          { logic: 'Where', field: 'Propensão Conversão', op: 'é igual a', values: ['> 0.6'], type: 'model' },
          { logic: 'And', field: 'Propensão Churn', op: 'é igual a', values: ['Baixo (< 0.4)'], type: 'model' },
          { logic: 'And', field: 'RFM Score', op: 'está em', values: ['Champions', 'Loyal', 'Potential'], type: 'model' },
        ]},
      ],
      exclusions: [{ name: 'Segmento SP 25-44', size: 847293, type: 'exclude' }],
      audienceSize: 1567890, treatment: 70, revenue: '$ 0',
    },
    'Alto Valor - Classe A/B': {
      dataset: 'Revfy Warehouse — Perfis Enriquecidos',
      heading: 'Alto Valor Socioeconômico',
      sections: [
        { title: 'Perfil Socioeconômico', filters: [
          { logic: 'Where', field: 'Classe Social', op: 'está em', values: ['A', 'B1'], type: 'demo' },
          { logic: 'And', field: 'Renda Estimada', op: 'é igual a', values: ['> R$ 15K'], type: 'demo' },
          { logic: 'And', field: 'UF', op: 'está em', values: ['SP', 'RJ', 'MG'], type: 'geo' },
        ]},
        { title: 'Dados Transacionais', filters: [
          { logic: 'Where', field: 'Valor Lifetime', op: 'é igual a', values: ['> $5K'], type: 'transaction' },
          { logic: 'And', field: 'Última Compra', op: 'é igual a', values: ['< 30 dias'], type: 'transaction' },
          { logic: 'And', field: 'Ticket Médio', op: 'é igual a', values: ['> $200'], type: 'transaction' },
        ]},
      ],
      exclusions: [],
      audienceSize: 234567, treatment: 80, revenue: '$ 0',
    },
    'Base Inativa 90d': {
      dataset: 'Revfy Pixel — Clientes',
      heading: 'Reativação Base Inativa',
      sections: [
        { title: 'Inatividade Digital', filters: [
          { logic: 'Where', field: 'Último Acesso', op: 'é igual a', values: ['> 90 dias'], type: 'event' },
          { logic: 'And', field: 'Interagiu Campanha', op: 'é igual a', values: ['Não'], type: 'event' },
        ]},
        { title: 'Histórico de Valor', filters: [
          { logic: 'Where', field: 'Score Engajamento', op: 'é igual a', values: ['Baixo'], type: 'model' },
          { logic: 'And', field: 'Páginas Visitadas', op: 'é igual a', values: ['< 5'], type: 'event' },
        ]},
      ],
      exclusions: [{ name: 'Alto Valor - Classe A/B', size: 234567, type: 'exclude' }],
      audienceSize: 123456, treatment: 60, revenue: '$ 0',
    },
  };

  // Live editable state per audience
  const [builderOverrides, setBuilderOverrides] = useState({});
  const getBuilderForAudience = (audName) => {
    if (builderOverrides[audName]) return builderOverrides[audName];
    return builderTemplates[audName] || { dataset: 'Selecione um dataset', heading: audName, sections: [{ title: 'Segmentação', filters: [] }], exclusions: [], audienceSize: 0, treatment: 70, revenue: '$ 0' };
  };
  const updateBuilder = (audName, updater) => {
    setBuilderOverrides(prev => {
      const current = prev[audName] || JSON.parse(JSON.stringify(builderTemplates[audName] || { dataset: 'Selecione um dataset', heading: audName, sections: [{ title: 'Segmentação', filters: [] }], exclusions: [], audienceSize: 0, treatment: 70, revenue: '$ 0' }));
      const updated = updater(current);
      // Recalculate audience size based on filters, field types, and exclusions
      const totalFilters = updated.sections.reduce((sum, s) => sum + s.filters.length, 0);
      if (totalFilters > 0) {
        const baseSeed = audName.charCodeAt(0) * 137;
        const basePool = 800000 + seededRandom(baseSeed) * 1200000;
        // Field-type narrowing: geo narrows ~30%, demo ~20%, model ~10%, event ~15%
        const typeNarrow = { geo: 0.30, demo: 0.20, model: 0.10, event: 0.15, audience: 0.25, transaction: 0.18 };
        const narrowFactor = updated.sections.reduce((factor, s) => {
          return s.filters.reduce((f, filter) => f * (1 - (typeNarrow[filter.type] || 0.15)), factor);
        }, 1);
        // Multi-value filters broaden slightly (e.g., ['25-34','35-44'] vs just ['25-34'])
        const multiValueBoost = updated.sections.reduce((boost, s) => {
          return s.filters.reduce((b, filter) => b + (filter.values.length > 1 ? 0.05 * (filter.values.length - 1) : 0), boost);
        }, 0);
        let size = Math.floor(basePool * Math.min(0.95, narrowFactor + multiValueBoost));
        // Subtract exclusions proportionally
        const exclusionReduction = updated.exclusions.reduce((sum, ex) => sum + (ex.size || 0), 0);
        size = Math.max(1000, size - Math.floor(exclusionReduction * narrowFactor * 0.4));
        updated.audienceSize = size;
      } else if (updated.audienceSize === 0) {
        updated.audienceSize = Math.floor(50000 + seededRandom(audName.length * 7) * 900000);
      }
      return { ...prev, [audName]: updated };
    });
    setUnsavedChanges(p => ({...p, [audName]: true}));
  };

  const addFilterToSection = (audName, sectionIdx, field) => {
    updateBuilder(audName, (builder) => {
      const newBuilder = JSON.parse(JSON.stringify(builder));
      const section = newBuilder.sections[sectionIdx];
      const isFirst = section.filters.length === 0;
      // Contextual initial value: Cidade respects existing UF filter
      let initialValue = field.values ? field.values[0] : '—';
      if (field.name === 'Cidade') {
        const ufFilter = section.filters.find(f => f.field === 'UF');
        if (ufFilter && ufFilter.values[0] && CIDADES_POR_UF[ufFilter.values[0]]) {
          initialValue = CIDADES_POR_UF[ufFilter.values[0]][0];
        }
      }
      section.filters.push({
        logic: isFirst ? 'Where' : 'And',
        field: field.name,
        op: 'é igual a',
        values: [initialValue],
        type: field.type || 'demo',
      });
      return newBuilder;
    });
    setFilterDropdownOpen(null);
  };

  const removeFilter = (audName, sectionIdx, filterIdx) => {
    updateBuilder(audName, (builder) => {
      const newBuilder = JSON.parse(JSON.stringify(builder));
      newBuilder.sections[sectionIdx].filters.splice(filterIdx, 1);
      // Fix logic of first remaining filter
      if (newBuilder.sections[sectionIdx].filters.length > 0) {
        newBuilder.sections[sectionIdx].filters[0].logic = 'Where';
      }
      return newBuilder;
    });
  };

  const addExclusion = (audName, excludedAud) => {
    updateBuilder(audName, (builder) => {
      const newBuilder = JSON.parse(JSON.stringify(builder));
      if (!newBuilder.exclusions.find(e => e.name === excludedAud.name)) {
        newBuilder.exclusions.push({ name: excludedAud.name, size: excludedAud.size, type: 'exclude' });
      }
      return newBuilder;
    });
    setAudienceDropdownOpen(false);
  };

  const removeExclusion = (audName, exIdx) => {
    updateBuilder(audName, (builder) => {
      const newBuilder = JSON.parse(JSON.stringify(builder));
      newBuilder.exclusions.splice(exIdx, 1);
      return newBuilder;
    });
  };

  const allAudiences = [...MOCK_DATA.audiences, ...dynamicAudiences].filter(a => !deletedAudiences[a.name]);
  const currentBuilder = getBuilderForAudience(selectedAudience.name);
  const treatmentCount = Math.round(currentBuilder.audienceSize * (currentBuilder.treatment / 100));
  const controlCount = currentBuilder.audienceSize - treatmentCount;

  // UF → Cidades map for cascading geo filter
  const CIDADES_POR_UF = {
    'SP': ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'São José dos Campos', 'Sorocaba', 'Guarulhos', 'Osasco'],
    'RJ': ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Volta Redonda', 'Campos dos Goytacazes', 'Nova Iguaçu'],
    'MG': ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Contagem', 'Montes Claros', 'Betim'],
    'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Lauro de Freitas'],
    'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria', 'Novo Hamburgo'],
    'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais'],
    'PE': ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Paulista'],
    'CE': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral'],
    'SC': ['Florianópolis', 'Joinville', 'Blumenau', 'Chapecó', 'Itajaí'],
    'GO': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde'],
    'PA': ['Belém', 'Ananindeua', 'Santarém', 'Marabá'],
    'DF': ['Brasília', 'Taguatinga', 'Ceilândia', 'Samambaia', 'Águas Claras'],
  };
  const ALL_CIDADES = [...new Set(Object.values(CIDADES_POR_UF).flat())];

  // ═══════════════════════════════════════════════════════════════
  // DATASET GROUPS — each dataset maps to a specific field universe
  // Inspired by GrowthLoop's Dataset Groups pattern:
  // the selected dataset governs which fields appear in the builder
  // ═══════════════════════════════════════════════════════════════
  const DATASET_GROUPS = {
    'Revfy Pixel — Clientes': {
      label: 'Revfy Pixel — Clientes',
      desc: 'Dados first-party coletados pelo pixel: navegação, eventos e atributos capturados em tempo real.',
      icon: '🔵', color: '#1B59F8', registros: '3,100,000', tables: ['revfy_events', 'page_views', 'conversions', 'user_profiles'],
      fields: [
        { name: 'Email', desc: 'Endereço de email capturado pelo pixel', icon: 'Aa', type: 'demo', values: ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'uol.com.br'] },
        { name: 'UF', desc: 'Estado detectado por IP/cadastro', icon: 'Aa', type: 'geo', values: ['SP', 'RJ', 'MG', 'BA', 'RS', 'PR', 'PE', 'CE', 'SC', 'GO', 'PA', 'DF'] },
        { name: 'Cidade', desc: 'Cidade de residência (filtra por UF)', icon: 'Aa', type: 'geo', values: ALL_CIDADES, contextual: true },
        { name: 'Faixa Etária', desc: 'Faixa etária do visitante', icon: 'Aa', type: 'demo', values: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'] },
        { name: 'Dispositivo', desc: 'Dispositivo principal de acesso', icon: 'Aa', type: 'demo', values: ['Mobile', 'Desktop', 'Tablet', 'Smart TV'] },
        { name: 'Canal de Origem', desc: 'Canal de aquisição do lead', icon: 'Aa', type: 'demo', values: ['Orgânico', 'Paid Social', 'Search', 'Email', 'Referral', 'Direto', 'Push Notification'] },
        { name: 'Navegador', desc: 'Browser do visitante', icon: 'Aa', type: 'demo', values: ['Chrome', 'Safari', 'Firefox', 'Edge', 'Samsung Internet'] },
        { name: 'Último Acesso', desc: 'Dias desde o último acesso ao site/app', icon: '12', type: 'event', values: ['< 1 dia', '< 7 dias', '< 30 dias', '< 90 dias', '> 90 dias'] },
        { name: 'Páginas Visitadas', desc: 'Total de page views nos últimos 30 dias', icon: '12', type: 'event', values: ['> 50', '> 20', '> 10', '> 5', '< 5'] },
        { name: 'Interagiu Campanha', desc: 'Interação com campanha recente (clique, view)', icon: 'Aa', type: 'event', values: ['Sim', 'Não'] },
        { name: 'Conversão Recente', desc: 'Completou conversão nos últimos 30 dias', icon: 'Aa', type: 'event', values: ['Sim', 'Não'] },
        { name: 'Frequência Visita', desc: 'Visitas por semana (média 30d)', icon: '12', type: 'event', values: ['> 5x', '3-5x', '1-2x', '< 1x'] },
        { name: 'Score Engajamento', desc: 'Propensão de engajamento digital (pixel-based)', icon: '12', type: 'model', values: ['Alto', 'Médio-Alto', 'Médio', 'Baixo'] },
      ],
    },
    'Revfy Warehouse — Perfis Enriquecidos': {
      label: 'Revfy Warehouse — Perfis Enriquecidos',
      desc: 'Dados consolidados do warehouse: perfis 360° com dados demográficos, transacionais e enriquecimento externo.',
      icon: '🟢', color: '#10B981', registros: '1,203,847', tables: ['golden_profiles', 'transactions', 'enrichment_3p', 'addresses'],
      fields: [
        { name: 'Email', desc: 'Email principal do perfil unificado', icon: 'Aa', type: 'demo', values: ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'uol.com.br'] },
        { name: 'Nome Completo', desc: 'Nome do cliente (perfil golden)', icon: 'Aa', type: 'demo', values: [] },
        { name: 'CPF (Masked)', desc: 'CPF mascarado para match (***.***.XXX-XX)', icon: 'Aa', type: 'demo', values: [] },
        { name: 'UF', desc: 'Estado do endereço cadastrado', icon: 'Aa', type: 'geo', values: ['SP', 'RJ', 'MG', 'BA', 'RS', 'PR', 'PE', 'CE', 'SC', 'GO', 'PA', 'DF'] },
        { name: 'Cidade', desc: 'Cidade de residência (filtra por UF)', icon: 'Aa', type: 'geo', values: ALL_CIDADES, contextual: true },
        { name: 'Bairro', desc: 'Bairro do endereço (enriquecimento)', icon: 'Aa', type: 'geo', values: [] },
        { name: 'Faixa Etária', desc: 'Faixa etária do cliente', icon: 'Aa', type: 'demo', values: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'] },
        { name: 'Gênero', desc: 'Gênero declarado pelo cliente', icon: 'Aa', type: 'demo', values: ['Masculino', 'Feminino', 'Não Declarado'] },
        { name: 'Classe Social', desc: 'Classe socioeconômica (IBGE/Serasa)', icon: 'Aa', type: 'demo', values: ['A', 'B1', 'B2', 'C1', 'C2', 'D', 'E'] },
        { name: 'Renda Estimada', desc: 'Faixa de renda familiar (enriquecimento)', icon: '12', type: 'demo', values: ['> R$ 20K', '> R$ 15K', '> R$ 10K', '> R$ 5K', '< R$ 5K'] },
        { name: 'Estado Civil', desc: 'Estado civil declarado ou inferido', icon: 'Aa', type: 'demo', values: ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)'] },
        { name: 'Valor Lifetime', desc: 'LTV acumulado do cliente', icon: '12', type: 'transaction', values: ['> $10K', '> $5K', '> $1K', '> $500', '< $500'] },
        { name: 'Ticket Médio', desc: 'Ticket médio das transações', icon: '12', type: 'transaction', values: ['> $500', '> $200', '> $100', '> $50', '< $50'] },
        { name: 'Última Compra', desc: 'Dias desde a última transação', icon: '12', type: 'transaction', values: ['< 7 dias', '< 30 dias', '< 90 dias', '< 180 dias', '> 180 dias'] },
        { name: 'Qtd Compras', desc: 'Total de compras no período', icon: '12', type: 'transaction', values: ['> 20', '> 10', '> 5', '> 1', '= 0'] },
        { name: 'Canal Preferido', desc: 'Canal com maior engajamento', icon: 'Aa', type: 'demo', values: ['Email', 'SMS', 'Push', 'WhatsApp', 'Social'] },
      ],
    },
    'RevFy IQ — ML Embeddings': {
      label: 'RevFy IQ — ML Embeddings',
      desc: 'Modelos preditivos e embeddings de ML: scores de propensão, clusters, lookalikes e anomalias.',
      icon: '🟣', color: '#8B5CF6', registros: '1,567,890', tables: ['ml_scores', 'embeddings_v3', 'clusters', 'lookalike_index'],
      fields: [
        { name: 'Score Engajamento', desc: 'Propensão de engajamento (modelo XGBoost)', icon: '12', type: 'model', values: ['> 0.9', '> 0.8', '> 0.6', '> 0.4', '< 0.4'] },
        { name: 'Propensão Conversão', desc: 'Probabilidade de conversão (modelo deep learning)', icon: '12', type: 'model', values: ['> 0.9', '> 0.8', '> 0.6', '> 0.4', '< 0.4'] },
        { name: 'Propensão Churn', desc: 'Risco de abandono nos próximos 30 dias', icon: '12', type: 'model', values: ['Alto (> 0.7)', 'Médio (0.4-0.7)', 'Baixo (< 0.4)'] },
        { name: 'Score Similaridade', desc: 'Distância no espaço de embeddings vs audiência-base', icon: '12', type: 'model', values: ['> 0.95', '> 0.90', '> 0.85', '> 0.80', '< 0.80'] },
        { name: 'Cluster Comportamental', desc: 'Cluster K-Means identificado pelo RevFy IQ', icon: 'Aa', type: 'model', values: ['Compradores Frequentes', 'Navegadores Curiosos', 'Caçadores de Oferta', 'Leais Premium', 'Dormentes'] },
        { name: 'Semelhante a', desc: 'Audiência base para lookalike', icon: 'Aa', type: 'audience', values: ['Segmento SP 25-44', 'Alto Valor - Classe A/B', 'Lookalike Sudeste'] },
        { name: 'Afinidade Categoria', desc: 'Categoria de maior afinidade (NLP)', icon: 'Aa', type: 'model', values: ['Tecnologia', 'Moda', 'Saúde', 'Finanças', 'Educação', 'Entretenimento'] },
        { name: 'RFM Score', desc: 'Recência × Frequência × Monetário', icon: '12', type: 'model', values: ['Champions', 'Loyal', 'Potential', 'New', 'At Risk', 'Hibernating', 'Lost'] },
        { name: 'Next Best Action', desc: 'Ação recomendada pelo modelo', icon: 'Aa', type: 'model', values: ['Upsell', 'Cross-sell', 'Retenção', 'Win-back', 'Onboarding'] },
        { name: 'Anomalia Detectada', desc: 'Flag de comportamento anômalo (fraud/bot)', icon: 'Aa', type: 'model', values: ['Normal', 'Suspeito', 'Anômalo'] },
      ],
    },
  };

  // ML-powered audience suggestions per dataset group
  const ML_SUGGESTIONS = {
    'Revfy Pixel — Clientes': [
      { name: 'Alta Frequência Web', desc: 'Visitantes com > 5 acessos/semana nos últimos 30d', filters: [{ field: 'Frequência Visita', op: 'é igual a', values: ['> 5x'], type: 'event' }, { field: 'Último Acesso', op: 'é igual a', values: ['< 7 dias'], type: 'event' }], confidence: 94, size: 182340 },
      { name: 'Carrinho Abandonado', desc: 'Iniciaram conversão mas não completaram em 7 dias', filters: [{ field: 'Conversão Recente', op: 'é igual a', values: ['Não'], type: 'event' }, { field: 'Páginas Visitadas', op: 'é igual a', values: ['> 10'], type: 'event' }], confidence: 91, size: 67890 },
      { name: 'Mobile-First Engajados', desc: 'Usuários mobile com alto engajamento de pixel', filters: [{ field: 'Dispositivo', op: 'é igual a', values: ['Mobile'], type: 'demo' }, { field: 'Score Engajamento', op: 'é igual a', values: ['Alto'], type: 'model' }], confidence: 88, size: 423150 },
      { name: 'Reativação Digital', desc: 'Sem acesso há 30-90 dias, histórico de engajamento', filters: [{ field: 'Último Acesso', op: 'é igual a', values: ['< 90 dias'], type: 'event' }, { field: 'Páginas Visitadas', op: 'é igual a', values: ['> 20'], type: 'event' }], confidence: 85, size: 95200 },
    ],
    'Revfy Warehouse — Perfis Enriquecidos': [
      { name: 'Alto Valor Recorrente', desc: 'LTV > $5K com compras nos últimos 30 dias', filters: [{ field: 'Valor Lifetime', op: 'é igual a', values: ['> $5K'], type: 'transaction' }, { field: 'Última Compra', op: 'é igual a', values: ['< 30 dias'], type: 'transaction' }], confidence: 96, size: 34567 },
      { name: 'Classe A/B Sudeste', desc: 'Perfis A/B no Sudeste com renda > R$ 15K', filters: [{ field: 'Classe Social', op: 'está em', values: ['A', 'B1'], type: 'demo' }, { field: 'UF', op: 'está em', values: ['SP', 'RJ', 'MG'], type: 'geo' }], confidence: 93, size: 156780 },
      { name: 'Win-back 90 dias', desc: 'Clientes sem compra há 90-180 dias', filters: [{ field: 'Última Compra', op: 'é igual a', values: ['< 180 dias'], type: 'transaction' }, { field: 'Qtd Compras', op: 'é igual a', values: ['> 5'], type: 'transaction' }], confidence: 90, size: 78340 },
      { name: 'Mulheres 25-44 Engajadas', desc: 'Perfil feminino jovem-adulto com ticket > $200', filters: [{ field: 'Gênero', op: 'é igual a', values: ['Feminino'], type: 'demo' }, { field: 'Faixa Etária', op: 'está em', values: ['25-34', '35-44'], type: 'demo' }, { field: 'Ticket Médio', op: 'é igual a', values: ['> $200'], type: 'transaction' }], confidence: 87, size: 112450 },
    ],
    'RevFy IQ — ML Embeddings': [
      { name: 'Champions (RFM)', desc: 'Top clientes por Recência × Frequência × Monetário', filters: [{ field: 'RFM Score', op: 'é igual a', values: ['Champions'], type: 'model' }], confidence: 97, size: 45230 },
      { name: 'Churn Iminente', desc: 'Score de churn > 0.7 — ação urgente de retenção', filters: [{ field: 'Propensão Churn', op: 'é igual a', values: ['Alto (> 0.7)'], type: 'model' }, { field: 'Score Engajamento', op: 'é igual a', values: ['< 0.4'], type: 'model' }], confidence: 94, size: 28900 },
      { name: 'Lookalike Top 5%', desc: 'Perfis mais similares aos clientes de alto valor', filters: [{ field: 'Score Similaridade', op: 'é igual a', values: ['> 0.95'], type: 'model' }, { field: 'Semelhante a', op: 'é igual a', values: ['Alto Valor - Classe A/B'], type: 'audience' }], confidence: 92, size: 78450 },
      { name: 'Cross-sell Inteligente', desc: 'Modelo sugere oportunidade de cross-sell', filters: [{ field: 'Next Best Action', op: 'é igual a', values: ['Cross-sell'], type: 'model' }, { field: 'Propensão Conversão', op: 'é igual a', values: ['> 0.8'], type: 'model' }], confidence: 89, size: 61200 },
    ],
  };

  const OPERATORS = ['é igual a', 'diferente de', 'contém', 'não contém', 'maior que', 'menor que', 'entre', 'está em', 'não está em'];

  // Dynamic fields from connected sources (external integrations)
  const sourceFields = useMemo(() => {
    const fields = [];
    const seen = new Set();
    (platformData.activeSourceNames || []).forEach(sourceName => {
      const connData = SOURCE_CONNECTED_DATA[sourceName];
      if (connData?.fields) {
        connData.fields.forEach(f => {
          if (!seen.has(f.name)) {
            seen.add(f.name);
            fields.push({ ...f, source: sourceName });
          }
        });
      }
    });
    return fields;
  }, [platformData.activeSourceNames]);

  // Available fields = dataset group fields + external source fields
  // The selected dataset governs which primary fields appear
  const availableFields = useMemo(() => {
    const datasetKey = currentBuilder.dataset;
    const group = DATASET_GROUPS[datasetKey];
    const primary = group ? group.fields.map(f => ({ ...f, source: group.label.split(' — ')[0] })) : [];
    // Merge external source fields (no duplicates)
    const seen = new Set(primary.map(f => f.name));
    const external = sourceFields.filter(f => !seen.has(f.name));
    return [...primary, ...external];
  }, [currentBuilder.dataset, sourceFields]);

  // Current ML suggestions for the selected dataset
  const currentSuggestions = ML_SUGGESTIONS[currentBuilder.dataset] || [];

  const filterTypeColor = (type) => {
    const map = { geo: '#3B82F6', demo: '#8B5CF6', model: '#F59E0B', event: '#10B981', audience: '#EC4899', transaction: '#06B6D4' };
    return map[type] || COLORS.muted;
  };

  const filterTypeLabel = (type) => {
    const map = { geo: 'Geográfico', demo: 'Demográfico', model: 'Modelo ML', event: 'Evento', audience: 'Audiência', transaction: 'Transação' };
    return map[type] || type;
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '220px 1fr 300px', gap: '24px', minHeight: '100vh' }}>

        {/* Left sidebar — Audience list */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', margin: 0 }}>Audiências</h3>
            <span style={{ fontSize: '11px', color: COLORS.muted }}>{allAudiences.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {allAudiences.map((aud) => {
              const audEffStatus = audStatusOverrides[aud.name] || aud.status;
              const audIsPaused = audEffStatus === 'Pausado';
              return (
              <div key={aud.id} onClick={() => setSelectedAudience(aud)} style={{ padding: '12px', borderRadius: '10px', cursor: 'pointer', backgroundColor: selectedAudience.id === aud.id ? COLORS.bgBlue : 'transparent', borderLeft: selectedAudience.id === aud.id ? `3px solid ${COLORS.primary}` : '3px solid transparent', transition: 'all 0.2s', opacity: audIsPaused ? 0.6 : 1, position: 'relative' }}
                onMouseEnter={(e) => { if (selectedAudience.id !== aud.id) e.currentTarget.style.backgroundColor = COLORS.lightGray; }}
                onMouseLeave={(e) => { if (selectedAudience.id !== aud.id) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: selectedAudience.id === aud.id ? COLORS.primary : COLORS.muted, color: '#fff', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{aud.name.charAt(0)}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#000', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{aud.name}</div>
                  <button onClick={(e) => { e.stopPropagation(); setAudMenuOpen(audMenuOpen === aud.name ? null : aud.name); }} style={{ padding: '2px 4px', fontSize: '12px', border: 'none', background: 'none', cursor: 'pointer', color: COLORS.muted, lineHeight: 1, flexShrink: 0 }}>⋯</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '32px' }}>
                  <span style={{ fontSize: '11px', color: COLORS.muted }}>{aud.size.toLocaleString()}</span>
                  <Badge color={audIsPaused ? 'yellow' : audEffStatus === 'Ativo' ? 'green' : audEffStatus === 'Teste' ? 'blue' : 'yellow'} variant="soft">{audIsPaused ? 'Pausado' : audEffStatus}</Badge>
                </div>
                {audMenuOpen === aud.name && (
                  <div style={{ position: 'absolute', left: '12px', top: '100%', marginTop: '2px', backgroundColor: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,.1)', zIndex: 20, minWidth: '140px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                    {audIsPaused ? (
                      <div onClick={() => { setAudStatusOverrides(p => ({...p, [aud.name]: 'Ativo'})); logActivity('Audiência reativada', aud.name, { category: 'audience' }); setAudMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: COLORS.success }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Resume</div>
                    ) : (
                      <div onClick={() => { setAudStatusOverrides(p => ({...p, [aud.name]: 'Pausado'})); logActivity('Audiência pausada', aud.name, { category: 'audience' }); setAudMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#C2740C' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Pause</div>
                    )}
                    <div onClick={() => { if (allAudiences.length <= 1) { setAudMenuOpen(null); return; } setDeletedAudiences(p => ({...p, [aud.name]: true})); if (selectedAudience.name === aud.name) { const next = allAudiences.find(a => a.name !== aud.name); if (next) setSelectedAudience(next); } logActivity('Audiência eliminada', aud.name, { category: 'audience' }); setAudMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#DC2626' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Delete</div>
                  </div>
                )}
              </div>
              );
            })}
          </div>
          <button onClick={() => setShowNewAudienceWizard(true)} style={{ width: '100%', marginTop: '16px', padding: '10px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Plus size={14} /> Nova Audiência</button>
        </div>

        {/* Center — Canvas Builder */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, overflow: 'hidden' }}>
          {/* Header bar */}
          <div style={{ padding: '20px 28px', borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: COLORS.primary, color: '#fff', fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{selectedAudience.name.charAt(0)}</div>
                <input type="text" defaultValue={selectedAudience.name} key={selectedAudience.id} style={{ fontSize: '22px', fontWeight: '700', border: 'none', padding: '0', backgroundColor: 'transparent', cursor: 'text', color: '#000', outline: 'none', width: '300px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px', fontWeight: '700', color: COLORS.primary }}>{currentBuilder.audienceSize.toLocaleString()}</span>
                <span style={{ fontSize: '12px', color: COLORS.primary, fontWeight: '500' }}>Clientes</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Badge color={selectedAudience.status === 'Ativo' ? 'green' : selectedAudience.status === 'Teste' ? 'blue' : 'yellow'}>{selectedAudience.status}</Badge>
              {(() => {
                const dsGroup = DATASET_GROUPS[currentBuilder.dataset];
                const dsColor = dsGroup?.color || COLORS.primary;
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', backgroundColor: dsColor + '10', fontSize: '12px', color: dsColor, fontWeight: '500' }}>
                    {dsGroup && <span style={{ fontSize: '12px' }}>{dsGroup.icon}</span>}
                    <Database size={12} /> {currentBuilder.dataset}
                    {dsGroup && <span style={{ fontSize: '10px', color: COLORS.muted }}>({dsGroup.fields.length} campos)</span>}
                  </div>
                );
              })()}
              <span style={{ fontSize: '12px', color: unsavedChanges[selectedAudience.name] ? '#F59E0B' : COLORS.muted, fontWeight: unsavedChanges[selectedAudience.name] ? '600' : '400' }}>{unsavedChanges[selectedAudience.name] ? 'Alterações não salvas' : 'Salvo'}</span>
              {(() => {
                const effStatus = audStatusOverrides[selectedAudience.name] || selectedAudience.status;
                const isDraft = effStatus === 'Rascunho';
                return (
                  <div style={{ marginLeft: 'auto', position: 'relative', display: 'inline-flex' }}>
                    <button onClick={() => !isDraft && setShowActivateModal(true)} disabled={isDraft} style={{ padding: '8px 16px', backgroundColor: isDraft ? COLORS.lightGray : COLORS.cardBg, color: isDraft ? COLORS.muted : '#333', border: `1px solid ${isDraft ? COLORS.border : COLORS.border}`, borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: isDraft ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: isDraft ? 0.6 : 1 }}><Send size={12} /> Exportar audiência</button>
                    {isDraft && <div style={{ position: 'absolute', bottom: '-24px', right: 0, fontSize: '10px', color: '#F59E0B', fontWeight: '500', whiteSpace: 'nowrap' }}>Altere status para Ativo ou Teste</div>}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid ${COLORS.border}`, paddingLeft: '28px' }}>
            {['construtor', 'configs'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: activeTab === tab ? COLORS.primary : COLORS.muted, borderBottom: activeTab === tab ? `2px solid ${COLORS.primary}` : '2px solid transparent', marginBottom: '-1px' }}>
                {tab === 'construtor' ? 'Builder' : 'Settings'}
              </button>
            ))}
          </div>

          {/* Canvas Content */}
          <div style={{ padding: '28px', overflowY: 'auto', maxHeight: 'calc(100vh - 260px)' }}>
            {activeTab === 'construtor' && (
              <div>
                {/* Canvas sections */}
                {currentBuilder.sections.map((section, sIdx) => (
                  <div key={sIdx} style={{ marginBottom: '28px' }}>
                    <input type="text" defaultValue={section.title} key={`${selectedAudience.id}-${sIdx}-${section.title}`} onBlur={e => { if (e.target.value !== section.title) updateBuilder(selectedAudience.name, b => { const nb = JSON.parse(JSON.stringify(b)); nb.sections[sIdx].title = e.target.value; return nb; }); }} style={{ fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '16px', paddingBottom: '8px', borderBottom: `1px solid ${COLORS.border}`, border: 'none', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: COLORS.border, display: 'block', width: '100%', backgroundColor: 'transparent', outline: 'none', cursor: 'text' }} />

                    {/* Filters */}
                    {section.filters.map((f, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', position: 'relative' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: f.logic.includes('not') ? COLORS.error : COLORS.primary, width: '70px', textAlign: 'right', fontFamily: 'monospace', flexShrink: 0 }}>{f.logic}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, padding: '8px 12px', backgroundColor: COLORS.lightGray, borderRadius: '8px', border: `1px solid ${COLORS.border}`, transition: 'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.primary + '60'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}>
                          <span style={{ fontSize: '10px', fontWeight: '700', color: filterTypeColor(f.type), backgroundColor: filterTypeColor(f.type) + '15', padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>{filterTypeLabel(f.type)}</span>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>{f.field}</span>
                          <select value={f.op} onChange={e => updateBuilder(selectedAudience.name, b => { const nb = JSON.parse(JSON.stringify(b)); nb.sections[sIdx].filters[fIdx].op = e.target.value; return nb; })} style={{ fontSize: '12px', color: COLORS.muted, border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px', outline: 'none', fontFamily: 'inherit' }}>{OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}</select>
                          {f.values.map((v, vi) => {
                            const fieldDef = availableFields.find(af => af.name === f.field);
                            let opts = fieldDef?.values || [];
                            // Cascading: if field is Cidade, filter by UF selected in same section
                            if (f.field === 'Cidade') {
                              const ufFilter = section.filters.find(ff => ff.field === 'UF');
                              if (ufFilter && ufFilter.values[0] && CIDADES_POR_UF[ufFilter.values[0]]) {
                                opts = CIDADES_POR_UF[ufFilter.values[0]];
                              }
                            }
                            return opts.length > 0 ? (
                              <select key={vi} value={opts.includes(v) ? v : opts[0]} onChange={e => updateBuilder(selectedAudience.name, b => {
                                const nb = JSON.parse(JSON.stringify(b));
                                nb.sections[sIdx].filters[fIdx].values[vi] = e.target.value;
                                // Cascading: if UF changed, reset Cidade in same section to first city of new UF
                                if (f.field === 'UF') {
                                  const cidadeFilter = nb.sections[sIdx].filters.find(ff => ff.field === 'Cidade');
                                  if (cidadeFilter && CIDADES_POR_UF[e.target.value]) cidadeFilter.values = [CIDADES_POR_UF[e.target.value][0]];
                                }
                                return nb;
                              })} style={{ fontSize: '12px', fontWeight: '600', color: COLORS.primary, backgroundColor: COLORS.bgBlue, padding: '2px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer', outline: 'none' }}>{opts.map(o => <option key={o} value={o}>{o}</option>)}</select>
                            ) : (
                              <input key={vi} defaultValue={v} onBlur={e => updateBuilder(selectedAudience.name, b => { const nb = JSON.parse(JSON.stringify(b)); nb.sections[sIdx].filters[fIdx].values[vi] = e.target.value; return nb; })} style={{ fontSize: '12px', fontWeight: '600', color: COLORS.primary, backgroundColor: COLORS.bgBlue, padding: '2px 8px', borderRadius: '4px', border: 'none', outline: 'none', width: '80px' }} />
                            );
                          })}
                          {f.extra && <span style={{ fontSize: '11px', color: COLORS.muted }}>{f.extra}</span>}
                          {f.count && <span style={{ fontSize: '10px', fontWeight: '600', color: '#fff', backgroundColor: COLORS.muted, padding: '2px 6px', borderRadius: '4px', marginLeft: 'auto' }}>Count</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                          <div onClick={() => setFilterDropdownOpen(filterDropdownOpen === `${sIdx}-add-${fIdx}` ? null : `${sIdx}-add-${fIdx}`)} style={{ cursor: 'pointer', padding: '2px', borderRadius: '4px' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.bgBlue}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Plus size={14} color={COLORS.primary} />
                          </div>
                          <div onClick={() => removeFilter(selectedAudience.name, sIdx, fIdx)} style={{ cursor: 'pointer', padding: '2px', borderRadius: '4px' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.error + '15'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Trash2 size={14} color={COLORS.error} />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add filter prompt */}
                    <div style={{ position: 'relative', marginTop: '8px' }}>
                      <div onClick={() => setFilterDropdownOpen(filterDropdownOpen === `section-${sIdx}` ? null : `section-${sIdx}`)} style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '78px', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', border: `1px dashed ${COLORS.border}`, fontSize: '13px', color: COLORS.muted, flex: 1, transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.color = COLORS.primary; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.muted; }}>
                          <Plus size={14} /> Comece digitando para adicionar um <span style={{ color: COLORS.primary, fontWeight: '600', textDecoration: 'underline' }}>filtro</span>
                        </div>
                      </div>
                      {(filterDropdownOpen === `section-${sIdx}` || (typeof filterDropdownOpen === 'string' && filterDropdownOpen.startsWith(`${sIdx}-add-`))) && (
                        <div style={{ position: 'absolute', top: '100%', left: '78px', marginTop: '4px', backgroundColor: COLORS.cardBg, borderRadius: '10px', border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 24px rgba(0,0,0,.12)', zIndex: 50, width: '280px', padding: '8px' }}>
                          <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '700', color: COLORS.primary, borderBottom: `1px solid ${COLORS.border}`, marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Campos Disponíveis ({availableFields.length})</span>
                          {DATASET_GROUPS[currentBuilder.dataset] && <span style={{ fontWeight: '400', color: COLORS.muted }}>{DATASET_GROUPS[currentBuilder.dataset].icon} {currentBuilder.dataset.split(' — ')[0]}</span>}
                        </div>
                          <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                          {/* Group fields by type */}
                          {['geo', 'demo', 'event', 'model', 'transaction', 'audience'].filter(type => availableFields.some(f => (f.type || 'demo') === type)).map(type => (
                            <div key={type}>
                              <div style={{ padding: '4px 10px', fontSize: '10px', fontWeight: '700', color: filterTypeColor(type), textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{filterTypeLabel(type)}</div>
                              {availableFields.filter(f => (f.type || 'demo') === type).map((field, i) => (
                                <div key={i} onClick={() => addFilterToSection(selectedAudience.name, sIdx, field)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                                  onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray}
                                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                  <span style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: filterTypeColor(field.type || 'demo') + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: filterTypeColor(field.type || 'demo') }}>{field.icon}</span>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', color: '#000', fontSize: '12px' }}>{field.name}</div>
                                    <div style={{ fontSize: '10px', color: COLORS.muted }}>{field.desc}</div>
                                  </div>
                                  {field.source && <span style={{ fontSize: '9px', fontWeight: '600', color: COLORS.muted, backgroundColor: COLORS.lightGray, padding: '2px 6px', borderRadius: '3px', whiteSpace: 'nowrap' }}>{field.source}</span>}
                                </div>
                              ))}
                            </div>
                          ))}
                          </div>
                          {availableFields.length === 0 && <div style={{ padding: '8px 10px', fontSize: '11px', color: COLORS.muted, fontStyle: 'italic' }}>Selecione um Dataset Group para ver os campos disponíveis</div>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* ML Suggestions panel */}
                {currentSuggestions.length > 0 && (
                  <div style={{ marginBottom: '28px', padding: '16px', backgroundColor: '#F5F3FF', borderRadius: '10px', border: '1px solid #8B5CF620' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Brain size={16} color="#8B5CF6" />
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#8B5CF6' }}>RevFy IQ — Audiências Sugeridas</span>
                      <span style={{ fontSize: '10px', color: COLORS.muted, marginLeft: 'auto' }}>Baseado em {DATASET_GROUPS[currentBuilder.dataset]?.label || currentBuilder.dataset}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {currentSuggestions.map((sug, si) => (
                        <div key={si} onClick={() => {
                          updateBuilder(selectedAudience.name, b => {
                            const nb = JSON.parse(JSON.stringify(b));
                            nb.sections = [{ title: 'Segmentação', filters: sug.filters.map((f, i) => ({ ...f, logic: i === 0 ? 'Where' : 'And' })) }];
                            return nb;
                          });
                          logActivity('Sugestão ML aplicada', sug.name, { category: 'audience', confidence: sug.confidence });
                        }} style={{ padding: '10px 12px', backgroundColor: '#fff', borderRadius: '8px', cursor: 'pointer', border: '1px solid #E5E7EB', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(139,92,246,.15)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#000' }}>{sug.name}</span>
                            <span style={{ fontSize: '9px', fontWeight: '700', color: '#8B5CF6', backgroundColor: '#8B5CF615', padding: '2px 5px', borderRadius: '3px', flexShrink: 0 }}>{sug.confidence}%</span>
                          </div>
                          <div style={{ fontSize: '10px', color: COLORS.muted, lineHeight: '1.3', marginBottom: '6px' }}>{sug.desc}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '10px', color: '#8B5CF6', fontWeight: '600' }}>~{sug.size.toLocaleString()} clientes</span>
                            <span style={{ fontSize: '10px', color: COLORS.primary, fontWeight: '600' }}>Aplicar →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exclusions block */}
                {currentBuilder.exclusions.length > 0 && (
                  <div style={{ marginBottom: '28px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '16px', paddingBottom: '8px', borderBottom: `1px solid ${COLORS.border}` }}>Exclusões de Audiência</h2>
                    {currentBuilder.exclusions.map((ex, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: COLORS.error, width: '70px', textAlign: 'right', fontFamily: 'monospace', flexShrink: 0 }}>Where not</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, padding: '10px 14px', backgroundColor: `${COLORS.error}06`, borderRadius: '8px', border: `1px solid ${COLORS.error}25` }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: COLORS.error + '15', color: COLORS.error, fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ex.name.charAt(0)}</div>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>{ex.name}</span>
                            <span style={{ fontSize: '11px', color: COLORS.muted, marginLeft: '8px' }}>View</span>
                          </div>
                          <span style={{ marginLeft: 'auto', fontSize: '12px', color: COLORS.muted }}>Clientes</span>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#000' }}>{ex.size.toLocaleString()}</span>
                          <Plus size={14} color={COLORS.muted} style={{ cursor: 'pointer' }} />
                          <div onClick={() => removeExclusion(selectedAudience.name, i)} style={{ cursor: 'pointer', padding: '2px', borderRadius: '4px' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.error + '15'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Trash2 size={14} color={COLORS.error} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add audience block */}
                <div style={{ position: 'relative', marginBottom: '28px' }}>
                  <div onClick={() => setAudienceDropdownOpen(!audienceDropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '78px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', border: `1px dashed ${COLORS.border}`, fontSize: '13px', color: COLORS.muted, flex: 1, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#EC4899'; e.currentTarget.style.color = '#EC4899'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.muted; }}>
                      <Plus size={14} /> Comece digitando para adicionar uma <span style={{ color: '#EC4899', fontWeight: '600', textDecoration: 'underline' }}>audiência</span>
                    </div>
                  </div>
                  {audienceDropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: '78px', marginTop: '4px', backgroundColor: COLORS.cardBg, borderRadius: '10px', border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 24px rgba(0,0,0,.12)', zIndex: 50, width: '300px', padding: '8px' }}>
                      <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '700', color: '#EC4899', borderBottom: `1px solid ${COLORS.border}`, marginBottom: '4px' }}>Audiências</div>
                      {allAudiences.filter(a => a.id !== selectedAudience.id).map((aud) => (
                        <div key={aud.id} onClick={() => addExclusion(selectedAudience.name, aud)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: COLORS.lightGray, color: COLORS.muted, fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{aud.name.charAt(0)}</div>
                            <span style={{ fontWeight: '600', color: '#000' }}>{aud.name}</span>
                          </div>
                          <span style={{ fontSize: '11px', color: COLORS.muted }}>{aud.size.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Change dataset group */}
                <div style={{ position: 'relative' }}>
                  <div onClick={() => setDatasetDropdownOpen(!datasetDropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '78px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', border: `1px dashed ${datasetDropdownOpen ? '#06B6D4' : COLORS.border}`, fontSize: '13px', color: COLORS.muted, flex: 1, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#06B6D4'; e.currentTarget.style.color = '#06B6D4'; }}
                      onMouseLeave={e => { if (!datasetDropdownOpen) { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.muted; } }}>
                      <Database size={14} /> Alterar <span style={{ color: '#06B6D4', fontWeight: '600', textDecoration: 'underline' }}>Dataset Group</span>
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: COLORS.muted }}>{DATASET_GROUPS[currentBuilder.dataset]?.fields.length || '?'} campos</span>
                    </div>
                  </div>
                  {datasetDropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: '78px', marginTop: '4px', backgroundColor: COLORS.cardBg, borderRadius: '10px', border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 24px rgba(0,0,0,.12)', zIndex: 50, width: '360px', padding: '8px' }}>
                      <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '700', color: '#06B6D4', borderBottom: `1px solid ${COLORS.border}`, marginBottom: '4px' }}>Dataset Groups</div>
                      {Object.entries(DATASET_GROUPS).map(([key, group]) => (
                        <div key={key} onClick={() => { if (selectedAudience) updateBuilder(selectedAudience.name, (b) => ({...b, dataset: key})); setDatasetDropdownOpen(false); }} style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', border: currentBuilder.dataset === key ? `1px solid ${group.color}40` : '1px solid transparent', backgroundColor: currentBuilder.dataset === key ? group.color + '06' : 'transparent', transition: 'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = currentBuilder.dataset === key ? group.color + '06' : 'transparent'}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '14px' }}>{group.icon}</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#000', flex: 1 }}>{group.label}</span>
                            <span style={{ fontSize: '10px', color: COLORS.muted }}>{group.registros}</span>
                            {currentBuilder.dataset === key && <Check size={14} color={group.color} />}
                          </div>
                          <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '4px', paddingLeft: '22px' }}>{group.fields.length} campos · {group.tables.length} tabelas</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', paddingLeft: '22px' }}>
                            {group.fields.slice(0, 5).map(f => <span key={f.name} style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '3px', backgroundColor: COLORS.lightGray, color: '#555' }}>{f.name}</span>)}
                            {group.fields.length > 5 && <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '3px', backgroundColor: group.color + '15', color: group.color, fontWeight: '600' }}>+{group.fields.length - 5}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'configs' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#000', marginBottom: '8px' }}>Nome da Audiência</label>
                  <input type="text" defaultValue={selectedAudience.name} onChange={() => setUnsavedChanges(p => ({...p, [selectedAudience.name]: true}))} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '20px', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#000', margin: 0 }}>Split Tratamento / Controle</label>
                    <button onClick={() => setShowTreatmentInfo(!showTreatmentInfo)} style={{ width: '18px', height: '18px', borderRadius: '50%', border: `1px solid ${COLORS.border}`, background: showTreatmentInfo ? COLORS.primary : 'none', color: showTreatmentInfo ? '#fff' : COLORS.muted, fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>i</button>
                  </div>
                  {showTreatmentInfo && (
                    <div style={{ padding: '12px 14px', backgroundColor: COLORS.bgBlue, borderRadius: '8px', marginBottom: '12px', fontSize: '12px', color: '#333', lineHeight: '1.5' }}>
                      <strong style={{ color: COLORS.primary }}>Tratamento:</strong> Grupo que recebe a campanha/comunicação. Estes clientes serão ativados nos destinos configurados.<br/>
                      <strong style={{ color: '#555' }}>Controle:</strong> Grupo holdout que <em>não</em> recebe a campanha. Usado para medir incrementalidade — a diferença de performance entre tratamento e controle revela o impacto real da ação, eliminando viés de seleção.
                    </div>
                  )}
                  <div style={{ marginBottom: '8px' }}>
                    <input type="range" min="50" max="95" step="5" value={currentBuilder.treatment} onChange={(e) => { updateBuilder(selectedAudience.name, b => ({...b, treatment: parseInt(e.target.value)})); }} style={{ width: '100%', accentColor: COLORS.primary }} />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, padding: '12px', backgroundColor: COLORS.bgBlue, borderRadius: '8px', textAlign: 'center', cursor: 'pointer', border: `1px solid ${COLORS.primary}30`, transition: 'all 0.2s' }}>
                      <div style={{ fontSize: '11px', color: COLORS.muted }}>Tratamento</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: COLORS.primary }}>{currentBuilder.treatment}%</div>
                      <div style={{ fontSize: '11px', color: COLORS.primary }}>{treatmentCount.toLocaleString()} clientes</div>
                    </div>
                    <div style={{ flex: 1, padding: '12px', backgroundColor: COLORS.lightGray, borderRadius: '8px', textAlign: 'center', cursor: 'pointer', border: `1px solid ${COLORS.border}`, transition: 'all 0.2s' }}>
                      <div style={{ fontSize: '11px', color: COLORS.muted }}>Controle</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#000' }}>{100 - currentBuilder.treatment}%</div>
                      <div style={{ fontSize: '11px', color: COLORS.muted }}>{controlCount.toLocaleString()} clientes</div>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#000', marginBottom: '8px' }}>Frequência de Atualização</label>
                  <select onChange={() => setUnsavedChanges(p => ({...p, [selectedAudience.name]: true}))} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px' }}>
                    <option>Tempo real</option><option>Horária</option><option>Diária</option><option>Semanal</option>
                  </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#000', marginBottom: '8px' }}>Regra de Aprovação</label>
                  <select onChange={() => setUnsavedChanges(p => ({...p, [selectedAudience.name]: true}))} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px' }}>
                    <option>Auto-approve (Admin)</option><option>Requer aprovação manual</option><option>Aprovação via RevFy IQ</option>
                  </select>
                </div>
                <button onClick={() => { setUnsavedChanges(p => { const n = {...p}; delete n[selectedAudience.name]; return n; }); setSavedNotif(true); setTimeout(() => setSavedNotif(false), 2000); logActivity('Audiência salva', selectedAudience.name, { category: 'audience' }); }} style={{ width: '100%', padding: '12px', backgroundColor: unsavedChanges[selectedAudience.name] ? COLORS.primary : COLORS.success, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
                  {savedNotif ? <><Check size={16} /> Salvo!</> : unsavedChanges[selectedAudience.name] ? 'Salvar Alterações' : 'Salvar'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar — Metrics Panel */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, overflow: 'hidden', alignSelf: 'start', position: 'sticky', top: '32px' }}>
          {/* Metrics tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${COLORS.border}` }}>
            {[{ id: 'metrics', label: 'Métricas' }, { id: 'comparisons', label: 'Comparações' }, { id: 'health', label: 'Health' }].map(t => (
              <button key={t.id} onClick={() => setMetricsTab(t.id)} style={{ flex: 1, padding: '12px 8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: metricsTab === t.id ? COLORS.primary : COLORS.muted, borderBottom: metricsTab === t.id ? `2px solid ${COLORS.primary}` : '2px solid transparent', marginBottom: '-1px' }}>
                {t.label} {t.id === 'health' && <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedAudience.status === 'Ativo' ? COLORS.success : COLORS.error, marginLeft: '4px', verticalAlign: 'middle' }} />}
              </button>
            ))}
          </div>

          <div style={{ padding: '20px' }}>
            {metricsTab === 'metrics' && (
              <div>
                {/* Audience size metric */}
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '2px' }}>—</div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: '#000' }}>{currentBuilder.audienceSize.toLocaleString()}</div>
                  <div style={{ fontSize: '12px', color: COLORS.primary, fontWeight: '600', marginBottom: '16px' }}>Total de Clientes</div>
                </div>

                {/* Credit forecast */}
                {(() => {
                  const baseCreditsPerRecord = 0.015;
                  const sectionMultiplier = currentBuilder.sections.reduce((m, s) => m + s.filters.length * 0.08, 1);
                  const exclusionCost = currentBuilder.exclusions.length * 0.03;
                  const forecastCredits = Math.round(currentBuilder.audienceSize * baseCreditsPerRecord * (sectionMultiplier + exclusionCost));
                  const fmtForecast = forecastCredits >= 1000000 ? `${(forecastCredits/1000000).toFixed(1)}M` : forecastCredits >= 1000 ? `${(forecastCredits/1000).toFixed(1)}K` : String(forecastCredits);
                  return (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#000' }}>{fmtForecast}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: COLORS.primary, fontWeight: '600', marginBottom: '16px' }}>
                        Forecast de Créditos
                        <div style={{ position: 'relative', display: 'inline-flex' }}>
                          <div className="credit-tooltip-trigger" style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: COLORS.primary + '20', color: COLORS.primary, fontSize: '9px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help' }}
                            onMouseEnter={e => { const tip = e.currentTarget.nextElementSibling; if (tip) tip.style.display = 'block'; }}
                            onMouseLeave={e => { const tip = e.currentTarget.nextElementSibling; if (tip) tip.style.display = 'none'; }}>i</div>
                          <div style={{ display: 'none', position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '220px', padding: '10px 12px', backgroundColor: '#1a1a2e', color: '#fff', fontSize: '11px', lineHeight: '1.4', borderRadius: '8px', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,.25)' }}>
                            Estimativa baseada no volume da audiência × custo base por registro, ajustado pela complexidade dos filtros e exclusões aplicadas. Quanto mais filtros, maior o processamento.
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Treatment / Control split */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: COLORS.muted }}>Tratamento</span>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#fff', backgroundColor: '#F59E0B', padding: '1px 5px', borderRadius: '3px' }}>{currentBuilder.treatment}%</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#000' }}>{treatmentCount.toLocaleString()}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: COLORS.muted }}>Controle</span>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#fff', backgroundColor: COLORS.muted, padding: '1px 5px', borderRadius: '3px' }}>{100 - currentBuilder.treatment}%</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#000' }}>{controlCount.toLocaleString()}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: '#E5E7EB', overflow: 'hidden', marginBottom: '24px' }}>
                  <div style={{ height: '100%', width: `${currentBuilder.treatment}%`, backgroundColor: '#F59E0B', borderRadius: '4px' }} />
                </div>

                {/* Breakdowns */}
                <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>Breakdowns</h4>
                  <p style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '12px' }}>Distribuição dos clientes desta audiência por dimensão.</p>
                  {breakdowns.map((bd, bi) => {
                    const isLoading = loadingBreakdowns[bd];
                    const bdData = (BREAKDOWN_DATA[bd] || []).map(d => ({...d, count: Math.round(currentBuilder.audienceSize * d.pct / 100)}));
                    const barColors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899', '#06B6D4'];
                    return (
                    <div key={bi} style={{ marginBottom: '14px', padding: '10px 12px', backgroundColor: COLORS.lightGray, borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#000' }}>{bd}</span>
                        <button onClick={() => { setBreakdowns(prev => prev.filter((_, i) => i !== bi)); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, fontSize: '14px', padding: '0 2px' }}>×</button>
                      </div>
                      {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
                          <div style={{ width: '24px', height: '24px', border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.primary, borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
                          <span style={{ fontSize: '11px', color: COLORS.muted }}>Processando {currentBuilder.audienceSize.toLocaleString()} registros...</span>
                        </div>
                      ) : (
                        bdData.map((seg, si) => (
                          <div key={si} style={{ marginBottom: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                              <span style={{ fontSize: '11px', color: '#333' }}>{seg.label}</span>
                              <span style={{ fontSize: '11px', fontWeight: '600', color: '#000' }}>{seg.pct}% <span style={{ color: COLORS.muted, fontWeight: '400' }}>({seg.count.toLocaleString()})</span></span>
                            </div>
                            <div style={{ width: '100%', height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${seg.pct}%`, backgroundColor: barColors[si % barColors.length], borderRadius: '3px', transition: 'width 0.3s' }} />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    );
                  })}
                  {breakdowns.length < BREAKDOWN_OPTIONS.length && (
                    <div style={{ position: 'relative' }}>
                      <button onClick={() => setBreakdownDropdownOpen(!breakdownDropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: 'transparent', border: `1px dashed ${breakdownDropdownOpen ? COLORS.primary : COLORS.border}`, borderRadius: '8px', color: COLORS.primary, fontSize: '12px', fontWeight: '600', cursor: 'pointer', width: '100%', transition: 'border-color 0.2s' }}><Plus size={14} /> Adicionar breakdown</button>
                      {breakdownDropdownOpen && (
                        <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: '4px', backgroundColor: '#fff', borderRadius: '10px', border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 24px rgba(0,0,0,.12)', zIndex: 50, width: '100%', overflow: 'hidden' }}>
                          <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: '700', color: COLORS.primary, borderBottom: `1px solid ${COLORS.border}` }}>Selecione uma dimensão</div>
                          {BREAKDOWN_OPTIONS.filter(b => !breakdowns.includes(b)).map((opt, oi) => (
                            <div key={oi} onClick={() => {
                              setBreakdownDropdownOpen(false);
                              setLoadingBreakdowns(p => ({...p, [opt]: true}));
                              setBreakdowns(prev => [...prev, opt]);
                              logActivity('Breakdown adicionado', opt, { category: 'audience' });
                              setTimeout(() => { setLoadingBreakdowns(p => { const n = {...p}; delete n[opt]; return n; }); }, 3000);
                            }} style={{ padding: '10px 12px', fontSize: '12px', cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', gap: '8px' }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899'][oi % 5] }} />
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {metricsTab === 'comparisons' && (
              <div>
                <p style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '16px' }}>Compare esta audiência com outras para identificar overlaps e oportunidades de otimização.</p>
                {allAudiences.filter(a => a.id !== selectedAudience.id).map((aud, oi) => (
                  <div key={aud.id} style={{ padding: '12px', backgroundColor: COLORS.lightGray, borderRadius: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>{aud.name}</span>
                      <span style={{ fontSize: '12px', color: COLORS.muted }}>{aud.size.toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: COLORS.muted }}>Overlap: <span style={{ fontWeight: '700', color: '#F59E0B' }}>{(seededRandom(selectedAudience.id * 17 + aud.id * 31 + oi) * 5 + 1).toFixed(1)}%</span></div>
                  </div>
                ))}
              </div>
            )}

            {metricsTab === 'health' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: selectedAudience.status === 'Ativo' ? COLORS.success : selectedAudience.status === 'Teste' ? '#F59E0B' : COLORS.error }} />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#000' }}>{selectedAudience.status === 'Ativo' ? 'Saudável' : selectedAudience.status === 'Teste' ? 'Em validação' : 'Atenção necessária'}</span>
                </div>
                {[
                  { label: 'Qualidade dos dados', value: '96%', ok: true },
                  { label: 'Taxa de match', value: '87%', ok: true },
                  { label: 'Atualização', value: selectedAudience.status === 'Ativo' ? 'Tempo real' : 'Manual', ok: selectedAudience.status === 'Ativo' },
                  { label: 'Compliance LGPD', value: 'Conforme', ok: true },
                  { label: 'Overlap excessivo', value: selectedAudience.status === 'Rascunho' ? 'Verificar' : 'Nenhum', ok: selectedAudience.status !== 'Rascunho' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 4 ? `1px solid ${COLORS.border}` : 'none', fontSize: '12px' }}>
                    <span style={{ color: COLORS.muted }}>{item.label}</span>
                    <span style={{ fontWeight: '600', color: item.ok ? COLORS.success : '#F59E0B' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={showActivateModal} title="Exportar Audiência" onClose={() => setShowActivateModal(false)}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#000' }}>Selecionar Destinos</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MOCK_DATA.destinations.map((dest) => (
              <label key={dest.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <input type="checkbox" style={{ marginRight: '12px', width: '16px', height: '16px' }} defaultChecked={true} />
                <div><div style={{ fontSize: '13px', fontWeight: '600' }}>{dest.name}</div><div style={{ fontSize: '12px', color: COLORS.muted }}>{dest.type}</div></div>
              </label>
            ))}
          </div>
        </div>
        {!exportingAudience && !exportDone && (
          <button onClick={() => { setExportingAudience(true); setTimeout(() => { setExportingAudience(false); setExportDone(true); }, 2500); }} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.success, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Exportar {currentBuilder.audienceSize.toLocaleString()} registros</button>
        )}
        {exportingAudience && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: '36px', height: '36px', border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.success, borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>Exportando audiência para destinos...</div>
            <div style={{ fontSize: '11px', color: COLORS.muted, marginTop: '4px' }}>{currentBuilder.audienceSize.toLocaleString()} registros sendo sincronizados</div>
          </div>
        )}
        {exportDone && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: `${COLORS.success}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Check size={24} color={COLORS.success} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: COLORS.success, marginBottom: '4px' }}>Exportação concluída!</div>
            <div style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '16px' }}>{currentBuilder.audienceSize.toLocaleString()} registros enviados para {MOCK_DATA.destinations.length} destinos</div>
            <button onClick={() => { setShowActivateModal(false); setExportDone(false); }} style={{ width: '100%', padding: '10px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Fechar</button>
          </div>
        )}
      </Modal>

      {/* New Audience Wizard */}
      <Modal isOpen={showNewAudienceWizard} title="Nova Audiência" onClose={() => { setShowNewAudienceWizard(false); setNewAudName(''); setNewAudDataset(''); }}>
        <p style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '16px' }}>Selecione um Dataset Group para definir o universo de campos disponíveis no builder.</p>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Nome da Audiência</label>
          <input type="text" value={newAudName} onChange={e => setNewAudName(e.target.value)} placeholder="Ex: Jovens Nordeste, Reativação Q2..." style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '8px' }}>Dataset Group</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(DATASET_GROUPS).map(([key, group]) => (
              <div key={key} onClick={() => setNewAudDataset(key)} style={{ padding: '12px 14px', borderRadius: '10px', border: `2px solid ${newAudDataset === key ? group.color : COLORS.border}`, backgroundColor: newAudDataset === key ? group.color + '08' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { if (newAudDataset !== key) e.currentTarget.style.borderColor = group.color + '60'; }}
                onMouseLeave={e => { if (newAudDataset !== key) e.currentTarget.style.borderColor = COLORS.border; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px' }}>{group.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#000' }}>{group.label}</div>
                    <div style={{ fontSize: '11px', color: COLORS.muted }}>{group.registros} registros · {group.tables.length} tabelas</div>
                  </div>
                  {newAudDataset === key && <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: group.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}><Check size={12} /></div>}
                </div>
                <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.4', marginBottom: '8px' }}>{group.desc}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {group.fields.slice(0, 6).map(f => (
                    <span key={f.name} style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: COLORS.lightGray, color: '#555', fontWeight: '500' }}>{f.name}</span>
                  ))}
                  {group.fields.length > 6 && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: group.color + '15', color: group.color, fontWeight: '600' }}>+{group.fields.length - 6} campos</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ML suggestion preview when dataset selected */}
        {newAudDataset && ML_SUGGESTIONS[newAudDataset] && (
          <div style={{ marginBottom: '14px', padding: '12px', backgroundColor: '#F5F3FF', borderRadius: '10px', border: '1px solid #8B5CF620' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Brain size={14} color="#8B5CF6" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#8B5CF6' }}>RevFy IQ Sugere</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {ML_SUGGESTIONS[newAudDataset].slice(0, 2).map((sug, i) => (
                <div key={i} onClick={() => { setNewAudName(sug.name); }} style={{ padding: '8px 10px', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', border: '1px solid #E5E7EB', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B5CF6'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#000' }}>{sug.name}</span>
                    <span style={{ fontSize: '10px', fontWeight: '600', color: '#8B5CF6', backgroundColor: '#8B5CF615', padding: '2px 6px', borderRadius: '4px' }}>{sug.confidence}% confiança</span>
                  </div>
                  <div style={{ fontSize: '11px', color: COLORS.muted, marginTop: '2px' }}>{sug.desc}</div>
                  <div style={{ fontSize: '10px', color: '#8B5CF6', marginTop: '4px' }}>~{sug.size.toLocaleString()} clientes estimados</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => {
          if (newAudName && newAudDataset) {
            const suggestion = ML_SUGGESTIONS[newAudDataset]?.find(s => s.name === newAudName);
            const newAud = { id: 100 + dynamicAudiences.length, name: newAudName, size: suggestion ? suggestion.size : 0, status: 'Rascunho', created: '2026-03-26' };
            setDynamicAudiences(prev => [...prev, newAud]);
            updateBuilder(newAudName, () => ({
              dataset: newAudDataset, heading: newAudName,
              sections: suggestion ? [{ title: 'Segmentação', filters: suggestion.filters.map((f, i) => ({ ...f, logic: i === 0 ? 'Where' : 'And' })) }] : [{ title: 'Segmentação', filters: [] }],
              exclusions: [], audienceSize: suggestion ? suggestion.size : 0, treatment: 70, revenue: '$ 0',
            }));
            setSelectedAudience(newAud);
            if (logActivity) logActivity('Audiência criada', newAudName, { category: 'audience', dataset: newAudDataset, fromSuggestion: !!suggestion });
            setShowNewAudienceWizard(false); setNewAudName(''); setNewAudDataset('');
          }
        }} disabled={!newAudName || !newAudDataset} style={{ width: '100%', padding: '12px', backgroundColor: (newAudName && newAudDataset) ? COLORS.primary : COLORS.border, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: (newAudName && newAudDataset) ? 'pointer' : 'default' }}>Criar e Abrir no Builder</button>
      </Modal>
    </div>
  );
};

const DEST_CATALOG = [
  { name: 'Meta / Facebook Ads', icon: 'f', color: '#1877F2', desc: 'Custom Audiences + Conversions API', category: 'Mídia Paga', fields: ['Ad Account ID', 'Access Token'], matchFields: ['email_hash', 'phone_hash', 'device_id', 'fbclid'], personalizationFields: ['nome', 'cidade', 'faixa_etaria', 'score_engajamento', 'canal_preferido'] },
  { name: 'Google Ads', icon: 'g', color: '#4285F4', desc: 'Customer Match + Enhanced Conversions', category: 'Mídia Paga', fields: ['Customer ID', 'Developer Token', 'OAuth Client ID'], matchFields: ['email_hash', 'phone_hash', 'address_hash'], personalizationFields: ['nome', 'cidade', 'faixa_etaria', 'propensao_conversao'] },
  { name: 'TikTok Ads', icon: 'tt', color: '#000', desc: 'Audiences API + Events API', category: 'Mídia Paga', fields: ['Advertiser ID', 'Access Token'], matchFields: ['email_hash', 'device_id', 'phone_hash'], personalizationFields: ['faixa_etaria', 'canal_preferido', 'score_engajamento'] },
  { name: 'X (Twitter)', icon: 'x', color: '#000', desc: 'Custom Audiences (TAM)', category: 'Mídia Paga', fields: ['API Key', 'API Secret'], matchFields: ['email_hash', 'twitter_handle', 'device_id'], personalizationFields: ['nome', 'cidade', 'score_engajamento'] },
  { name: 'Microsoft Ads', icon: 'ms', color: '#00A4EF', desc: 'Customer Match + UET', category: 'Mídia Paga', fields: ['Account ID', 'Access Token'], matchFields: ['email_hash', 'phone_hash'], personalizationFields: ['nome', 'cidade'] },
  { name: 'Snapchat', icon: 'sc', color: '#FFFC00', desc: 'Snap Audience Match', category: 'Mídia Paga', fields: ['Ad Account ID', 'Access Token'], matchFields: ['email_hash', 'phone_hash', 'device_id'], personalizationFields: ['faixa_etaria'] },
  { name: 'Braze', icon: 'B', color: '#FF6F20', desc: 'Cross-channel engagement', category: 'Engagement', fields: ['REST API Key', 'REST Endpoint', 'App Group'], matchFields: ['external_id', 'email', 'phone'], personalizationFields: ['nome', 'cidade', 'faixa_etaria', 'canal_preferido', 'score_engajamento', 'propensao_conversao'] },
  { name: 'Sailthru', icon: 'S', color: '#0073B1', desc: 'Email personalization', category: 'Engagement', fields: ['API Key', 'API Secret', 'Prefix for Personalization Fields'], matchFields: ['email', 'customer_id'], personalizationFields: ['nome', 'cidade', 'faixa_etaria', 'canal_preferido', 'ultimo_engajamento'] },
  { name: 'Salesforce MC', icon: 'sf', color: '#00A1E0', desc: 'Marketing Cloud Audiences', category: 'CRM', fields: ['Client ID', 'Client Secret', 'Auth Base URI', 'MID'], matchFields: ['subscriber_key', 'email'], personalizationFields: ['nome', 'cidade', 'classe_social', 'propensao_conversao'] },
  { name: 'Display & Video 360', icon: 'dv', color: '#34A853', desc: 'Google DV360 Audiences', category: 'Mídia Paga', fields: ['Advertiser ID', 'Partner ID', 'Service Account JSON'], matchFields: ['email_hash', 'device_id'], personalizationFields: [] },
  { name: 'LiveRamp', icon: 'LR', color: '#00C389', desc: 'Identity resolution + distribution', category: 'Data', fields: ['API Key', 'Segment Endpoint'], matchFields: ['ramp_id', 'email_hash', 'phone_hash'], personalizationFields: ['faixa_etaria', 'classe_social'] },
  { name: 'Conversica', icon: 'cv', color: '#6C3EC1', desc: 'AI-powered lead engagement', category: 'Engagement', fields: ['API Key', 'Account ID'], matchFields: ['email', 'phone'], personalizationFields: ['nome', 'score_engajamento'] },
];

const DestinosPage = ({ logActivity }) => {
  const [configDest, setConfigDest] = useState(null);
  const [configSaved, setConfigSaved] = useState({});
  const [showCatalog, setShowCatalog] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [configStep, setConfigStep] = useState(0);
  const [configName, setConfigName] = useState('');
  const [configFreq, setConfigFreq] = useState('Daily');
  const [configMatchChecks, setConfigMatchChecks] = useState({});
  const [configPersonalizationChecks, setConfigPersonalizationChecks] = useState({});
  const [configConsent, setConfigConsent] = useState(true);
  const [configAudiences, setConfigAudiences] = useState({});
  const [configSyncMode, setConfigSyncMode] = useState('Upsert');
  const [dynamicDests, setDynamicDests] = useState([]);
  const [creatingDest, setCreatingDest] = useState(false);
  const [destMenuOpen, setDestMenuOpen] = useState(null);
  const [destStatusOverrides, setDestStatusOverrides] = useState({});
  const [deletedDests, setDeletedDests] = useState({});

  // Existing destinations (connected)
  const existingDests = [
    { id: 1, name: 'Meta', type: 'Custom Audiences + CAPI', icon: 'f', match: '87%', status: 'Ativo', activeAudiences: 3, syncFreq: 'Horária', lastSync: '25 Mar 2026, 14:06', color: '#1877F2', feedbackType: 'full_loop', feedbackSource: 'Openflow' },
    { id: 2, name: 'Google Ads', type: 'Customer Match', icon: 'g', match: '82%', status: 'Ativo', activeAudiences: 2, syncFreq: 'Diária', lastSync: '25 Mar 2026, 08:00', color: '#4285F4', feedbackType: 'full_loop', feedbackSource: 'Openflow' },
    { id: 3, name: 'TikTok', type: 'Audiences API', icon: 'tt', match: '79%', status: 'Ativo', activeAudiences: 2, syncFreq: 'Diária', lastSync: '25 Mar 2026, 09:15', color: '#000', feedbackType: 'activation_only', feedbackSource: 'CRM / Pixel' },
    { id: 4, name: 'X (Twitter)', type: 'Custom Audiences', icon: 'x', match: '71%', status: 'Ativo', activeAudiences: 1, syncFreq: 'Diária', lastSync: '24 Mar 2026, 22:00', color: '#000', feedbackType: 'activation_only', feedbackSource: 'CRM / Pixel' },
  ];

  const allDests = [...existingDests, ...dynamicDests];

  const filteredCatalog = catalogSearch
    ? DEST_CATALOG.filter(d => d.name.toLowerCase().includes(catalogSearch.toLowerCase()) || d.desc.toLowerCase().includes(catalogSearch.toLowerCase()))
    : DEST_CATALOG;

  const handleSelectCatalogDest = (catDest) => {
    setConfigDest(catDest);
    setConfigStep(0);
    setConfigName('');
    setConfigFreq('Daily');
    setConfigConsent(true);
    setConfigSyncMode('Upsert');
    const mc = {}; catDest.matchFields.forEach(f => mc[f] = true); setConfigMatchChecks(mc);
    const pc = {}; catDest.personalizationFields.forEach(f => pc[f] = true); setConfigPersonalizationChecks(pc);
    const ac = {}; MOCK_DATA.audiences.filter(a => a.status === 'Ativo').forEach(a => ac[a.name] = true); setConfigAudiences(ac);
    setShowCatalog(false);
  };

  const handleCreateDest = () => {
    if (!configDest || !configName) return;
    setCreatingDest(true);
    setTimeout(() => {
      const audCount = Object.values(configAudiences).filter(Boolean).length;
      setDynamicDests(prev => [...prev, {
        id: 100 + prev.length, name: configName, type: configDest.desc, icon: configDest.icon, match: `${70 + Math.floor(seededRandom(configName.length * 7) * 20)}%`,
        status: 'Ativo', activeAudiences: audCount, syncFreq: configFreq === 'Daily' ? 'Diária' : configFreq === 'Hourly' ? 'Horária' : configFreq === 'Real-time' ? 'Tempo real' : 'Semanal',
        lastSync: 'Agora', color: configDest.color,
      }]);
      setConfigSaved(prev => ({ ...prev, [configName]: true }));
      setCreatingDest(false);
      if (logActivity) logActivity('Destino configurado', `${configDest.name} → ${configName}`, { category: 'destination' });
      setConfigDest(null);
      setConfigStep(0);
    }, 2000);
  };

  const handleConfigExisting = (dest) => {
    const catMatch = DEST_CATALOG.find(c => c.name.includes(dest.name) || dest.name.includes(c.name.split(' ')[0]));
    if (catMatch) {
      setConfigDest(catMatch);
      setConfigName(dest.name);
      setConfigFreq(dest.syncFreq === 'Horária' ? 'Hourly' : dest.syncFreq === 'Diária' ? 'Daily' : 'Real-time');
      setConfigStep(1);
      setConfigSyncMode('Upsert');
      const mc = {}; catMatch.matchFields.forEach(f => mc[f] = true); setConfigMatchChecks(mc);
      const pc = {}; catMatch.personalizationFields.forEach(f => pc[f] = true); setConfigPersonalizationChecks(pc);
      const ac = {}; MOCK_DATA.audiences.filter(a => a.status === 'Ativo').forEach(a => ac[a.name] = true); setConfigAudiences(ac);
      setConfigConsent(true);
    }
  };

  const destIconStyle = (icon, color) => ({
    width: '36px', height: '36px', borderRadius: '8px', backgroundColor: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: icon.length > 2 ? '10px' : '14px', fontWeight: '800', color: color, flexShrink: 0,
  });

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#000', margin: 0 }}>Destinations</h1>
          <button onClick={() => { setShowCatalog(true); setCatalogSearch(''); }} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '600',
            backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer',
          }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.darkBlue}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = COLORS.primary}
          ><Plus size={16} /> New Destination</button>
        </div>
        <p style={{ fontSize: '13px', color: COLORS.muted, margin: '8px 0 24px' }}>Manage destinations for your audiences.</p>

        {/* Destinations Table */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, overflow: 'hidden' }}>
          {/* Search */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', backgroundColor: COLORS.lightGray, borderRadius: '8px', width: '280px' }}>
              <Search size={14} color={COLORS.muted} />
              <span style={{ fontSize: '13px', color: COLORS.muted }}>Search</span>
            </div>
          </div>

          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '50px 1.3fr 1fr 0.7fr 0.7fr 1fr 0.6fr 50px', padding: '12px 20px', borderBottom: `1px solid ${COLORS.border}`, backgroundColor: COLORS.lightGray }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: COLORS.muted, textTransform: 'uppercase' }}>Type</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: COLORS.muted, textTransform: 'uppercase' }}>Name</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: COLORS.muted, textTransform: 'uppercase' }}>Feedback Loop</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: COLORS.muted, textTransform: 'uppercase' }}>Audiences</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: COLORS.muted, textTransform: 'uppercase' }}>Sync Freq</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: COLORS.muted, textTransform: 'uppercase' }}>Last Sync</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: COLORS.muted, textTransform: 'uppercase' }}>Status</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: COLORS.muted, textTransform: 'uppercase' }}></span>
          </div>

          {/* Table Rows */}
          {allDests.filter(d => !deletedDests[d.name]).map((dest) => {
            const dStatus = destStatusOverrides[dest.name] || dest.status;
            const dPaused = dStatus === 'Pausado';
            return (
            <div key={dest.id} style={{ display: 'grid', gridTemplateColumns: '50px 1.3fr 1fr 0.7fr 0.7fr 1fr 0.6fr 50px', padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, alignItems: 'center', cursor: 'pointer', transition: 'background-color 0.15s', opacity: dPaused ? 0.6 : 1, position: 'relative' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray + '80'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => handleConfigExisting(dest)}
            >
              <div style={destIconStyle(dest.icon, dest.color)}>{dest.icon}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>{dest.name}</div>
                <div style={{ fontSize: '11px', color: COLORS.muted }}>{dest.type}</div>
              </div>
              <div>
                {dest.feedbackType === 'full_loop' ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', fontSize: '11px', fontWeight: '600', color: '#065F46' }}>
                    <ArrowLeftRight size={11} /> Full Loop
                  </div>
                ) : dest.feedbackType === 'activation_only' ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', backgroundColor: '#FFF7ED', border: '1px solid #FED7AA', fontSize: '11px', fontWeight: '600', color: '#9A3412' }}>
                    <ArrowRight size={11} /> Activation Only
                  </div>
                ) : (
                  <span style={{ fontSize: '11px', color: COLORS.muted }}>—</span>
                )}
                {dest.feedbackSource && <div style={{ fontSize: '10px', color: COLORS.muted, marginTop: '2px' }}>via {dest.feedbackSource}</div>}
              </div>
              <span style={{ fontSize: '13px', color: '#333' }}>{dest.activeAudiences}</span>
              <span style={{ fontSize: '13px', color: '#333' }}>{dest.syncFreq}</span>
              <span style={{ fontSize: '12px', color: COLORS.muted }}>{dest.lastSync}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dPaused ? '#F59E0B' : COLORS.success }} />
                <span style={{ fontSize: '12px', color: '#333' }}>{dPaused ? 'Pausado' : dStatus}</span>
              </div>
              <div style={{ position: 'relative' }}>
                <button onClick={(e) => { e.stopPropagation(); setDestMenuOpen(destMenuOpen === dest.name ? null : dest.name); }} style={{ background: 'none', border: `1px solid ${COLORS.border}`, borderRadius: '4px', cursor: 'pointer', padding: '4px 6px', color: COLORS.muted, fontSize: '14px', lineHeight: 1 }}>⋯</button>
                {destMenuOpen === dest.name && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '4px', backgroundColor: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,.1)', zIndex: 10, minWidth: '160px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                    <div onClick={() => { handleConfigExisting(dest); setDestMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#000' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Edit</div>
                    {dPaused ? (
                      <div onClick={() => { setDestStatusOverrides(p => ({...p, [dest.name]: 'Ativo'})); logActivity('Destino reativado', dest.name, { category: 'destination' }); setDestMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: COLORS.success }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Resume</div>
                    ) : (
                      <div onClick={() => { setDestStatusOverrides(p => ({...p, [dest.name]: 'Pausado'})); logActivity('Destino pausado', dest.name, { category: 'destination' }); setDestMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#C2740C' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Pause</div>
                    )}
                    <div onClick={() => { setDeletedDests(p => ({...p, [dest.name]: true})); logActivity('Destino desconectado', dest.name, { category: 'destination' }); setDestMenuOpen(null); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#DC2626' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Disconnect</div>
                  </div>
                )}
              </div>
            </div>
            );
          })}

          {allDests.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: COLORS.muted }}>Nenhuma destination conectada. Clique em "New Destination" para começar.</div>
          )}
        </div>
      </div>

      {/* Catalog Modal — Select Destination Platform */}
      {showCatalog && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '14px', boxShadow: '0 20px 60px rgba(0,0,0,.3)', width: '90%', maxWidth: '720px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: 0 }}>Select Destination Platform</h2>
              <button onClick={() => setShowCatalog(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: COLORS.muted }}>×</button>
            </div>
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', border: `1px solid ${COLORS.border}`, borderRadius: '10px', backgroundColor: COLORS.lightGray }}>
                <Search size={16} color={COLORS.muted} />
                <input value={catalogSearch} onChange={e => setCatalogSearch(e.target.value)} placeholder="Search Destinations by Name" style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '14px', width: '100%' }} />
              </div>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* Quick-add row for top platforms */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {DEST_CATALOG.filter(d => ['Meta / Facebook Ads', 'Google Ads', 'Microsoft Ads'].includes(d.name)).map(d => (
                  <button key={d.name} onClick={() => handleSelectCatalogDest(d)} style={{
                    padding: '10px 16px', border: `1px solid ${COLORS.primary}30`, borderRadius: '8px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: COLORS.primary, textAlign: 'center',
                  }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.bgBlue}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >Add {d.name}</button>
                ))}
              </div>

              {/* Full catalog grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                {filteredCatalog.filter(d => !['Meta / Facebook Ads', 'Google Ads', 'Microsoft Ads'].includes(d.name)).map((d) => (
                  <div key={d.name} onClick={() => handleSelectCatalogDest(d)} style={{
                    padding: '18px', borderRadius: '10px', border: `1px solid ${COLORS.border}`, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary + '60'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={destIconStyle(d.icon, d.color)}>{d.icon}</div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#000' }}>{d.name}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: COLORS.muted, lineHeight: '1.4', marginBottom: '12px' }}>{d.desc}</div>
                    <button onClick={(e) => { e.stopPropagation(); handleSelectCatalogDest(d); }} style={{ padding: '6px 14px', border: `1px solid ${COLORS.primary}30`, borderRadius: '6px', backgroundColor: 'transparent', fontSize: '12px', fontWeight: '600', color: COLORS.primary, cursor: 'pointer' }}>Add {d.name.split(' ')[0]}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Config Modal — Destination Setup (2-step) */}
      {configDest && !showCatalog && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '14px', boxShadow: '0 20px 60px rgba(0,0,0,.3)', width: '90%', maxWidth: '520px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
              {configStep > 0 && (
                <button onClick={() => setConfigStep(configStep - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: COLORS.muted, padding: '4px' }}>←</button>
              )}
              <div style={destIconStyle(configDest.icon, configDest.color)}>{configDest.icon}</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: 0 }}>{configDest.name}</h2>
                <div style={{ fontSize: '11px', color: COLORS.muted }}>{configDest.desc}</div>
              </div>
              <button onClick={() => { setConfigDest(null); setConfigStep(0); }} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: COLORS.muted }}>×</button>
            </div>

            {/* Step indicator */}
            <div style={{ display: 'flex', gap: '4px', padding: '12px 24px', borderBottom: `1px solid ${COLORS.border}` }}>
              {['Identificação', 'Match Fields', 'Sync & Personalização'].map((step, i) => (
                <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: i <= configStep ? COLORS.primary : COLORS.border, transition: 'background-color 0.3s' }} />
              ))}
            </div>

            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* Step 0: Name + Frequency + Credentials */}
              {configStep === 0 && (
                <div>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>Destination Name</label>
                    <input value={configName} onChange={e => setConfigName(e.target.value)} placeholder="Destination Name" style={{
                      width: '100%', padding: '10px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>Sync Frequency</label>
                    <select value={configFreq} onChange={e => setConfigFreq(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px' }}>
                      <option value="Real-time">Tempo real</option>
                      <option value="Hourly">Horária</option>
                      <option value="Daily">Diária</option>
                      <option value="Weekly">Semanal</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '10px' }}>Credentials</label>
                    {configDest.fields.map((field, i) => (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', fontSize: '11px', color: COLORS.muted, marginBottom: '4px' }}>{field}</label>
                        <input placeholder={field} type={field.toLowerCase().includes('secret') || field.toLowerCase().includes('key') || field.toLowerCase().includes('token') || field.toLowerCase().includes('password') ? 'password' : 'text'}
                          style={{ width: '100%', padding: '9px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setConfigStep(1)} disabled={!configName} style={{
                    width: '100%', padding: '12px', backgroundColor: configName ? COLORS.primary : COLORS.border, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: configName ? 'pointer' : 'not-allowed',
                  }}>Próximo</button>
                </div>
              )}

              {/* Step 1: Match Fields */}
              {configStep === 1 && (
                <div>
                  <p style={{ fontSize: '13px', color: COLORS.muted, marginTop: 0, marginBottom: '16px' }}>Selecione os campos do warehouse que serão usados para matching com os registros da plataforma de destino.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                    {configDest.matchFields.map((field) => (
                      <label key={field} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: configMatchChecks[field] ? COLORS.bgBlue : COLORS.lightGray, borderRadius: '8px', cursor: 'pointer', border: `1px solid ${configMatchChecks[field] ? COLORS.primary + '30' : 'transparent'}`, transition: 'all 0.15s' }}>
                        <input type="checkbox" checked={!!configMatchChecks[field]} onChange={() => setConfigMatchChecks(prev => ({ ...prev, [field]: !prev[field] }))} style={{ width: '16px', height: '16px', accentColor: COLORS.primary }} />
                        <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: '600', color: configMatchChecks[field] ? COLORS.primary : '#333' }}>{field}</span>
                      </label>
                    ))}
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', backgroundColor: configConsent ? `${COLORS.success}10` : COLORS.lightGray, borderRadius: '8px', cursor: 'pointer', border: `1px solid ${configConsent ? COLORS.success + '30' : 'transparent'}` }}>
                      <input type="checkbox" checked={configConsent} onChange={() => setConfigConsent(!configConsent)} style={{ width: '16px', height: '16px', accentColor: COLORS.success }} />
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>User Consent</span>
                        <div style={{ fontSize: '11px', color: COLORS.muted }}>Respeitar opt-out e preferências de privacidade do cliente</div>
                      </div>
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {(() => {
                      const hasMatchFields = Object.values(configMatchChecks).some(Boolean);
                      return (<>
                        <button onClick={() => setConfigStep(0)} style={{ flex: 1, padding: '12px', backgroundColor: COLORS.lightGray, color: '#333', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Voltar</button>
                        <button onClick={() => hasMatchFields && setConfigStep(2)} disabled={!hasMatchFields} style={{ flex: 2, padding: '12px', backgroundColor: hasMatchFields ? COLORS.primary : COLORS.border, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: hasMatchFields ? 'pointer' : 'not-allowed' }}>Próximo</button>
                      </>);
                    })()}
                  </div>
                </div>
              )}

              {/* Step 2: Sync Config + Personalization Fields */}
              {configStep === 2 && (
                <div>
                  {/* Audience Sync Selection */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>Audiências para Sincronizar</label>
                    <p style={{ fontSize: '12px', color: COLORS.muted, marginTop: 0, marginBottom: '10px' }}>Selecione quais audiências serão enviadas a este destino.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {MOCK_DATA.audiences.map((aud) => (
                        <label key={aud.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: configAudiences[aud.name] ? `${COLORS.success}08` : COLORS.lightGray, borderRadius: '8px', cursor: 'pointer', border: `1px solid ${configAudiences[aud.name] ? COLORS.success + '30' : 'transparent'}`, transition: 'all 0.15s' }}>
                          <input type="checkbox" checked={!!configAudiences[aud.name]} onChange={() => setConfigAudiences(prev => ({ ...prev, [aud.name]: !prev[aud.name] }))} style={{ width: '16px', height: '16px', accentColor: COLORS.success }} />
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: configAudiences[aud.name] ? '#000' : '#666' }}>{aud.name}</span>
                            <span style={{ fontSize: '11px', color: COLORS.muted, marginLeft: '8px' }}>{aud.size.toLocaleString()} registros</span>
                          </div>
                          <Badge color={aud.status === 'Ativo' ? 'green' : aud.status === 'Teste' ? 'yellow' : 'blue'} variant="soft">{aud.status}</Badge>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sync Mode */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>Modo de Sync</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['Upsert', 'Mirror', 'Add/Remove'].map(mode => (
                        <button key={mode} onClick={() => setConfigSyncMode(mode)} style={{
                          flex: 1, padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
                          backgroundColor: configSyncMode === mode ? COLORS.bgBlue : COLORS.lightGray,
                          color: configSyncMode === mode ? COLORS.primary : '#666',
                          border: `1px solid ${configSyncMode === mode ? COLORS.primary + '40' : 'transparent'}`,
                        }}>{mode}</button>
                      ))}
                    </div>
                  </div>

                  {/* Personalization Fields */}
                  {configDest.personalizationFields.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>Campos de Personalização</label>
                      <p style={{ fontSize: '12px', color: COLORS.muted, marginTop: 0, marginBottom: '10px' }}>Atributos enviados como metadados à plataforma.</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {configDest.personalizationFields.map((field) => (
                          <label key={field} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', backgroundColor: configPersonalizationChecks[field] ? COLORS.bgBlue : COLORS.lightGray, borderRadius: '20px', cursor: 'pointer', border: `1px solid ${configPersonalizationChecks[field] ? COLORS.primary + '30' : 'transparent'}`, fontSize: '12px', transition: 'all 0.15s' }}>
                            <input type="checkbox" checked={!!configPersonalizationChecks[field]} onChange={() => setConfigPersonalizationChecks(prev => ({ ...prev, [field]: !prev[field] }))} style={{ width: '14px', height: '14px', accentColor: COLORS.primary }} />
                            <span style={{ fontWeight: '500', color: configPersonalizationChecks[field] ? COLORS.primary : '#333' }}>{field}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div style={{ padding: '14px', backgroundColor: COLORS.bgBlue, borderRadius: '10px', marginBottom: '20px', fontSize: '12px', color: COLORS.primary, lineHeight: '1.6' }}>
                    <strong>Resumo:</strong> {Object.values(configAudiences).filter(Boolean).length} audiência(s) → {configName || configDest.name} via modo {configSyncMode}, sincronizado {configFreq === 'Daily' ? 'diariamente' : configFreq === 'Hourly' ? 'a cada hora' : configFreq === 'Real-time' ? 'em tempo real' : 'semanalmente'}.
                    {' '}{Object.values(configMatchChecks).filter(Boolean).length} campo(s) de matching
                    {Object.values(configPersonalizationChecks).filter(Boolean).length > 0 && ` + ${Object.values(configPersonalizationChecks).filter(Boolean).length} de personalização`}.
                    {configConsent && ' Consent enforcement ativo.'}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setConfigStep(1)} style={{ flex: 1, padding: '12px', backgroundColor: COLORS.lightGray, color: '#333', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Voltar</button>
                    <button onClick={handleCreateDest} disabled={creatingDest} style={{ flex: 2, padding: '12px', backgroundColor: creatingDest ? COLORS.muted : COLORS.success, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: creatingDest ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      {creatingDest ? (<><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Conectando...</>) : 'Create'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* SincronizacoesPage removed — sync config absorbed into DestinosPage wizard */


const RevFyIQPage = ({ logActivity }) => {
  const [activeTab, setActiveTab] = useState('analyst');
  const [analystQuery, setAnalystQuery] = useState('');
  const [analystMessages, setAnalystMessages] = useState([
    { role: 'assistant', text: 'Olá! Sou o Revfy Analyst. Pergunte sobre audiências, destinos, colaborações ou match rates em linguagem natural.' },
  ]);
  const [analystLoading, setAnalystLoading] = useState(false);
  const [suppressionOn, setSuppression] = useState(true);
  const [modelStatuses, setModelStatuses] = useState({ 0: 'active', 1: 'active', 2: 'active' });
  const [modelMenuOpen, setModelMenuOpen] = useState(null);
  const [allocationApplied, setAllocationApplied] = useState(false);
  const [customModelRequested, setCustomModelRequested] = useState(false);

  const handleModelAction = (idx, action) => {
    setModelMenuOpen(null);
    const names = ['Lookalike Expansion', 'Propensity to Convert', 'Churn Risk'];
    if (action === 'pause') { setModelStatuses(p => ({ ...p, [idx]: 'paused' })); if (logActivity) logActivity('Modelo pausado', names[idx], { category: 'destination' }); }
    else if (action === 'activate') { setModelStatuses(p => ({ ...p, [idx]: 'active' })); if (logActivity) logActivity('Modelo reativado', names[idx], { category: 'destination' }); }
    else if (action === 'deactivate') { setModelStatuses(p => ({ ...p, [idx]: 'deactivated' })); if (logActivity) logActivity('Modelo desativado', names[idx], { category: 'destination' }); }
    else if (action === 'delete') { setModelStatuses(p => ({ ...p, [idx]: 'deleted' })); if (logActivity) logActivity('Modelo eliminado', names[idx], { category: 'destination' }); }
  };

  const analystResponses = {
    'roas': { text: 'ROAS consolidado por destino:\n• Meta Ads 4.2x (R$ 7.6M) — fonte: Openflow (ingest direto)\n• Google Ads 3.5x (R$ 5.1M) — fonte: Openflow (ingest direto)\n• TikTok 2.8x (R$ 3.2M) — fonte: CRM/Pixel (fallback)\n• X 2.1x (R$ 1.4M) — fonte: CRM/Pixel (fallback)\n\nMeta e Google têm dados de custo via Openflow. TikTok e X usam estimativas via CRM e Pixel.', sql: "SELECT d.destination,\n  d.feedback_source,\n  SUM(m.revenue)/SUM(m.spend) AS roas,\n  SUM(m.revenue) AS total_revenue\nFROM activation_metrics m\nJOIN destination_config d ON m.dest_id = d.id\nGROUP BY d.destination, d.feedback_source\nORDER BY roas DESC;" },
    'match': { text: 'Match rates das colaborações ativas: Varejo Premium 78.3% (hashed email), DataMart Latam 64.1% (MAID + email), Marketplace Sul 71.5% (CUID). A média geral é 71.3%.', sql: "SELECT collaboration_name, match_rate,\n  primary_identifier, matched_records\nFROM collaboration_metrics\nWHERE status = 'active'\nORDER BY match_rate DESC;" },
    'audiencia': { text: 'Top audiências por performance: High-Intent Compradores (ROAS 4.8x, 245K users), Lookalike Sudeste (3.9x, 1.2M), Retargeting Carrinho (5.1x, 89K). A audiência de retargeting tem o melhor ROAS mas menor escala.', sql: "SELECT audience_name, roas, user_count,\n  activated_destinations\nFROM audience_performance\nORDER BY roas DESC LIMIT 5;" },
    'default': { text: 'Resumo do pipeline: 3 colaborações ativas com match rate médio de 71.3%. 5 audiências ativadas em 4 destinos. ROAS consolidado 3.6x.\n\nFontes de feedback: Openflow (Meta, Google — ingest direto), Pixel (eventos on-site), CRM (fallback para TikTok, X). Última sincronização há 2h.', sql: "SELECT COUNT(DISTINCT collab_id) AS collaborations,\n  AVG(match_rate) AS avg_match,\n  COUNT(DISTINCT audience_id) AS audiences,\n  SUM(revenue)/SUM(spend) AS roas\nFROM pipeline_overview\nWHERE status = 'active';" },
  };

  const handleAnalystSend = () => {
    if (!analystQuery.trim()) return;
    const q = analystQuery.toLowerCase();
    setAnalystMessages(prev => [...prev, { role: 'user', text: analystQuery }]);
    setAnalystQuery('');
    setAnalystLoading(true);
    setTimeout(() => {
      const resp = q.includes('roas') || q.includes('destino') || q.includes('retorno') ? analystResponses.roas :
                   q.includes('match') || q.includes('colabora') ? analystResponses.match :
                   q.includes('audiencia') || q.includes('audience') || q.includes('segment') ? analystResponses.audiencia :
                   analystResponses.default;
      setAnalystMessages(prev => [...prev, { role: 'assistant', text: resp.text, sql: resp.sql }]);
      setAnalystLoading(false);
      if (logActivity) logActivity('Consulta executada', 'Revfy Analyst', { category: 'general' });
    }, 1800);
  };

  const tabs = ['analyst', 'models', 'optimization'];
  const tabLabels = { analyst: 'Analyst', models: 'Modelos Preditivos', optimization: 'Otimização de Ativação' };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#000' }}>RevFy IQ</h1>
          <div style={{ padding: '6px 14px', backgroundColor: COLORS.bgBlue, borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: COLORS.primary }}>Inteligência do Pipeline</div>
        </div>
        <p style={{ fontSize: '13px', color: COLORS.muted, margin: '8px 0 0' }}>Consultas em linguagem natural, modelos preditivos e otimização de ativação para seu pipeline de dados.</p>
        <div style={{ display: 'flex', borderBottom: `2px solid ${COLORS.border}`, margin: '20px 0 24px' }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '600', color: activeTab === tab ? COLORS.primary : COLORS.muted, cursor: 'pointer', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? COLORS.primary : 'transparent'}`, marginBottom: '-2px', transition: 'all 0.15s' }}>{tabLabels[tab]}</button>
          ))}
        </div>

        {activeTab === 'analyst' && (
          <div>
            {/* Conversational SQL */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Brain size={18} color={COLORS.primary} /> Revfy Analyst
                  <InfoTooltip text="Pergunte em linguagem natural sobre audiências, destinos, colaborações e performance. O Analyst gera SQL otimizado sobre seu Semantic Model." />
                </h3>
                <Badge color="green" variant="outline">Semantic Model ativo</Badge>
              </div>

              {/* Chat messages */}
              <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', padding: '4px' }}>
                {analystMessages.map((msg, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '80%', padding: '12px 16px', borderRadius: '12px',
                      backgroundColor: msg.role === 'user' ? COLORS.primary : COLORS.lightGray,
                      color: msg.role === 'user' ? '#fff' : '#000',
                    }}>
                      <div style={{ fontSize: '13px', lineHeight: '1.5' }}>{msg.text}</div>
                      {msg.sql && (
                        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#1a1a2e', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', color: '#a5d8ff', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                          {msg.sql}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {analystLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ padding: '12px 20px', backgroundColor: COLORS.lightGray, borderRadius: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: COLORS.muted, animation: 'spin 1s ease-in-out infinite' }} />
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: COLORS.muted, animation: 'spin 1s ease-in-out 0.2s infinite' }} />
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: COLORS.muted, animation: 'spin 1s ease-in-out 0.4s infinite' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={analystQuery}
                  onChange={e => setAnalystQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnalystSend()}
                  placeholder="Pergunte em linguagem natural... (ex: Qual o ROAS por destino?)"
                  style={{ flex: 1, padding: '12px 16px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                />
                <button onClick={handleAnalystSend} disabled={analystLoading} style={{ padding: '12px 20px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Enviar</button>
              </div>

              {/* Suggestion chips */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                {['Qual o ROAS por destino?', 'Match rate das colaborações', 'Top audiências por performance'].map((s, i) => (
                  <button key={i} onClick={() => { setAnalystQuery(s); }} style={{ padding: '6px 12px', fontSize: '11px', backgroundColor: COLORS.bgBlue, color: COLORS.primary, border: `1px solid ${COLORS.primary}20`, borderRadius: '20px', cursor: 'pointer', fontWeight: '500' }}>{s}</button>
                ))}
                <button onClick={() => {
                  if (!customModelRequested) {
                    setCustomModelRequested(true);
                    setAnalystMessages(prev => [...prev, { role: 'user', text: 'Quero criar um modelo preditivo customizado' }, { role: 'assistant', text: 'Posso ajudar! Descreva o objetivo do modelo — por exemplo: "prever quais usuários vão comprar nos próximos 7 dias" ou "identificar perfis semelhantes ao segmento VIP". Eu configuro o dataset, features e target automaticamente.' }]);
                    if (logActivity) logActivity('Modelo customizado solicitado', 'Revfy Analyst', { category: 'general' });
                  }
                }} style={{ padding: '6px 12px', fontSize: '11px', backgroundColor: customModelRequested ? COLORS.lightGray : '#fff', color: customModelRequested ? COLORS.muted : COLORS.primary, border: `1px solid ${customModelRequested ? COLORS.border : COLORS.primary}40`, borderRadius: '20px', cursor: customModelRequested ? 'default' : 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={12} /> Criar modelo customizado
                </button>
              </div>
            </div>

            {/* Semantic Model preview */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', marginBottom: '16px' }}>Semantic Model — pipeline_analytics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: COLORS.muted, marginBottom: '8px', textTransform: 'uppercase' }}>Dimensions</div>
                  {['destination', 'audience_name', 'collaboration', 'identifier_type', 'feedback_source', 'region'].map(d => (
                    <div key={d} style={{ padding: '6px 10px', fontSize: '12px', fontFamily: 'monospace', color: '#6366F1', backgroundColor: '#6366F1' + '10', borderRadius: '4px', marginBottom: '4px' }}>{d}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: COLORS.muted, marginBottom: '8px', textTransform: 'uppercase' }}>Measures</div>
                  {['match_rate', 'roas', 'propensity_score', 'audience_size', 'spend', 'revenue'].map(m => (
                    <div key={m} style={{ padding: '6px 10px', fontSize: '12px', fontFamily: 'monospace', color: COLORS.success, backgroundColor: COLORS.success + '10', borderRadius: '4px', marginBottom: '4px' }}>{m}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: COLORS.muted, marginBottom: '8px', textTransform: 'uppercase' }}>Time Dimensions</div>
                  {['activation_date', 'sync_date', 'month'].map(t => (
                    <div key={t} style={{ padding: '6px 10px', fontSize: '12px', fontFamily: 'monospace', color: '#F59E0B', backgroundColor: '#F59E0B' + '10', borderRadius: '4px', marginBottom: '4px' }}>{t}</div>
                  ))}
                  <div style={{ fontSize: '11px', fontWeight: '700', color: COLORS.muted, marginBottom: '8px', marginTop: '12px', textTransform: 'uppercase' }}>Filters</div>
                  {['active_collaborations', 'last_30_days'].map(f => (
                    <div key={f} style={{ padding: '6px 10px', fontSize: '12px', fontFamily: 'monospace', color: '#EC4899', backgroundColor: '#EC4899' + '10', borderRadius: '4px', marginBottom: '4px' }}>{f}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'models' && (
          <div>
            <div style={{ padding: '12px 16px', backgroundColor: COLORS.bgBlue, borderRadius: '8px', marginBottom: '20px', fontSize: '12px', color: COLORS.primary, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Brain size={14} /> Modelos gerados pela Revfy IQ. Ative, pause ou desative conforme necessidade. Para criar modelos customizados, use o Analyst.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Lookalike Expansion', accuracy: '94%', dataset: '1.5M perfis', desc: 'Expande audiências encontrando perfis semelhantes aos seus melhores clientes. Gera um score de similaridade usado na criação de audiências.', use: 'similarity_score' },
                { name: 'Propensity to Convert', accuracy: '91%', dataset: '847K registros', desc: 'Prevê a probabilidade de conversão de cada usuário com base no histórico de interações. Alimenta a otimização de ativação e Smart Suppression.', use: 'propensity_score' },
                { name: 'Churn Risk', accuracy: '88%', dataset: '2.3M registros', desc: 'Identifica usuários com risco de churn para criar audiências de retenção preventiva. O score é atualizado diariamente.', use: 'churn_score' },
              ].filter((_, idx) => modelStatuses[idx] !== 'deleted').map((model, _, arr) => {
                const idx = [0, 1, 2].find(i => modelStatuses[i] !== 'deleted' && arr.indexOf(model) === [0, 1, 2].filter(j => modelStatuses[j] !== 'deleted').indexOf(i));
                const realIdx = model.name === 'Lookalike Expansion' ? 0 : model.name === 'Propensity to Convert' ? 1 : 2;
                const st = modelStatuses[realIdx];
                const statusLabel = st === 'active' ? 'Ativo' : st === 'paused' ? 'Pausado' : 'Desativado';
                const statusColor = st === 'active' ? 'green' : st === 'paused' ? 'yellow' : 'red';
                return (
                <div key={realIdx} style={{ padding: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, opacity: st === 'deactivated' ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                  {st === 'paused' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: '#FEF3C7', borderRadius: '6px', marginBottom: '12px', fontSize: '12px', color: '#92400E' }}>
                      <Pause size={14} /> Modelo pausado — scores não estão sendo atualizados
                    </div>
                  )}
                  {st === 'deactivated' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: '#FEE2E2', borderRadius: '6px', marginBottom: '12px', fontSize: '12px', color: '#991B1B' }}>
                      <Ban size={14} /> Modelo desativado — score não disponível para audiências
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#000' }}>{model.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Badge color={statusColor}>{statusLabel}</Badge>
                      <div style={{ position: 'relative' }}>
                        <button onClick={() => setModelMenuOpen(modelMenuOpen === realIdx ? null : realIdx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex' }}>
                          <MoreVertical size={16} color={COLORS.muted} />
                        </button>
                        {modelMenuOpen === realIdx && (
                          <div style={{ position: 'absolute', right: 0, top: '100%', backgroundColor: '#fff', borderRadius: '8px', border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 24px rgba(0,0,0,.12)', zIndex: 50, minWidth: '160px', overflow: 'hidden' }}>
                            {st === 'active' && <button onClick={() => handleModelAction(realIdx, 'pause')} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: '#000' }} onMouseEnter={e => e.target.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}><Pause size={14} color={COLORS.muted} /> Pausar</button>}
                            {st === 'active' && <button onClick={() => handleModelAction(realIdx, 'deactivate')} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: '#000' }} onMouseEnter={e => e.target.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}><Ban size={14} color={COLORS.muted} /> Desativar</button>}
                            {(st === 'paused' || st === 'deactivated') && <button onClick={() => handleModelAction(realIdx, 'activate')} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: COLORS.success }} onMouseEnter={e => e.target.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}><Play size={14} /> Reativar</button>}
                            <button onClick={() => handleModelAction(realIdx, 'delete')} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: COLORS.error }} onMouseEnter={e => e.target.style.backgroundColor = '#FEE2E2'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}><Trash2 size={14} /> Eliminar</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '12px', lineHeight: '1.5' }}>{model.desc}</div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '6px 12px', backgroundColor: COLORS.lightGray, borderRadius: '6px', fontSize: '12px' }}>
                      <span style={{ color: COLORS.muted }}>Acurácia: </span><span style={{ fontWeight: '700', color: '#000' }}>{model.accuracy}</span>
                    </div>
                    <div style={{ padding: '6px 12px', backgroundColor: COLORS.lightGray, borderRadius: '6px', fontSize: '12px' }}>
                      <span style={{ color: COLORS.muted }}>Dataset: </span><span style={{ fontWeight: '700', color: '#000' }}>{model.dataset}</span>
                    </div>
                    <div style={{ padding: '6px 12px', backgroundColor: COLORS.bgBlue, borderRadius: '6px', fontSize: '12px' }}>
                      <span style={{ color: COLORS.primary, fontFamily: 'monospace', fontWeight: '600' }}>{model.use}</span>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'optimization' && (
          <div>
            {/* Destination Allocation — with approval */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${allocationApplied ? COLORS.success + '40' : COLORS.border}`, boxShadow: COLORS.shadow, padding: '24px', marginBottom: '24px', transition: 'border-color 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: 0 }}>Alocação por Destino</h3>
                <Badge color={allocationApplied ? 'green' : 'yellow'} variant="outline">{allocationApplied ? 'Aplicada' : 'Recomendação pendente'}</Badge>
              </div>
              <p style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '16px', marginTop: '4px' }}>A Revfy IQ analisou o ROAS histórico e recomenda esta distribuição de audiências por destino.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { name: 'Meta Ads', share: 42, roas: '4.2x', color: COLORS.primary, source: 'Openflow', loopType: 'full_loop' },
                  { name: 'Google Ads', share: 28, roas: '3.5x', color: COLORS.success, source: 'Openflow', loopType: 'full_loop' },
                  { name: 'TikTok Ads', share: 18, roas: '2.8x', color: '#000', source: 'CRM / Pixel', loopType: 'activation_only' },
                  { name: 'X (Twitter)', share: 12, roas: '2.1x', color: '#555', source: 'CRM / Pixel', loopType: 'activation_only' },
                ].map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '120px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>{d.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        {d.loopType === 'full_loop' ? (
                          <span style={{ fontSize: '9px', fontWeight: '600', color: '#065F46', backgroundColor: '#ECFDF5', padding: '1px 6px', borderRadius: '10px', border: '1px solid #A7F3D0' }}>Openflow</span>
                        ) : (
                          <span style={{ fontSize: '9px', fontWeight: '600', color: '#9A3412', backgroundColor: '#FFF7ED', padding: '1px 6px', borderRadius: '10px', border: '1px solid #FED7AA' }}>{d.source}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ flex: 1, height: '24px', backgroundColor: COLORS.lightGray, borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ width: `${d.share}%`, height: '100%', backgroundColor: d.color, borderRadius: '4px', display: 'flex', alignItems: 'center', paddingLeft: '8px', fontSize: '11px', color: '#fff', fontWeight: '600' }}>{d.share}%</div>
                    </div>
                    <div style={{ width: '50px', fontSize: '12px', fontWeight: '700', color: '#000', textAlign: 'right' }}>{d.roas}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px 14px', backgroundColor: COLORS.bgBlue, borderRadius: '8px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: COLORS.primary }}>
                <ArrowLeftRight size={13} /> <strong>Audiência Distribuída, Feedback Centralizado</strong> — Meta e Google via Openflow (ingest direto). TikTok e X via CRM/Pixel (fallback).
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <div style={{ fontSize: '11px', color: COLORS.muted }}>ROAS por destino • fonte de dados indicada</div>
                {!allocationApplied ? (
                  <button onClick={() => { setAllocationApplied(true); if (logActivity) logActivity('Alocação aplicada', 'Recomendação de alocação', { category: 'general' }); }} style={{ padding: '8px 20px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} /> Aplicar recomendação
                  </button>
                ) : (
                  <button onClick={() => { setAllocationApplied(false); if (logActivity) logActivity('Alocação revertida', 'Recomendação de alocação', { category: 'general' }); }} style={{ padding: '8px 20px', backgroundColor: '#fff', color: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                    Reverter
                  </button>
                )}
              </div>
            </div>

            {/* Smart Suppression */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: 0 }}>Smart Suppression</h3>
                <Badge color={suppressionOn ? 'green' : 'yellow'} variant="outline">{suppressionOn ? 'Ativo' : 'Inativo'}</Badge>
              </div>
              <p style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '16px', marginTop: '4px' }}>Ativa apenas usuários com alta probabilidade de conversão, reduzindo custo sem perder receita relevante.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div onClick={() => { setSuppression(!suppressionOn); if (logActivity) logActivity(suppressionOn ? 'Smart Suppression desativada' : 'Smart Suppression ativada', 'Supressão', { category: 'general' }); }} style={{ width: '36px', height: '20px', borderRadius: '10px', backgroundColor: suppressionOn ? COLORS.success : COLORS.border, position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '2px', transition: 'right 0.2s, left 0.2s', ...(suppressionOn ? { right: '2px' } : { left: '2px' }) , boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>Ativar apenas top 80% por propensity score</span>
              </div>
              <div style={{ padding: '16px', backgroundColor: suppressionOn ? COLORS.lightGray : '#fff', borderRadius: '8px', marginBottom: '12px', border: `1px solid ${COLORS.border}`, opacity: suppressionOn ? 1 : 0.5, transition: 'opacity 0.2s' }}>
                <div style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '8px' }}>Impacto estimado com supressão ativa:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div><span style={{ color: COLORS.muted }}>Ativações: </span><span style={{ fontWeight: '700' }}>-20%</span></div>
                  <div><span style={{ color: COLORS.muted }}>Conversões: </span><span style={{ fontWeight: '700', color: COLORS.success }}>-3% (marginal)</span></div>
                  <div><span style={{ color: COLORS.muted }}>Custo/Conversão: </span><span style={{ fontWeight: '700', color: COLORS.success }}>-22%</span></div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: COLORS.muted }}>O modelo aprende continuamente qual threshold de propensity score maximiza o ROAS do pipeline. Requer 14+ dias de dados.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoTooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <div style={{
        width: '16px', height: '16px', borderRadius: '50%', backgroundColor: COLORS.lightGray, border: `1px solid ${COLORS.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help', fontSize: '10px', fontWeight: '700', color: COLORS.muted,
        transition: 'all 0.15s ease',
        ...(show ? { backgroundColor: COLORS.bgBlue, borderColor: COLORS.primary + '40', color: COLORS.primary } : {}),
      }}>i</div>
      {show && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#1a1a2e', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '11px', lineHeight: '1.5',
          width: '260px', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,.2)', animation: 'fadeInDown 0.15s ease',
          pointerEvents: 'none',
        }}>
          {text}
          <div style={{ position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '10px', height: '10px', backgroundColor: '#1a1a2e' }} />
        </div>
      )}
    </div>
  );
};

const GovernancaPage = ({ activityLog = [], onNavigate, collabSummary = {}, userAccessAlerts = 0 }) => {
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [exportHash, setExportHash] = useState('');
  const handleExportAudit = () => {
    setExporting(true); setExportDone(false);
    setTimeout(() => {
      const chars = '0123456789abcdef';
      let hash = '';
      for (let i = 0; i < 64; i++) hash += chars[Math.floor(Math.random() * 16)];
      setExportHash(hash);
      setExporting(false); setExportDone(true);
      setTimeout(() => setExportDone(false), 8000);
    }, 2500);
  };

  // Dynamic compliance — computed from real state
  const compliance = useMemo(() => {
    const items = [
      { req: 'LGPD Art. 7 — Base legal para tratamento', status: 'Ativo', detail: 'consentimento ativo' },
      { req: 'LGPD Art. 37 — Registro de operações', status: 'Ativo', detail: 'logs imutáveis ativos' },
      { req: 'LGPD Art. 46 — Segurança de dados', status: 'Ativo', detail: 'criptografia AES-256' },
      { req: 'ISO 27001 — Gestão de segurança da informação', status: 'Ativo', detail: 'certificado válido' },
      { req: 'SHA-256 — Hash de cada operação', status: 'Ativo', detail: '100%' },
    ];
    // SOC 2 — check user access controls
    if (userAccessAlerts > 0) {
      items.splice(4, 0, { req: 'SOC 2 Type II — Controles de acesso', status: 'Aviso', detail: `${userAccessAlerts} usuário(s) inativo(s) com acesso pendente de revisão`, action: 'Revisar controles de acesso', page: 'usuarios' });
    } else {
      items.splice(4, 0, { req: 'SOC 2 Type II — Controles de acesso', status: 'Ativo', detail: 'Todos os acessos revisados' });
    }
    // DCR collaboration check — if any collab is paused/deactivated
    if ((collabSummary.paused || 0) + (collabSummary.deactivated || 0) > 0) {
      const count = (collabSummary.paused || 0) + (collabSummary.deactivated || 0);
      items.push({ req: 'DCR — Integridade das colaborações', status: 'Aviso', detail: `${count} colaboração(ões) pausada(s) ou desativada(s)`, action: 'Ver colaborações', page: 'coligados' });
    } else {
      items.push({ req: 'DCR — Integridade das colaborações', status: 'Ativo', detail: `${collabSummary.active || 0} colaborações ativas` });
    }
    return items;
  }, [userAccessAlerts, collabSummary]);

  const alertCount = compliance.filter(c => c.status === 'Aviso').length;

  const maskingCols = [
    { name: 'email', rule: 'Email Hash', roles: 'Analista, Admin', masked: '***@***.com' },
    { name: 'cpf', rule: 'Document Mask', roles: 'Admin', masked: '***.***.***-**' },
    { name: 'telefone', rule: 'Phone Mask', roles: 'Operador', masked: '+55 ** *****-****' },
    { name: 'endereco', rule: 'Text Redact', roles: 'Admin', masked: '[REDACTED]' },
  ];
  const piiItems = [
    { label: 'EMAIL', confidence: 99.8 }, { label: 'CPF', confidence: 98.2 }, { label: 'PHONE', confidence: 97.5 }, { label: 'NAME', confidence: 96.1 }, { label: 'ADDRESS', confidence: 94.3 },
  ];
  // Audit Trail now fed from centralized activityLog
  const auditTrail = activityLog.slice(0, 15).map(e => ({
    ts: e.ts instanceof Date ? e.ts.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + e.ts.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : String(e.ts),
    user: e.user,
    action: e.action,
    status: e.status || 'Sucesso',
  }));
  const thStyle = { padding: '10px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: COLORS.muted };
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#000' }}>Governança</h1>
        <p style={{ fontSize: '13px', color: COLORS.muted, margin: '8px 0 24px' }}>Compliance, masking, auditoria e governança de dados.</p>

        {/* DCR */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Shield size={24} color={COLORS.primary} /><h2 style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: 0 }}>Revfy Data Clean Room</h2><InfoTooltip text="Ambiente isolado onde múltiplas organizações podem cruzar dados sem expor informações brutas. Queries são executadas com agregação mínima e differential privacy." /></div>
            <Badge color="green">Ativo</Badge>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {[{ l: 'Queries Executadas', v: (collabSummary.queries || 1247).toLocaleString() }, { l: 'Colaborações Ativas', v: `${collabSummary.active || 0} de ${collabSummary.total || 0}` }, { l: 'PII Exposure', v: '0 (zero)', c: COLORS.success }].map((m, i) => (
              <div key={i} style={{ padding: '12px', backgroundColor: COLORS.lightGray, borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '2px' }}>{m.l}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: m.c || '#000' }}>{m.v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: COLORS.muted, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>Aggregation Policy: min 50 registros</span><span>Differential Privacy: ε = 1.0</span><span>Masking: Ativo em 12 colunas</span>
          </div>
        </div>

        {/* Dynamic Data Masking */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}><Lock size={18} color={COLORS.primary} /> Dynamic Data Masking <InfoTooltip text="Dados sensíveis são mascarados em tempo real com base no perfil de acesso do usuário. Cada role vê apenas o nível de detalhe autorizado — sem duplicação de tabelas." /></h2>
          <p style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '16px', marginTop: 0 }}>Regras aplicadas automaticamente pela PII Auto-Detection. Edite as permissões por role em <button onClick={() => onNavigate && onNavigate('usuarios')} style={{ background: 'none', border: 'none', color: COLORS.primary, cursor: 'pointer', fontSize: '12px', fontWeight: '600', padding: 0, textDecoration: 'underline' }}>Usuários</button>.</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <th style={thStyle}>Coluna</th><th style={thStyle}>Masking Rule</th><th style={thStyle}>Roles com acesso</th><th style={thStyle}>Exemplo mascarado</th>
            </tr></thead>
            <tbody>{maskingCols.map((c, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '10px', fontWeight: '600', fontSize: '12px' }}>{c.name}</td>
                <td style={{ padding: '10px', fontSize: '12px', color: COLORS.muted }}>{c.rule}</td>
                <td style={{ padding: '10px', fontSize: '12px', color: COLORS.muted }}>{c.roles}</td>
                <td style={{ padding: '10px', fontSize: '12px', fontFamily: 'monospace', color: COLORS.primary }}>{c.masked}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        {/* PII Classification */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Eye size={18} color={COLORS.primary} /> PII Auto-Detection <InfoTooltip text="Classificação automática de colunas sensíveis via ML. Identifica e-mails, CPFs, telefones e endereços com alta precisão, aplicando políticas de masking automaticamente." /> <span style={{ fontSize: '11px', fontWeight: '400', color: COLORS.muted }}>(EXTRACT_SEMANTIC_CATEGORIES)</span></h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {piiItems.map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#000' }}>{item.label}</span>
                  <span style={{ fontSize: '12px', color: COLORS.success, fontWeight: '600' }}>{item.confidence}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: COLORS.lightGray, borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.confidence}%`, backgroundColor: COLORS.success, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Checklist */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} color={COLORS.primary} /> Compliance Checklist <InfoTooltip text="Status em tempo real de conformidade com LGPD, ISO 27001 e SOC 2. Cada requisito é monitorado continuamente com alertas automáticos quando um item sai de compliance." /></h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <th style={thStyle}>Requisito</th><th style={thStyle}>Status</th><th style={thStyle}>Detalhe</th><th style={thStyle}>Ação</th>
            </tr></thead>
            <tbody>{compliance.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.border}`, cursor: item.status === 'Aviso' ? 'pointer' : 'default', backgroundColor: item.status === 'Aviso' ? '#FFFBEB' : 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = item.status === 'Aviso' ? '#FEF3C7' : COLORS.lightGray}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = item.status === 'Aviso' ? '#FFFBEB' : 'transparent'}
                onClick={() => { if (item.page && onNavigate) onNavigate(item.page); }}>
                <td style={{ padding: '10px', fontWeight: '600', fontSize: '12px' }}>{item.req}</td>
                <td style={{ padding: '10px' }}><Badge color={item.status === 'Ativo' ? 'green' : 'yellow'}>{item.status}</Badge></td>
                <td style={{ padding: '10px', fontSize: '12px', color: item.status === 'Aviso' ? '#92400E' : COLORS.muted }}>{item.detail}</td>
                <td style={{ padding: '10px' }}>
                  {item.action ? (
                    <button onClick={(e) => { e.stopPropagation(); if (item.page && onNavigate) onNavigate(item.page); }} style={{ padding: '4px 10px', fontSize: '11px', fontWeight: '600', color: '#92400E', backgroundColor: '#FEF3C7', border: '1px solid #F59E0B40', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                      <ArrowRight size={12} /> {item.action}
                    </button>
                  ) : (
                    <span style={{ fontSize: '11px', color: COLORS.success, display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> Conforme</span>
                  )}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        {/* Audit Trail */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={18} color={COLORS.primary} /> Audit Trail <InfoTooltip text="Registro imutável de todas as operações na plataforma. Cada ação é logada com usuário, timestamp e hash SHA-256. Exportável em formato criptografado para auditoria externa." /></h2>
            <button onClick={handleExportAudit} disabled={exporting} style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '12px', fontWeight: '600',
              backgroundColor: exporting ? COLORS.lightGray : exportDone ? COLORS.success + '15' : COLORS.bgBlue,
              color: exporting ? COLORS.muted : exportDone ? COLORS.success : COLORS.primary,
              border: `1px solid ${exporting ? COLORS.border : exportDone ? COLORS.success + '40' : COLORS.primary + '30'}`,
              borderRadius: '8px', cursor: exporting ? 'wait' : 'pointer', transition: 'all 0.2s ease',
            }}>
              {exporting ? (<><div style={{ width: '14px', height: '14px', border: '2px solid ' + COLORS.muted, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Gerando...</>) :
               exportDone ? (<><Check size={14} /> Exportado</>) :
               (<><Lock size={14} /> Exportar Criptografado</>)}
            </button>
          </div>

          {/* Export confirmation banner */}
          {exportDone && (
            <div style={{ padding: '12px 16px', backgroundColor: COLORS.success + '08', border: `1px solid ${COLORS.success}30`, borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ShieldCheck size={16} color={COLORS.success} />
                <span style={{ fontSize: '13px', fontWeight: '700', color: COLORS.success }}>Audit log exportado com sucesso</span>
              </div>
              <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '4px' }}>
                Arquivo assinado digitalmente (AES-256-GCM) • {auditTrail.length} registros • {new Date().toLocaleString('pt-BR')}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: COLORS.muted, backgroundColor: COLORS.lightGray, padding: '6px 10px', borderRadius: '4px', wordBreak: 'break-all' }}>
                SHA-256: {exportHash}
              </div>
              <div style={{ fontSize: '10px', color: COLORS.muted, marginTop: '6px' }}>
                Formato: JSON criptografado + certificado X.509 • Compatível com LGPD Art. 37 e SOC 2 Type II
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
            {auditTrail.map((e, i) => (
              <div key={i} style={{ padding: '12px', backgroundColor: COLORS.lightGray, borderRadius: '8px', borderLeft: `3px solid ${e.status === 'Sucesso' ? COLORS.success : '#FFA500'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#000' }}>{e.action}</span>
                  <Badge color={e.status === 'Sucesso' ? 'green' : 'yellow'}>{e.status}</Badge>
                </div>
                <div style={{ fontSize: '11px', color: COLORS.muted }}>{e.user} • {e.ts}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FaturamentoPage = ({ logActivity }) => {
  const [activeTab, setActiveTab] = useState('resumo');
  const [statementFilter, setStatementFilter] = useState('Todos');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTab, setPaymentTab] = useState('card');
  const [cardSaved, setCardSaved] = useState(false);
  const [invoiceRequested, setInvoiceRequested] = useState(false);

  const b = MOCK_DATA.billing;
  const remainingCredits = b.contract.totalCredits - b.ytdUsedCredits;
  const usagePct = ((b.ytdUsedCredits / b.contract.totalCredits) * 100).toFixed(1);
  const monthPct = ((b.currentMonth.daysElapsed / b.currentMonth.daysTotal) * 100).toFixed(0);
  const projectedMonthly = b.currentMonth.projectedCredits;
  const totalServices = b.services.reduce((s, sv) => s + sv.credits, 0);

  const filteredStatement = statementFilter === 'Todos' ? b.statement : b.statement.filter(s => s.service === statementFilter);

  const fmtCredits = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n);
  const fmtUSD = (n) => n >= 1000000 ? `$ ${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$ ${(n/1000).toFixed(0)}K` : `$ ${n}`;

  const tabs = ['resumo', 'extrato', 'faturas', 'pagamento'];
  const tabLabels = { resumo: 'Resumo', extrato: 'Extrato de Consumo', faturas: 'Faturas', pagamento: 'Pagamento' };

  const serviceIcons = { send: <Send size={14} />, brain: <Brain size={14} />, refresh: <RefreshCw size={14} />, database: <Database size={14} />, shield: <Shield size={14} /> };
  const serviceColors = { 'Ativação': COLORS.primary, 'RevFy IQ': '#8B5CF6', 'Openflow': COLORS.cyan, 'Armazenamento': '#F59E0B', 'Governança': COLORS.success };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#000' }}>Faturamento</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: COLORS.muted, padding: '4px 10px', backgroundColor: COLORS.lightGray, borderRadius: '6px' }}>{b.plan.name}</span>
            <span style={{ fontSize: '11px', color: COLORS.muted, padding: '4px 10px', backgroundColor: COLORS.lightGray, borderRadius: '6px' }}>$ {b.plan.creditPrice.toFixed(2)}/crédito</span>
            <span style={{ fontSize: '11px', color: COLORS.muted, padding: '4px 10px', backgroundColor: COLORS.lightGray, borderRadius: '6px' }}>{b.contract.model}</span>
          </div>
        </div>
        <p style={{ fontSize: '13px', color: COLORS.muted, margin: '4px 0 20px' }}>Contrato: {b.contract.start} — {b.contract.end} · {b.contract.totalCredits.toLocaleString()} créditos contratados</p>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `2px solid ${COLORS.border}`, marginBottom: '24px' }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '600', color: activeTab === tab ? COLORS.primary : COLORS.muted, cursor: 'pointer', borderBottom: activeTab === tab ? `2px solid ${COLORS.primary}` : '2px solid transparent', marginBottom: '-2px', background: 'none', border: 'none', borderBottomStyle: 'solid', borderBottomWidth: '2px', borderBottomColor: activeTab === tab ? COLORS.primary : 'transparent', transition: 'all 0.15s' }}>{tabLabels[tab]}</button>
          ))}
        </div>

        {/* === RESUMO === */}
        {activeTab === 'resumo' && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Créditos Consumidos (YTD)', value: b.ytdUsedCredits.toLocaleString(), sub: `${usagePct}% do contrato`, color: COLORS.primary },
                { label: 'Saldo Restante', value: remainingCredits.toLocaleString(), sub: `${(100 - parseFloat(usagePct)).toFixed(1)}% disponível`, color: COLORS.success },
                { label: 'Valor Financeiro (YTD)', value: fmtUSD(b.ytdUsedCredits * b.plan.creditPrice), sub: `de ${fmtUSD(b.contract.totalCredits * b.plan.creditPrice)} contratado`, color: '#8B5CF6' },
                { label: 'Projeção Mensal', value: fmtCredits(projectedMonthly), sub: `${monthPct}% do mês decorrido`, color: '#F59E0B' },
              ].map((kpi, i) => (
                <div key={i} style={{ padding: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
                  <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '8px', fontWeight: '500' }}>{kpi.label}</div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: kpi.color, marginBottom: '4px' }}>{kpi.value}</div>
                  <div style={{ fontSize: '11px', color: COLORS.muted }}>{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Usage bar */}
            <div style={{ padding: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>Consumo do Contrato</span>
                <span style={{ fontSize: '12px', color: COLORS.muted }}>{b.ytdUsedCredits.toLocaleString()} / {b.contract.totalCredits.toLocaleString()} créditos</span>
              </div>
              <div style={{ width: '100%', height: '12px', backgroundColor: COLORS.lightGray, borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${usagePct}%`, height: '100%', borderRadius: '6px', background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.cyan})`, transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontSize: '10px', color: COLORS.muted }}>Jan 2026</span>
                <span style={{ fontSize: '10px', color: COLORS.muted, fontWeight: '600' }}>{usagePct}% utilizado — {((b.ytdUsedCredits / 3) / (b.contract.totalCredits / 12) * 100).toFixed(0)}% do ritmo esperado</span>
                <span style={{ fontSize: '10px', color: COLORS.muted }}>Dez 2026</span>
              </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* Daily consumption chart */}
              <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', margin: '0 0 16px' }}>Consumo Diário — {b.currentMonth.label}</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={b.dailyConsumption}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="day" stroke={COLORS.muted} fontSize={10} />
                    <YAxis stroke={COLORS.muted} fontSize={10} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                    <Tooltip formatter={(v) => [v.toLocaleString() + ' créditos', 'Consumo']} />
                    <Bar dataKey="credits" fill={COLORS.primary} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Breakdown by service */}
              <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', margin: '0 0 16px' }}>Breakdown por Serviço — {b.currentMonth.label}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {b.services.map((svc) => {
                    const pct = ((svc.credits / totalServices) * 100).toFixed(0);
                    const color = serviceColors[svc.name] || COLORS.primary;
                    return (
                      <div key={svc.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: color + '15', color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{serviceIcons[svc.icon]}</div>
                            <div>
                              <span style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>{svc.name}</span>
                              <span style={{ fontSize: '10px', color: COLORS.muted, marginLeft: '6px' }}>{svc.multiplier}x</span>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#000' }}>{svc.credits.toLocaleString()}</span>
                            <span style={{ fontSize: '11px', color: COLORS.muted, marginLeft: '4px' }}>({pct}%)</span>
                          </div>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: COLORS.lightGray, borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', borderRadius: '3px', backgroundColor: color, transition: 'width 0.4s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: '16px', padding: '10px 12px', backgroundColor: COLORS.bgBlue, borderRadius: '8px', fontSize: '11px', color: COLORS.primary }}>
                  <strong>Regra 10%:</strong> Governança é inclusa até 10% do consumo de Ativação. Acima disso, é faturada separadamente.
                </div>
              </div>
            </div>

            {/* Multiplier reference table */}
            <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', margin: '0 0 16px' }}>Tabela de Consumo de Créditos</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 3fr', gap: '0', fontSize: '12px' }}>
                <div style={{ padding: '8px 12px', fontWeight: '700', color: COLORS.muted, borderBottom: `1px solid ${COLORS.border}` }}>Serviço</div>
                <div style={{ padding: '8px 12px', fontWeight: '700', color: COLORS.muted, borderBottom: `1px solid ${COLORS.border}` }}>Multiplicador</div>
                <div style={{ padding: '8px 12px', fontWeight: '700', color: COLORS.muted, borderBottom: `1px solid ${COLORS.border}` }}>Custo/Cr</div>
                <div style={{ padding: '8px 12px', fontWeight: '700', color: COLORS.muted, borderBottom: `1px solid ${COLORS.border}` }}>Como é faturado</div>
                {b.services.map((svc) => (
                  <Fragment key={svc.id}>
                    <div style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, fontWeight: '600', color: '#000' }}>{svc.name}</div>
                    <div style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, color: serviceColors[svc.name], fontWeight: '700' }}>{svc.multiplier}x</div>
                    <div style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, color: '#000' }}>$ {(b.plan.creditPrice * svc.multiplier).toFixed(2)}</div>
                    <div style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, color: COLORS.muted }}>{svc.desc}</div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === EXTRATO === */}
        {activeTab === 'extrato' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>Filtrar por serviço:</span>
              {['Todos', ...b.services.map(s => s.name)].map((opt) => (
                <button key={opt} onClick={() => setStatementFilter(opt)} style={{ padding: '6px 14px', fontSize: '12px', fontWeight: '600', borderRadius: '6px', border: `1px solid ${statementFilter === opt ? COLORS.primary : COLORS.border}`, backgroundColor: statementFilter === opt ? COLORS.bgBlue : COLORS.cardBg, color: statementFilter === opt ? COLORS.primary : COLORS.muted, cursor: 'pointer' }}>{opt}</button>
              ))}
            </div>
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 50px 120px 1fr 100px 100px', gap: '0', fontSize: '11px' }}>
                <div style={{ padding: '10px 12px', fontWeight: '700', color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, backgroundColor: COLORS.lightGray }}>Data</div>
                <div style={{ padding: '10px 12px', fontWeight: '700', color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, backgroundColor: COLORS.lightGray }}>Hora</div>
                <div style={{ padding: '10px 12px', fontWeight: '700', color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, backgroundColor: COLORS.lightGray }}>Serviço</div>
                <div style={{ padding: '10px 12px', fontWeight: '700', color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, backgroundColor: COLORS.lightGray }}>Detalhe</div>
                <div style={{ padding: '10px 12px', fontWeight: '700', color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, backgroundColor: COLORS.lightGray, textAlign: 'right' }}>Créditos</div>
                <div style={{ padding: '10px 12px', fontWeight: '700', color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, backgroundColor: COLORS.lightGray, textAlign: 'right' }}>Valor (USD)</div>
                {filteredStatement.map((row, i) => {
                  const color = serviceColors[row.service] || COLORS.muted;
                  return (
                    <Fragment key={i}>
                      <div style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, color: '#000', fontFamily: 'monospace', fontSize: '11px' }}>{row.date}</div>
                      <div style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, color: COLORS.muted, fontFamily: 'monospace', fontSize: '11px' }}>{row.time}</div>
                      <div style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}` }}>
                        <span style={{ fontSize: '10px', fontWeight: '600', color: color, backgroundColor: color + '12', padding: '2px 8px', borderRadius: '4px' }}>{row.service}</span>
                      </div>
                      <div style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, color: '#000', fontSize: '12px' }}>
                        {row.detail}
                        {row.records > 0 && <span style={{ fontSize: '10px', color: COLORS.muted, marginLeft: '6px' }}>({row.records.toLocaleString()} reg)</span>}
                      </div>
                      <div style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, textAlign: 'right', fontWeight: '600', color: '#000', fontFamily: 'monospace' }}>{row.credits.toLocaleString()}</div>
                      <div style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, textAlign: 'right', color: COLORS.muted, fontFamily: 'monospace' }}>$ {(row.credits * b.plan.creditPrice).toLocaleString()}</div>
                    </Fragment>
                  );
                })}
              </div>
              <div style={{ padding: '12px 16px', backgroundColor: COLORS.lightGray, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: COLORS.muted }}>Mostrando {filteredStatement.length} operações</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => logActivity && logActivity('Download extrato CSV', 'Faturamento')} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: '600', borderRadius: '6px', border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.cardBg, color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><FileDown size={12} /> CSV</button>
                  <button onClick={() => logActivity && logActivity('Download extrato PDF', 'Faturamento')} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: '600', borderRadius: '6px', border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.cardBg, color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><FileDown size={12} /> PDF</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === FATURAS === */}
        {activeTab === 'faturas' && (
          <div>
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 120px 100px 120px 140px 100px 80px', gap: '0', fontSize: '12px' }}>
                <div style={{ padding: '12px 14px', fontWeight: '700', color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, backgroundColor: COLORS.lightGray }}>Nº Fatura</div>
                <div style={{ padding: '12px 14px', fontWeight: '700', color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, backgroundColor: COLORS.lightGray }}>Período</div>
                <div style={{ padding: '12px 14px', fontWeight: '700', color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, backgroundColor: COLORS.lightGray }}>Status</div>
                <div style={{ padding: '12px 14px', fontWeight: '700', color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, backgroundColor: COLORS.lightGray, textAlign: 'right' }}>Créditos</div>
                <div style={{ padding: '12px 14px', fontWeight: '700', color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, backgroundColor: COLORS.lightGray, textAlign: 'right' }}>Valor</div>
                <div style={{ padding: '12px 14px', fontWeight: '700', color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, backgroundColor: COLORS.lightGray }}>Vencimento</div>
                <div style={{ padding: '12px 14px', fontWeight: '700', color: COLORS.muted, borderBottom: `2px solid ${COLORS.border}`, backgroundColor: COLORS.lightGray }}></div>
                {b.invoices.map((inv) => (
                  <Fragment key={inv.id}>
                    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${COLORS.border}`, fontWeight: '600', color: COLORS.primary, fontFamily: 'monospace', fontSize: '12px' }}>{inv.id}</div>
                    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${COLORS.border}`, color: '#000' }}>{inv.period}</div>
                    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${COLORS.border}` }}>
                      <Badge color={inv.status === 'Paga' ? 'green' : 'yellow'}>{inv.status}</Badge>
                    </div>
                    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${COLORS.border}`, textAlign: 'right', fontFamily: 'monospace', color: '#000' }}>{inv.credits.toLocaleString()}</div>
                    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${COLORS.border}`, textAlign: 'right', fontWeight: '700', color: '#000' }}>$ {inv.amount.toLocaleString()}</div>
                    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: '11px' }}>{inv.dueDate}</div>
                    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', gap: '4px' }}>
                      <button style={{ padding: '4px 8px', fontSize: '10px', fontWeight: '600', borderRadius: '4px', border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.cardBg, color: '#000', cursor: 'pointer' }}><FileDown size={10} /></button>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === PAGAMENTO === */}
        {activeTab === 'pagamento' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Current payment method */}
              <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', margin: '0 0 16px' }}>Método de Pagamento Ativo</h3>
                <div style={{ padding: '16px', backgroundColor: COLORS.lightGray, borderRadius: '10px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: COLORS.primary + '15', color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={16} /></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#000' }}>Faturamento Direto (Invoice)</div>
                      <div style={{ fontSize: '11px', color: COLORS.muted }}>Boleto/TED · Net 30</div>
                    </div>
                    <Badge color="green">Ativo</Badge>
                  </div>
                  <div style={{ fontSize: '12px', color: '#000', marginBottom: '4px' }}><strong>Empresa:</strong> {b.paymentMethod.company}</div>
                  <div style={{ fontSize: '12px', color: '#000', marginBottom: '4px' }}><strong>CNPJ:</strong> {b.paymentMethod.cnpj}</div>
                  <div style={{ fontSize: '12px', color: '#000' }}><strong>Banco:</strong> {b.paymentMethod.bank}</div>
                </div>
                <button onClick={() => setShowPaymentModal(true)} style={{ width: '100%', padding: '10px', backgroundColor: COLORS.cardBg, color: COLORS.primary, border: `1px solid ${COLORS.primary}`, borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Alterar Método de Pagamento</button>
              </div>

              {/* Billing contact */}
              <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', margin: '0 0 16px' }}>Dados de Faturamento</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Razão Social', value: b.paymentMethod.company },
                    { label: 'CNPJ', value: b.paymentMethod.cnpj },
                    { label: 'Email de Faturamento', value: 'financeiro@clientedemo.com.br' },
                    { label: 'Plano', value: `${b.plan.name} — $ ${b.plan.creditPrice.toFixed(2)}/crédito` },
                    { label: 'Contrato', value: `${b.contract.start} a ${b.contract.end}` },
                    { label: 'Créditos Contratados', value: b.contract.totalCredits.toLocaleString() },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: '12px', color: COLORS.muted }}>{row.label}</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#000' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment modal */}
            <Modal isOpen={showPaymentModal} title="Alterar Método de Pagamento" onClose={() => { setShowPaymentModal(false); setCardSaved(false); setInvoiceRequested(false); }}>
              <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: `2px solid ${COLORS.border}` }}>
                {[{ id: 'card', label: 'Cartão de Crédito' }, { id: 'invoice', label: 'Faturamento Direto' }].map((t) => (
                  <button key={t.id} onClick={() => setPaymentTab(t.id)} style={{ padding: '10px 16px', fontSize: '12px', fontWeight: '600', color: paymentTab === t.id ? COLORS.primary : COLORS.muted, background: 'none', border: 'none', borderBottom: paymentTab === t.id ? `2px solid ${COLORS.primary}` : '2px solid transparent', marginBottom: '-2px', cursor: 'pointer' }}>{t.label}</button>
                ))}
              </div>
              {paymentTab === 'card' && (
                <div>
                  {cardSaved ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: COLORS.success + '15', color: COLORS.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Check size={20} /></div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Cartão salvo com sucesso</div>
                      <div style={{ fontSize: '12px', color: COLORS.muted }}>Visa •••• 4242 será usado nas próximas faturas</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Número do Cartão</label>
                        <input placeholder="4242 4242 4242 4242" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Validade</label>
                          <input placeholder="MM/AA" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>CVC</label>
                          <input placeholder="123" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Nome no Cartão</label>
                        <input placeholder="CLIENTE DEMO S.A." style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <button onClick={() => setCardSaved(true)} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Salvar Cartão</button>
                    </div>
                  )}
                </div>
              )}
              {paymentTab === 'invoice' && (
                <div>
                  {invoiceRequested ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: COLORS.success + '15', color: COLORS.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Check size={20} /></div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Solicitação enviada</div>
                      <div style={{ fontSize: '12px', color: COLORS.muted }}>Nossa equipe financeira entrará em contato em até 2 dias úteis.</div>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: '12px', color: COLORS.muted, marginTop: 0, marginBottom: '16px' }}>Faturamento direto disponível para contratos anuais acima de $ 50,000. Faturas emitidas mensalmente com vencimento Net 30.</p>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>CNPJ da Empresa</label>
                        <input defaultValue={b.paymentMethod.cnpj} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Email para Nota Fiscal</label>
                        <input defaultValue="financeiro@clientedemo.com.br" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Observações</label>
                        <textarea placeholder="Informações adicionais para faturamento..." rows={3} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                      </div>
                      <button onClick={() => setInvoiceRequested(true)} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Solicitar Faturamento Direto</button>
                    </div>
                  )}
                </div>
              )}
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
};

const ColaboracaoPage = ({ logActivity, onCollabSummaryChange }) => {
  const [selectedCollab, setSelectedCollab] = useState(0);
  const [showNewCollab, setShowNewCollab] = useState(false);
  const [newCollabStep, setNewCollabStep] = useState(0);
  const [newCollabName, setNewCollabName] = useState('');
  const [newCollabPartner, setNewCollabPartner] = useState('');
  const [newCollabRole, setNewCollabRole] = useState('Host');
  const [newCollabFlow, setNewCollabFlow] = useState('');
  const [newCollabSources, setNewCollabSources] = useState({ audiences: true, events: false, transactions: false, profiles: true });
  const [newCollabPerms, setNewCollabPerms] = useState({ audiences: true, reports: true, activation: false, rawData: false });
  const [creatingCollab, setCreatingCollab] = useState(false);
  const [dynamicCollabs, setDynamicCollabs] = useState([]);
  const [permOverrides, setPermOverrides] = useState({});
  const [acceptingTC, setAcceptingTC] = useState(false);
  const [tcAccepted, setTcAccepted] = useState({});
  const [collabStatuses, setCollabStatuses] = useState({});
  const [collabMenuOpen, setCollabMenuOpen] = useState(null);
  const [deletedCollabs, setDeletedCollabs] = useState({});
  const [newCollabEmail, setNewCollabEmail] = useState('');
  const [newCollabMessage, setNewCollabMessage] = useState('');
  const [inviteSent, setInviteSent] = useState(null);
  const [activeSection, setActiveSection] = useState('collabs');
  const [requestActions, setRequestActions] = useState({});

  const pendingRequests = [
    { id: 'req-1', from: 'DataMart Latam', email: 'partnerships@datamart.lat', type: 'Retail Media Network', flow: 'bidirectional', date: '22/03/2026',
      message: 'Gostaríamos de iniciar uma colaboração de dados para enriquecimento mútuo de audiências. Temos 3.2M de registros de transações e-commerce que podem complementar seus perfis de engajamento.',
      sources: ['Transações e-Commerce (3.2M)', 'Catálogo de Produtos (120K)'], permissions: { audiences: true, reports: true, activation: false, rawData: false } },
    { id: 'req-2', from: 'AdTech360', email: 'collab@adtech360.com.br', type: 'Ad Network', flow: 'receiving', date: '24/03/2026',
      message: 'Oferecemos purchase signals agregados de 450+ e-commerces para enriquecimento de audiências. Sem necessidade de envio de dados da sua parte.',
      sources: ['Purchase Signals Agregados (8.5M)', 'Segmentos de Intenção (1.2M)'], permissions: { audiences: true, reports: true, activation: true, rawData: false } },
  ];

  const baseCollabs = [
    {
      id: 1, name: 'Retail Media — MegaStore', status: 'Ativo', role: 'Host',
      partner: { name: 'MegaStore Brasil', type: 'Retail Media Network' },
      created: '15/01/2026', lastSync: 'Há 2h',
      matchRate: '72.4%',
      flow: 'bidirectional',
      flowDesc: 'Vocês enviam dados de audiência, MegaStore envia dados de compra. Os dados são cruzados no Clean Room — nenhuma das partes vê os dados brutos da outra.',
      ourData: [{ name: 'Audiências Segmentadas', records: '1.2M', type: 'Identifier + Dimension' }, { name: 'Scores de Engajamento', records: '847K', type: 'Metric' }],
      theirData: [{ name: 'Transações POS', records: '2.4M', type: 'Conversions' }, { name: 'Catálogo SKU', records: '45K', type: 'Dimension' }],
      outputData: [{ name: 'Audiências Enriquecidas', records: '680K', type: 'Match' }, { name: 'Attribution Report', records: '—', type: 'Measurement' }],
      measurement: { conversions: '34,521', roas: '4.2x', incrementality: '1.8x', arpu: 'R$ 127' },
      permissions: { audiences: true, reports: true, activation: true, rawData: false },
    },
    {
      id: 2, name: 'Finance Insights — BancoPay', status: 'Ativo', role: 'Collaborator',
      partner: { name: 'BancoPay S.A.', type: 'Financial Services' },
      created: '03/02/2026', lastSync: 'Há 6h',
      matchRate: '65.1%',
      flow: 'receiving',
      flowDesc: 'BancoPay envia purchase signals agregados (nível ZIP+4). Vocês enriquecem suas audiências com esses sinais de compra — sem enviar dados de volta.',
      ourData: [],
      theirData: [{ name: 'Purchase Signals', records: '1.1M', type: 'Metrics (agregados)' }, { name: 'Segmentos Financeiros', records: '890K', type: 'Dimension' }],
      outputData: [{ name: 'Audiências com Purchase Intent', records: '340K', type: 'Enrichment' }],
      measurement: { conversions: '12,847', roas: '3.1x', incrementality: '1.4x', arpu: 'R$ 89' },
      permissions: { audiences: true, reports: true, activation: false, rawData: false },
    },
    {
      id: 3, name: 'Telco Audiences — ConectaBR', status: 'Pendente', role: 'Host',
      partner: { name: 'ConectaBR Telecom', type: 'Telecommunications' },
      created: '20/03/2026', lastSync: '—',
      matchRate: '—',
      flow: 'sending',
      flowDesc: 'Vocês enviam audiências para ConectaBR ativar via SMS/RCS. Eles não enviam dados — apenas recebem segmentos para ativação de campanha.',
      ourData: [{ name: 'Segmentos para Ativação', records: '—', type: 'Identifier' }],
      theirData: [],
      outputData: [{ name: 'Delivery Reports', records: '—', type: 'Measurement' }],
      measurement: { conversions: '—', roas: '—', incrementality: '—', arpu: '—' },
      permissions: { audiences: false, reports: false, activation: false, rawData: false },
    },
  ];

  const collaborations = [...baseCollabs, ...dynamicCollabs].filter(c => !deletedCollabs[c.id]);
  const collab = collaborations[selectedCollab] || collaborations[0];
  const permLabels = { audiences: 'Audiências', reports: 'Relatórios', activation: 'Ativação Direta', rawData: 'Dados Raw' };
  const flowColors = { bidirectional: '#8B5CF6', receiving: COLORS.success, sending: COLORS.primary };
  const flowLabels = { bidirectional: 'Cruzamento mútuo', receiving: 'Recebendo dados', sending: 'Enviando dados' };
  const FlowIcon = ({ flow, size = 14 }) => {
    if (flow === 'bidirectional') return <ArrowLeftRight size={size} />;
    if (flow === 'sending') return <ArrowRight size={size} />;
    return <ArrowLeft size={size} />;
  };
  const SOURCE_OPTIONS = [
    { key: 'audiences', label: 'Audiências Segmentadas', records: '1.2M', type: 'Identifier + Dimension' },
    { key: 'events', label: 'Eventos Comportamentais', records: '3.4M', type: 'Events' },
    { key: 'transactions', label: 'Transações e-Commerce', records: '890K', type: 'Conversions' },
    { key: 'profiles', label: 'Golden Profiles', records: '620K', type: 'Identifier + Metric' },
  ];

  const getPermVal = (collabId, key, defaultVal) => {
    const k = `${collabId}-${key}`;
    return k in permOverrides ? permOverrides[k] : defaultVal;
  };
  const togglePerm = (collabId, key, currentVal) => {
    setPermOverrides(prev => ({ ...prev, [`${collabId}-${key}`]: !currentVal }));
    if (logActivity) logActivity('Permissão alterada', `${permLabels[key]} → ${!currentVal ? 'Permitido' : 'Bloqueado'}`, { category: 'governance' });
  };

  const resetNewCollab = () => {
    setShowNewCollab(false); setNewCollabStep(0); setNewCollabName(''); setNewCollabPartner('');
    setNewCollabRole('Host'); setNewCollabFlow(''); setCreatingCollab(false);
    setNewCollabSources({ audiences: true, events: false, transactions: false, profiles: true });
    setNewCollabPerms({ audiences: true, reports: true, activation: false, rawData: false });
    setNewCollabEmail(''); setNewCollabMessage(''); setInviteSent(null);
  };
  const handleAcceptRequest = (reqId) => {
    setRequestActions(prev => ({ ...prev, [reqId]: 'accepting' }));
    setTimeout(() => {
      const req = pendingRequests.find(r => r.id === reqId);
      setRequestActions(prev => ({ ...prev, [reqId]: 'accepted' }));
      if (req) {
        setDynamicCollabs(prev => [...prev, {
          id: 200 + prev.length, name: `Collab — ${req.from}`, status: 'Ativo', role: 'Collaborator',
          partner: { name: req.from, type: req.type },
          created: new Date().toLocaleDateString('pt-BR'), lastSync: '—', matchRate: '—',
          flow: req.flow,
          flowDesc: req.message,
          ourData: [], theirData: req.sources.map(s => ({ name: s, records: '—', type: 'Source' })),
          outputData: [{ name: 'Match Output', records: '—', type: 'Aguardando' }],
          measurement: { conversions: '—', roas: '—', incrementality: '—', arpu: '—' },
          permissions: { ...req.permissions },
        }]);
        if (logActivity) logActivity('Solicitação aceita', req.from, { category: 'governance' });
      }
    }, 2000);
  };
  const handleDeclineRequest = (reqId) => {
    setRequestActions(prev => ({ ...prev, [reqId]: 'declined' }));
    const req = pendingRequests.find(r => r.id === reqId);
    if (req && logActivity) logActivity('Solicitação recusada', req.from, { category: 'governance' });
  };

  const handleCreateCollab = () => {
    if (!newCollabName || !newCollabPartner || !newCollabFlow || !newCollabEmail) return;
    setCreatingCollab(true);
    const flowDescs = {
      bidirectional: `Vocês e ${newCollabPartner} compartilham dados mutuamente no Clean Room. Nenhuma das partes vê os dados brutos da outra — apenas o output cruzado.`,
      sending: `Vocês enviam audiências e sources para ${newCollabPartner}. Eles não enviam dados — apenas recebem segmentos para ativação.`,
      receiving: `${newCollabPartner} envia dados (ex: purchase signals) para enriquecer suas audiências. Vocês não enviam dados de volta.`,
    };
    const selectedSources = SOURCE_OPTIONS.filter(s => newCollabSources[s.key]);
    setTimeout(() => {
      setDynamicCollabs(prev => [...prev, {
        id: 100 + prev.length, name: newCollabName, status: 'Pendente', role: newCollabRole,
        partner: { name: newCollabPartner, type: 'Novo Parceiro' },
        created: new Date().toLocaleDateString('pt-BR'), lastSync: '—', matchRate: '—',
        flow: newCollabFlow,
        flowDesc: flowDescs[newCollabFlow],
        ourData: newCollabFlow !== 'receiving' ? selectedSources.map(s => ({ name: s.label, records: s.records, type: s.type })) : [],
        theirData: newCollabFlow !== 'sending' ? [{ name: 'Dados do Parceiro', records: '—', type: 'Aguardando conexão' }] : [],
        outputData: [{ name: newCollabFlow === 'bidirectional' ? 'Match Output' : 'Delivery Report', records: '—', type: 'Aguardando' }],
        measurement: { conversions: '—', roas: '—', incrementality: '—', arpu: '—' },
        permissions: { ...newCollabPerms },
      }]);
      if (logActivity) logActivity('Colaboração criada', newCollabName, { category: 'governance' });
      setSelectedCollab(collaborations.length);
      setInviteSent(newCollabEmail);
      setCreatingCollab(false);
      setNewCollabStep(5);
    }, 2500);
  };

  const handleAcceptTC = (collabId) => {
    setAcceptingTC(true);
    setTimeout(() => {
      setTcAccepted(prev => ({ ...prev, [collabId]: true }));
      setAcceptingTC(false);
      if (logActivity) logActivity('T&C aceito', collab.partner.name, { category: 'governance' });
    }, 1500);
  };

  const collabStatus = (c) => {
    if (collabStatuses[c.id]) return collabStatuses[c.id];
    if (tcAccepted[c.id]) return 'Ativo';
    return c.status;
  };

  // Report summary to parent for Governança reactivity
  useEffect(() => {
    if (!onCollabSummaryChange) return;
    const statuses = collaborations.map(c => collabStatus(c));
    const active = statuses.filter(s => s === 'Ativo').length;
    const paused = statuses.filter(s => s === 'Pausado').length;
    const deactivated = statuses.filter(s => s === 'Desativado').length;
    onCollabSummaryChange({ active, paused, deactivated, total: collaborations.length, participants: collaborations.length, queries: 1247 + active * 100 });
  }, [collaborations.length, collabStatuses, deletedCollabs, dynamicCollabs, tcAccepted]);
  const handleCollabAction = (c, action) => {
    if (action === 'pause') {
      setCollabStatuses(prev => ({ ...prev, [c.id]: 'Pausado' }));
      if (logActivity) logActivity('Colaboração pausada', c.name, { category: 'governance' });
    } else if (action === 'activate') {
      setCollabStatuses(prev => ({ ...prev, [c.id]: 'Ativo' }));
      if (logActivity) logActivity('Colaboração reativada', c.name, { category: 'governance' });
    } else if (action === 'deactivate') {
      setCollabStatuses(prev => ({ ...prev, [c.id]: 'Desativado' }));
      if (logActivity) logActivity('Colaboração desativada', c.name, { category: 'governance' });
    } else if (action === 'delete') {
      setDeletedCollabs(prev => ({ ...prev, [c.id]: true }));
      if (logActivity) logActivity('Colaboração eliminada', c.name, { category: 'governance' });
      setSelectedCollab(0);
    }
    setCollabMenuOpen(null);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#000', margin: 0 }}>Colaboração de Dados</h1>
          <button onClick={() => { setShowNewCollab(true); setNewCollabStep(0); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            <Plus size={16} /> Nova Colaboração
          </button>
        </div>
        <p style={{ fontSize: '13px', color: COLORS.muted, margin: '8px 0 24px' }}>Gerencie colaborações em Data Clean Rooms com parceiros e fornecedores.</p>

        {/* New Collaboration Wizard — DCR-inspired multi-step */}
        {showNewCollab && (
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `2px solid ${COLORS.primary}30`, boxShadow: '0 8px 32px rgba(27,89,248,.12)', padding: '24px', marginBottom: '24px', animation: 'fadeInDown 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: 0 }}>Nova Colaboração</h3>
              <button onClick={resetNewCollab} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: COLORS.muted }}>✕</button>
            </div>
            {/* Step indicator */}
            {newCollabStep < 5 && (
            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
              {['Direção DCR', 'Parceiro', 'Sources', 'Permissões', 'Convite'].map((s, i) => (
                <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: i <= newCollabStep ? COLORS.primary : COLORS.border, transition: 'background-color 0.3s' }} />
              ))}
            </div>
            )}

            {/* Step 0 — Flow Direction (DCR type) */}
            {newCollabStep === 0 && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Qual a direção do compartilhamento de dados?</div>
                <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '16px' }}>Defina como os dados fluem entre você e o parceiro no Data Clean Room.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { key: 'bidirectional', icon: ArrowLeftRight, label: 'Cruzamento Mútuo (Clean Room)', desc: 'Ambas as partes enviam dados para o DCR. Os dados são cruzados de forma segura — ninguém vê dados brutos do outro. Saída: audiências enriquecidas e attribution reports.', example: 'Você envia audiências, parceiro envia transações POS. Output: audiências com purchase intent.' },
                    { key: 'sending', icon: ArrowUpRight, label: 'Envio para Ativação', desc: 'Você envia audiências segmentadas para o parceiro ativar (SMS, RCS, mídia programática). O parceiro não envia dados de volta.', example: 'Você envia segmentos. Parceiro ativa campanha e retorna delivery reports.' },
                    { key: 'receiving', icon: ArrowDownRight, label: 'Recebimento de Sinais', desc: 'O parceiro envia purchase signals, dados financeiros ou insights agregados para enriquecer suas audiências. Você não envia dados.', example: 'Parceiro envia signals de compra (nível ZIP+4). Você enriquece audiências com purchase intent.' },
                  ].map(f => {
                    const IconComp = f.icon;
                    return (
                    <div key={f.key} onClick={() => setNewCollabFlow(f.key)} style={{
                      padding: '16px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s',
                      border: `1px solid ${newCollabFlow === f.key ? flowColors[f.key] : COLORS.border}`,
                      backgroundColor: newCollabFlow === f.key ? COLORS.bgBlue : 'transparent',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: newCollabFlow === f.key ? flowColors[f.key] + '15' : COLORS.lightGray, display: 'flex', alignItems: 'center', justifyContent: 'center', color: flowColors[f.key], flexShrink: 0 }}>
                          <IconComp size={16} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: newCollabFlow === f.key ? flowColors[f.key] : '#000' }}>{f.label}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: COLORS.muted, lineHeight: '1.5', marginBottom: '6px', paddingLeft: '42px' }}>{f.desc}</div>
                      <div style={{ fontSize: '10px', color: flowColors[f.key], paddingLeft: '42px' }}>{f.example}</div>
                    </div>
                  );
                  })}
                </div>
                <button onClick={() => newCollabFlow && setNewCollabStep(1)} disabled={!newCollabFlow} style={{ marginTop: '16px', width: '100%', padding: '12px', backgroundColor: newCollabFlow ? COLORS.primary : COLORS.border, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: newCollabFlow ? 'pointer' : 'default' }}>Próximo →</button>
              </div>
            )}

            {/* Step 1 — Partner info */}
            {newCollabStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>Nome da Colaboração</div>
                  <input value={newCollabName} onChange={e => setNewCollabName(e.target.value)} placeholder="Ex: Retail Media — MegaStore" style={{ width: '100%', padding: '10px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>Parceiro (organização)</div>
                  <input value={newCollabPartner} onChange={e => setNewCollabPartner(e.target.value)} placeholder="Ex: MegaStore Brasil" style={{ width: '100%', padding: '10px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>Seu papel</div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['Host', 'Collaborator'].map(r => (
                      <button key={r} onClick={() => setNewCollabRole(r)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: `2px solid ${newCollabRole === r ? COLORS.primary : COLORS.border}`, backgroundColor: newCollabRole === r ? COLORS.bgBlue : 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: newCollabRole === r ? COLORS.primary : '#000' }}>{r === 'Host' ? 'Host' : 'Collaborator'}</div>
                        <div style={{ fontSize: '11px', color: COLORS.muted, marginTop: '4px' }}>{r === 'Host' ? 'Você define permissões, termos e convida' : 'Você é convidado e aceita os termos'}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setNewCollabStep(0)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: COLORS.muted }}>← Voltar</button>
                  <button onClick={() => (newCollabName && newCollabPartner) && setNewCollabStep(2)} disabled={!newCollabName || !newCollabPartner} style={{ flex: 2, padding: '12px', backgroundColor: (newCollabName && newCollabPartner) ? COLORS.primary : COLORS.border, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: (newCollabName && newCollabPartner) ? 'pointer' : 'default' }}>Próximo →</button>
                </div>
              </div>
            )}

            {/* Step 2 — Sources to share */}
            {newCollabStep === 2 && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>
                  {newCollabFlow === 'receiving' ? 'Sources que você espera receber' : 'Sources que você vai compartilhar no DCR'}
                </div>
                <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '16px' }}>
                  {newCollabFlow === 'receiving'
                    ? 'Selecione os tipos de dados que o parceiro vai enviar. Isso será parte do convite.'
                    : 'Selecione quais datasets internos serão associados a esta colaboração. O parceiro só verá outputs processados.'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SOURCE_OPTIONS.map(s => (
                    <div key={s.key} onClick={() => setNewCollabSources(prev => ({ ...prev, [s.key]: !prev[s.key] }))} style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px', cursor: 'pointer',
                      border: `1px solid ${newCollabSources[s.key] ? COLORS.primary + '40' : COLORS.border}`,
                      backgroundColor: newCollabSources[s.key] ? COLORS.bgBlue : 'transparent', transition: 'all 0.15s',
                    }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${newCollabSources[s.key] ? COLORS.primary : COLORS.border}`, backgroundColor: newCollabSources[s.key] ? COLORS.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', flexShrink: 0 }}>
                        {newCollabSources[s.key] && '✓'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>{s.label}</div>
                        <div style={{ fontSize: '11px', color: COLORS.muted }}>{s.type} — {s.records} registros</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button onClick={() => setNewCollabStep(1)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: COLORS.muted }}>← Voltar</button>
                  <button onClick={() => setNewCollabStep(3)} style={{ flex: 2, padding: '12px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Próximo →</button>
                </div>
              </div>
            )}

            {/* Step 3 — Default permissions policy */}
            {newCollabStep === 3 && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Política de Permissões Padrão</div>
                <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '16px' }}>Defina o que o {newCollabRole === 'Host' ? 'collaborator' : 'host'} poderá acessar. Pode ser alterado por source depois.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(permLabels).map(([key, label]) => (
                    <div key={key} onClick={() => setNewCollabPerms(prev => ({ ...prev, [key]: !prev[key] }))} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                      backgroundColor: COLORS.lightGray, transition: 'all 0.15s',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>{label}</div>
                        <div style={{ fontSize: '10px', color: COLORS.muted }}>
                          {key === 'audiences' && 'Criar e visualizar audiências combinadas'}
                          {key === 'reports' && 'Acessar measurement reports e dashboards'}
                          {key === 'activation' && 'Enviar audiências direto para media partners'}
                          {key === 'rawData' && 'Acessar dados em nível de registro (user-level)'}
                        </div>
                      </div>
                      <div style={{ width: '40px', height: '22px', borderRadius: '11px', backgroundColor: newCollabPerms[key] ? COLORS.success : COLORS.border, position: 'relative', transition: 'background-color 0.2s', flexShrink: 0 }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '2px', transition: 'left 0.2s', left: newCollabPerms[key] ? '20px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                      </div>
                    </div>
                  ))}
                </div>
                {newCollabPerms.rawData && (
                  <div style={{ marginTop: '10px', padding: '10px 12px', backgroundColor: '#FFA500' + '10', border: '1px solid #FFA500' + '30', borderRadius: '8px', fontSize: '11px', color: '#D97706', lineHeight: '1.4', display: 'flex', alignItems: 'start', gap: '8px' }}>
                    <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span>Dados Raw habilitados — o parceiro terá acesso a registros individuais. Certifique-se de que os termos e compliance permitem.</span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button onClick={() => setNewCollabStep(2)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: COLORS.muted }}>← Voltar</button>
                  <button onClick={() => setNewCollabStep(4)} style={{ flex: 2, padding: '12px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Próximo →</button>
                </div>
              </div>
            )}

            {/* Step 4 — Invite (email + message + review) */}
            {newCollabStep === 4 && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Enviar Convite</div>
                <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '16px' }}>O parceiro receberá um email com as instruções de como configurar o lado dele e iniciar a colaboração.</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>Email do responsável no parceiro</label>
                    <input value={newCollabEmail} onChange={e => setNewCollabEmail(e.target.value)} type="email" placeholder="partnerships@parceiro.com" style={{ width: '100%', padding: '10px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = COLORS.primary} onBlur={e => e.target.style.borderColor = COLORS.border} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>Mensagem personalizada (opcional)</label>
                    <textarea value={newCollabMessage} onChange={e => setNewCollabMessage(e.target.value)} placeholder="Descreva brevemente o objetivo da colaboração..." rows={3} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }} onFocus={e => e.target.style.borderColor = COLORS.primary} onBlur={e => e.target.style.borderColor = COLORS.border} />
                  </div>
                </div>

                {/* Summary card */}
                <div style={{ padding: '16px', backgroundColor: COLORS.lightGray, borderRadius: '10px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', marginBottom: '10px' }}>Resumo do Convite</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <div><div style={{ fontSize: '10px', color: COLORS.muted }}>Colaboração</div><div style={{ fontSize: '12px', fontWeight: '600', color: '#000' }}>{newCollabName || '—'}</div></div>
                    <div><div style={{ fontSize: '10px', color: COLORS.muted }}>Parceiro</div><div style={{ fontSize: '12px', fontWeight: '600', color: '#000' }}>{newCollabPartner || '—'}</div></div>
                    <div><div style={{ fontSize: '10px', color: COLORS.muted }}>Direção</div><div style={{ fontSize: '12px', fontWeight: '600', color: flowColors[newCollabFlow] || '#000', display: 'flex', alignItems: 'center', gap: '4px' }}><FlowIcon flow={newCollabFlow} size={12} /> {flowLabels[newCollabFlow] || '—'}</div></div>
                    <div><div style={{ fontSize: '10px', color: COLORS.muted }}>Seu papel</div><div style={{ fontSize: '12px', fontWeight: '600', color: '#000' }}>{newCollabRole}</div></div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {SOURCE_OPTIONS.filter(s => newCollabSources[s.key]).map(s => (
                      <span key={s.key} style={{ padding: '3px 8px', backgroundColor: COLORS.primary + '10', borderRadius: '10px', fontSize: '10px', fontWeight: '600', color: COLORS.primary }}>{s.label}</span>
                    ))}
                    {Object.entries(newCollabPerms).filter(([, v]) => v).map(([k]) => (
                      <span key={k} style={{ padding: '3px 8px', backgroundColor: COLORS.success + '10', borderRadius: '10px', fontSize: '10px', fontWeight: '600', color: COLORS.success }}>{permLabels[k]}</span>
                    ))}
                  </div>
                </div>

                {/* Email preview */}
                <div style={{ padding: '14px', backgroundColor: '#fff', borderRadius: '10px', border: `1px solid ${COLORS.border}`, marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', marginBottom: '8px' }}>Preview do Email</div>
                  <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '4px' }}>Para: <strong style={{ color: '#000' }}>{newCollabEmail || '—'}</strong></div>
                  <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '8px' }}>De: <strong style={{ color: '#000' }}>noreply@revfy.io</strong></div>
                  <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: '8px', fontSize: '12px', color: '#000', lineHeight: '1.6' }}>
                    <strong>Convite para Colaboração de Dados — {newCollabName || 'Nova Colaboração'}</strong><br />
                    <span style={{ color: COLORS.muted }}>
                      Olá, a equipe da Revfy convida {newCollabPartner || 'sua organização'} para uma colaboração de dados via Data Clean Room.
                      {newCollabMessage && <><br /><br />"{newCollabMessage}"</>}
                      <br /><br />Acesse o link abaixo para aceitar os termos, configurar suas fontes de dados e iniciar o compartilhamento seguro.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setNewCollabStep(3)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: COLORS.muted }}>← Voltar</button>
                  <button onClick={handleCreateCollab} disabled={creatingCollab || !newCollabEmail} style={{ flex: 2, padding: '12px', backgroundColor: (creatingCollab || !newCollabEmail) ? COLORS.border : COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: (creatingCollab || !newCollabEmail) ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {creatingCollab ? (<><div style={{ width: '14px', height: '14px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Enviando convite...</>) : (<><Send size={14} /> Enviar Convite</>)}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5 — Confirmation */}
            {newCollabStep === 5 && inviteSent && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: COLORS.success + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={28} color={COLORS.success} />
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '6px' }}>Convite Enviado</div>
                <div style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '20px', lineHeight: '1.5' }}>
                  Um email foi enviado para <strong style={{ color: '#000' }}>{inviteSent}</strong> com todas as instruções para que {newCollabPartner || 'o parceiro'} configure o lado dele e aceite os termos da colaboração.
                </div>
                <div style={{ padding: '12px 16px', backgroundColor: COLORS.lightGray, borderRadius: '8px', fontSize: '11px', color: COLORS.muted, lineHeight: '1.5', textAlign: 'left', marginBottom: '20px' }}>
                  <strong style={{ color: '#000' }}>O que acontece agora:</strong><br />
                  1. O parceiro recebe o email e acessa o link de configuração<br />
                  2. Ele configura suas fontes de dados e aceita os T&C<br />
                  3. O match de identifiers é executado no Clean Room<br />
                  4. Vocês começam a colaborar com os outputs gerados
                </div>
                <button onClick={resetNewCollab} style={{ padding: '12px 32px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Fechar</button>
              </div>
            )}
          </div>
        )}

        {/* Section tabs */}
        <div style={{ display: 'flex', borderBottom: `2px solid ${COLORS.border}`, marginBottom: '24px' }}>
          {[
            { id: 'collabs', label: 'Colaborações', count: collaborations.length },
            { id: 'requests', label: 'Solicitações Recebidas', count: pendingRequests.filter(r => !requestActions[r.id]).length },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveSection(tab.id)} style={{
              padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none',
              borderBottom: `2px solid ${activeSection === tab.id ? COLORS.primary : 'transparent'}`, marginBottom: '-2px',
              color: activeSection === tab.id ? COLORS.primary : COLORS.muted, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              {tab.label}
              {tab.count > 0 && (
                <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '700', backgroundColor: activeSection === tab.id ? COLORS.primary + '15' : COLORS.lightGray, color: activeSection === tab.id ? COLORS.primary : COLORS.muted }}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Received Requests */}
        {activeSection === 'requests' && (
          <div>
            <div style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '16px' }}>Solicitações de parceiros que querem iniciar uma colaboração de dados com você. Revise os termos e aceite ou recuse.</div>
            {pendingRequests.filter(r => !requestActions[r.id] || requestActions[r.id] === 'accepting').length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
                <Send size={32} color={COLORS.muted} style={{ marginBottom: '12px', opacity: 0.3 }} />
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Nenhuma solicitação pendente</div>
                <div style={{ fontSize: '12px', color: COLORS.muted }}>Quando um parceiro enviar um convite, ele aparecerá aqui.</div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingRequests.map(req => {
                const action = requestActions[req.id];
                if (action === 'accepted' || action === 'declined') return (
                  <div key={req.id} style={{ padding: '16px 20px', backgroundColor: COLORS.lightGray, borderRadius: '12px', border: `1px solid ${COLORS.border}`, opacity: 0.6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>{req.from}</span>
                      <Badge color={action === 'accepted' ? 'green' : 'red'}>{action === 'accepted' ? 'Aceita' : 'Recusada'}</Badge>
                    </div>
                  </div>
                );
                return (
                  <div key={req.id} style={{ padding: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#000', marginBottom: '2px' }}>{req.from}</div>
                        <div style={{ fontSize: '12px', color: COLORS.muted }}>{req.type} — {req.email}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ color: flowColors[req.flow] }}><FlowIcon flow={req.flow} size={14} /></div>
                        <Badge color={req.flow === 'bidirectional' ? 'blue' : 'green'} variant="outline">{flowLabels[req.flow]}</Badge>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#000', lineHeight: '1.5', marginBottom: '14px', padding: '12px', backgroundColor: COLORS.lightGray, borderRadius: '8px' }}>
                      {req.message}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', marginBottom: '6px' }}>Sources oferecidos</div>
                        {req.sources.map((s, i) => (
                          <div key={i} style={{ fontSize: '11px', color: '#000', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Database size={10} color={COLORS.primary} /> {s}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', marginBottom: '6px' }}>Permissões solicitadas</div>
                        {Object.entries(req.permissions).filter(([, v]) => v).map(([k]) => (
                          <div key={k} style={{ fontSize: '11px', color: COLORS.success, marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={10} /> {permLabels[k]}
                          </div>
                        ))}
                        {Object.entries(req.permissions).filter(([, v]) => !v).map(([k]) => (
                          <div key={k} style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Ban size={10} /> {permLabels[k]}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '14px' }}>Recebido em {req.date}</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleAcceptRequest(req.id)} disabled={action === 'accepting'} style={{
                        flex: 2, padding: '10px', backgroundColor: action === 'accepting' ? COLORS.muted : COLORS.success, color: '#fff',
                        border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: action === 'accepting' ? 'wait' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      }}>
                        {action === 'accepting' ? (<><div style={{ width: '14px', height: '14px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Aceitando...</>) : (<><Check size={14} /> Aceitar Colaboração</>)}
                      </button>
                      <button onClick={() => handleDeclineRequest(req.id)} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: COLORS.muted }}>Recusar</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'collabs' && (<Fragment>
        {/* Summary KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { l: 'Colaborações Ativas', v: String(collaborations.filter(c => collabStatus(c) === 'Ativo').length), sub: `de ${collaborations.length} total` },
            { l: 'Match Rate Médio', v: '68.8%', sub: 'identifiers cruzados' },
            { l: 'Conversões via Collab', v: '47,368', sub: 'atribuídas a colaborações' },
            { l: 'ROAS Médio', v: '3.7x', sub: 'return on ad spend D30' },
          ].map((kpi, i) => (
            <div key={i} style={{ padding: '16px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
              <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '4px' }}>{kpi.l}</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#000' }}>{kpi.v}</div>
              <div style={{ fontSize: '11px', color: COLORS.success, fontWeight: '500' }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>

          {/* Left — Collaboration list */}
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>Colaborações</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {collaborations.map((c, idx) => {
                const st = collabStatus(c);
                const badgeColor = st === 'Ativo' ? 'green' : st === 'Pausado' ? 'yellow' : st === 'Desativado' ? 'red' : 'yellow';
                return (
                <div key={c.id} onClick={() => setSelectedCollab(idx)} style={{
                  padding: '14px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
                  backgroundColor: selectedCollab === idx ? COLORS.bgBlue : 'transparent',
                  borderLeft: `3px solid ${selectedCollab === idx ? flowColors[c.flow] || COLORS.primary : 'transparent'}`,
                  border: `1px solid ${selectedCollab === idx ? COLORS.primary + '30' : COLORS.border}`,
                  opacity: st === 'Desativado' ? 0.5 : st === 'Pausado' ? 0.75 : 1,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>{c.name.split('—')[0].trim()}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Badge color={badgeColor} variant="outline">{st}</Badge>
                      <button onClick={(e) => { e.stopPropagation(); setCollabMenuOpen(collabMenuOpen === c.id ? null : c.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px', color: COLORS.muted, fontSize: '14px' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                  {/* Action menu */}
                  {collabMenuOpen === c.id && (
                    <div style={{ position: 'absolute', right: '8px', top: '36px', backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,.15)', zIndex: 20, minWidth: '160px', animation: 'fadeInDown 0.15s ease', overflow: 'hidden' }}>
                      {(st === 'Ativo' || st === 'Pendente') && (
                        <button onClick={(e) => { e.stopPropagation(); handleCollabAction(c, 'pause'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', color: '#000', textAlign: 'left' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <Pause size={14} color="#FFA500" /> Pausar
                        </button>
                      )}
                      {st === 'Pausado' && (
                        <button onClick={(e) => { e.stopPropagation(); handleCollabAction(c, 'activate'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', color: '#000', textAlign: 'left' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <Play size={14} color={COLORS.success} /> Reativar
                        </button>
                      )}
                      {st !== 'Desativado' && (
                        <button onClick={(e) => { e.stopPropagation(); handleCollabAction(c, 'deactivate'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', color: '#000', textAlign: 'left' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <Ban size={14} color="#EF4444" /> Desativar
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); handleCollabAction(c, 'delete'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', color: '#EF4444', textAlign: 'left', borderTop: `1px solid ${COLORS.border}` }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEF2F2'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '4px' }}>{c.partner.name}</div>
                  <div style={{ fontSize: '10px', fontWeight: '600', color: flowColors[c.flow] || COLORS.muted, display: 'flex', alignItems: 'center', gap: '4px' }}><FlowIcon flow={c.flow} size={10} /> {flowLabels[c.flow]}</div>
                </div>
              );
              })}
            </div>
          </div>

          {/* Right — Detail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Header with flow diagram */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: '0 0 4px' }}>{collab.name}</h2>
                  <div style={{ fontSize: '12px', color: COLORS.muted }}>{collab.partner.name} — {collab.partner.type}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Badge color={collab.role === 'Host' ? 'blue' : 'green'} variant="outline">{collab.role === 'Host' ? 'Host' : 'Collaborator'}</Badge>
                  <Badge color={collabStatus(collab) === 'Ativo' ? 'green' : collabStatus(collab) === 'Pausado' ? 'yellow' : collabStatus(collab) === 'Desativado' ? 'red' : 'yellow'}>{collabStatus(collab)}</Badge>
                  {collabStatus(collab) === 'Pausado' && (
                    <button onClick={() => handleCollabAction(collab, 'activate')} style={{ padding: '4px 12px', backgroundColor: COLORS.success, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Reativar</button>
                  )}
                  {collabStatus(collab) === 'Desativado' && (
                    <button onClick={() => handleCollabAction(collab, 'activate')} style={{ padding: '4px 12px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Reativar</button>
                  )}
                </div>
              </div>

              {/* Visual data flow — THE KEY PART */}
              <div style={{ padding: '16px', backgroundColor: COLORS.lightGray, borderRadius: '10px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', marginBottom: '10px' }}>Fluxo de Dados</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                  {/* Us */}
                  <div style={{ flex: 1, padding: '12px', backgroundColor: COLORS.bgBlue, borderRadius: '8px', border: `1px solid ${COLORS.primary}30`, textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: COLORS.primary }}>Revfy (Você)</div>
                    <div style={{ fontSize: '10px', color: COLORS.muted, marginTop: '2px' }}>{collab.ourData.length > 0 ? collab.ourData.map(d => d.name).join(', ') : 'Sem envio'}</div>
                  </div>
                  {/* Arrow */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                    <div style={{ color: flowColors[collab.flow] }}>
                      <FlowIcon flow={collab.flow} size={24} />
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: '600', color: flowColors[collab.flow], textTransform: 'uppercase', marginTop: '2px' }}>
                      {collab.flow === 'bidirectional' ? 'Clean Room' : collab.flow === 'sending' ? 'Envio' : 'Recebimento'}
                    </div>
                  </div>
                  {/* Them */}
                  <div style={{ flex: 1, padding: '12px', backgroundColor: '#F3E8FF', borderRadius: '8px', border: '1px solid #8B5CF630', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#8B5CF6' }}>{collab.partner.name.split(' ')[0]}</div>
                    <div style={{ fontSize: '10px', color: COLORS.muted, marginTop: '2px' }}>{collab.theirData.length > 0 ? collab.theirData.map(d => d.name).join(', ') : 'Sem envio'}</div>
                  </div>
                </div>
                {/* Output */}
                {collab.outputData.length > 0 && collab.outputData[0].records !== '—' && (
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <div style={{ color: COLORS.success }}><ArrowDown size={16} /></div>
                    <div style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: COLORS.success + '10', borderRadius: '8px', border: `1px solid ${COLORS.success}30` }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: COLORS.success }}>{collab.outputData.map(d => `${d.name} (${d.records})`).join(' + ')}</div>
                    </div>
                  </div>
                )}
                <div style={{ fontSize: '11px', color: COLORS.muted, marginTop: '12px', lineHeight: '1.5', textAlign: 'center' }}>{collab.flowDesc}</div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { l: 'Criado em', v: collab.created },
                  { l: 'Último Sync', v: collab.lastSync },
                  { l: 'Match Rate', v: collab.matchRate },
                ].map((m, i) => (
                  <div key={i} style={{ padding: '10px', backgroundColor: COLORS.lightGray, borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: COLORS.muted, marginBottom: '2px' }}>{m.l}</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: m.v === '—' ? COLORS.muted : '#000' }}>{m.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Paused/Deactivated banner */}
            {collabStatus(collab) === 'Pausado' && (
              <div style={{ padding: '14px 18px', backgroundColor: '#FFA500' + '10', border: '1px solid #FFA500' + '30', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Pause size={18} color="#FFA500" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>Colaboração Pausada</div>
                  <div style={{ fontSize: '11px', color: COLORS.muted }}>Nenhum sync ou compartilhamento está ocorrendo. Dados existentes permanecem acessíveis.</div>
                </div>
              </div>
            )}
            {collabStatus(collab) === 'Desativado' && (
              <div style={{ padding: '14px 18px', backgroundColor: '#EF4444' + '10', border: '1px solid #EF4444' + '30', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Ban size={18} color="#EF4444" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>Colaboração Desativada</div>
                  <div style={{ fontSize: '11px', color: COLORS.muted }}>Todo compartilhamento de dados foi encerrado. Reative para retomar.</div>
                </div>
              </div>
            )}

            {/* Permissions (toggleable) + Measurement */}
            {(collabStatus(collab) === 'Ativo' || collabStatus(collab) === 'Pausado') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '24px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={16} color={COLORS.primary} /> Permissões
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Object.entries(collab.permissions).map(([key, defaultVal]) => {
                      const val = getPermVal(collab.id, key, defaultVal);
                      return (
                        <div key={key} onClick={() => togglePerm(collab.id, key, val)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: COLORS.lightGray, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s' }}>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#000' }}>{permLabels[key]}</span>
                          <div style={{ width: '36px', height: '20px', borderRadius: '10px', backgroundColor: val ? COLORS.success : COLORS.border, position: 'relative', transition: 'background-color 0.2s' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '2px', transition: 'left 0.2s', left: val ? '18px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '24px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={16} color={COLORS.primary} /> Measurement
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      { l: 'Conversões', v: collab.measurement.conversions },
                      { l: 'ROAS D30', v: collab.measurement.roas },
                      { l: 'Incrementality', v: collab.measurement.incrementality },
                      { l: 'ARPU 30d', v: collab.measurement.arpu },
                    ].map((m, i) => (
                      <div key={i} style={{ padding: '12px', backgroundColor: COLORS.lightGray, borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: COLORS.muted, marginBottom: '2px' }}>{m.l}</div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: m.v === '—' ? COLORS.muted : '#000' }}>{m.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* T&C action for pending */}
            {collabStatus(collab) === 'Pendente' && (
              <div style={{ padding: '20px', backgroundColor: '#FFA500' + '08', border: '1px solid #FFA500' + '30', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '16px' }}>
                  <AlertCircle size={20} color="#FFA500" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>Aguardando aceite dos Termos e Condições</div>
                    <div style={{ fontSize: '12px', color: COLORS.muted, lineHeight: '1.5' }}>
                      {collab.role === 'Host'
                        ? `Você enviou o convite para ${collab.partner.name}. Eles precisam aceitar os termos para iniciar o compartilhamento de dados.`
                        : `${collab.partner.name} convidou você para esta colaboração. Aceite os termos para acessar os dados compartilhados.`}
                    </div>
                  </div>
                </div>
                {collab.role === 'Collaborator' && (
                  <button onClick={() => handleAcceptTC(collab.id)} disabled={acceptingTC} style={{
                    width: '100%', padding: '12px', backgroundColor: acceptingTC ? COLORS.muted : COLORS.success, color: '#fff',
                    border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: acceptingTC ? 'wait' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}>
                    {acceptingTC ? (<><div style={{ width: '14px', height: '14px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Processando...</>) : (<><Check size={16} /> Aceitar Termos e Ativar Colaboração</>)}
                  </button>
                )}
                {collab.role === 'Host' && (
                  <button onClick={() => { handleAcceptTC(collab.id); }} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Send size={16} /> Reenviar Convite
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        </Fragment>)}
      </div>
    </div>
  );
};

const UsuariosPage = ({ logActivity, onUserAlertsChange }) => {
  const [activeTab, setActiveTab] = useState('team');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleMenuOpen, setRoleMenuOpen] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Operador');
  const [inviteSent, setInviteSent] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [userStatuses, setUserStatuses] = useState({});
  const [permissionsOpen, setPermissionsOpen] = useState(null);
  const [permissionsRole, setPermissionsRole] = useState('');
  const [permissionsSaved, setPermissionsSaved] = useState(false);

  const ROLES = ['Admin', 'Operador', 'Auditor', 'Parceiro', 'Agência'];
  const PERMISSIONS = {
    Admin: { viewData: true, manageUsers: true, configIntegrations: true, approveCollabs: true, accessBilling: true, exportAudit: true },
    Operador: { viewData: true, manageUsers: false, configIntegrations: true, approveCollabs: false, accessBilling: false, exportAudit: false },
    Auditor: { viewData: true, manageUsers: false, configIntegrations: false, approveCollabs: false, accessBilling: false, exportAudit: true },
    Parceiro: { viewData: true, manageUsers: false, configIntegrations: false, approveCollabs: false, accessBilling: false, exportAudit: false },
    'Agência': { viewData: true, manageUsers: false, configIntegrations: true, approveCollabs: false, accessBilling: false, exportAudit: false },
  };
  const PERM_LABELS = { viewData: 'Visualizar Dados', manageUsers: 'Gerir Usuários', configIntegrations: 'Configurar Integrações', approveCollabs: 'Aprovar Colaborações', accessBilling: 'Acesso a Faturação', exportAudit: 'Exportar Auditoria' };

  // Report user access alerts to parent for Governança
  useEffect(() => {
    if (!onUserAlertsChange) return;
    const inactiveCount = MOCK_DATA.users.filter(u => {
      const st = userStatuses[u.id];
      if (st === 'removed') return false;
      return (st || u.status) === 'Inativo';
    }).length;
    onUserAlertsChange(inactiveCount);
  }, [userStatuses]);

  const filteredUsers = MOCK_DATA.users.filter(u => {
    const st = userStatuses[u.id];
    if (st === 'removed') return false;
    return !searchTerm || u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setInviteSent(true);
    if (logActivity) logActivity('Convite enviado', `${inviteEmail} (${inviteRole})`, { category: 'governance' });
    setTimeout(() => { setInviteSent(false); setShowInvite(false); setInviteEmail(''); }, 2000);
  };

  const handleUserAction = (userId, action) => {
    setUserMenuOpen(null);
    const user = MOCK_DATA.users.find(u => u.id === userId);
    if (action === 'deactivate') { setUserStatuses(p => ({ ...p, [userId]: 'Inativo' })); if (logActivity) logActivity('Usuário desativado', user?.name, { category: 'governance' }); }
    else if (action === 'activate') { setUserStatuses(p => ({ ...p, [userId]: 'Ativo' })); if (logActivity) logActivity('Usuário reativado', user?.name, { category: 'governance' }); }
    else if (action === 'remove') { setUserStatuses(p => ({ ...p, [userId]: 'removed' })); if (logActivity) logActivity('Usuário removido', user?.name, { category: 'governance' }); }
  };

  const tabs = ['profile', 'team'];
  const tabLabels = { profile: 'Editar Perfil', team: 'Equipa & Permissões' };
  const tabIcons = { profile: Cog, team: Users };

  const thStyle = { padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase' };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#000' }}>Usuários</h1>
        <div style={{ display: 'flex', borderBottom: `2px solid ${COLORS.border}`, margin: '20px 0 24px' }}>
          {tabs.map((tab) => {
            const TabIcon = tabIcons[tab];
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '600', color: activeTab === tab ? COLORS.primary : COLORS.muted, cursor: 'pointer', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? COLORS.primary : 'transparent'}`, marginBottom: '-2px', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TabIcon size={14} /> {tabLabels[tab]}
              </button>
            );
          })}
        </div>

        {activeTab === 'profile' && (
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '32px' }}>
            <div style={{ display: 'flex', gap: '40px' }}>
              {/* Profile Picture */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '160px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> Foto de Perfil</div>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: COLORS.lightGray, border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={40} color={COLORS.muted} />
                </div>
                <button style={{ padding: '6px 14px', fontSize: '11px', fontWeight: '500', backgroundColor: '#fff', color: '#000', border: `1px solid ${COLORS.border}`, borderRadius: '6px', cursor: 'pointer' }}>Upload Foto</button>
              </div>

              {/* Form */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#000', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}><Users size={14} /> Nome</label>
                  <input defaultValue="Jules Marques" style={{ width: '100%', padding: '10px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#000', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}><Send size={14} /> Email</label>
                  <input defaultValue="jules@revfy.io" disabled style={{ width: '100%', padding: '10px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', backgroundColor: COLORS.lightGray, color: COLORS.muted, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#000', marginBottom: '6px', display: 'block' }}>User ID</label>
                  <div style={{ padding: '10px 14px', backgroundColor: COLORS.lightGray, borderRadius: '8px', fontSize: '13px', color: COLORS.muted, fontFamily: 'monospace', border: `1px solid ${COLORS.border}` }}>USR-001 (Não editável)</div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#000', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}><Lock size={14} /> Alterar Senha</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="password" defaultValue="********" style={{ width: '100%', padding: '10px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} placeholder="Senha atual" />
                    <input type="password" style={{ width: '100%', padding: '10px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} placeholder="Nova senha" />
                    <input type="password" style={{ width: '100%', padding: '10px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} placeholder="Confirmar nova senha" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button onClick={() => { setProfileSaved(true); if (logActivity) logActivity('Perfil atualizado', 'User Profile', { category: 'general' }); setTimeout(() => setProfileSaved(false), 2000); }} style={{ padding: '10px 24px', backgroundColor: profileSaved ? COLORS.success : COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background-color 0.2s' }}>
                    {profileSaved ? <><Check size={14} /> Salvo</> : 'Guardar Alterações'}
                  </button>
                  <button style={{ padding: '10px 24px', backgroundColor: '#fff', color: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div>
            {/* Header with invite + search */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '16px' }}>
              <button onClick={() => setShowInvite(!showInvite)} style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '600', backgroundColor: '#fff', color: '#000', border: `1px solid ${COLORS.border}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserPlus size={14} /> Convidar Membro
              </button>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={14} color={COLORS.muted} style={{ position: 'absolute', left: '10px' }} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar membros" style={{ padding: '8px 12px 8px 30px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '12px', outline: 'none', width: '180px' }} />
              </div>
            </div>

            {/* Invite banner */}
            {showInvite && (
              <div style={{ padding: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.primary}30`, boxShadow: COLORS.shadow, marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>Convidar Novo Membro</div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', color: COLORS.muted, fontWeight: '600', display: 'block', marginBottom: '4px' }}>Email</label>
                    <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="email@empresa.com" style={{ width: '100%', padding: '8px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ width: '140px' }}>
                    <label style={{ fontSize: '11px', color: COLORS.muted, fontWeight: '600', display: 'block', marginBottom: '4px' }}>Role</label>
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#fff' }}>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <button onClick={handleInvite} disabled={inviteSent} style={{ padding: '8px 20px', backgroundColor: inviteSent ? COLORS.success : COLORS.primary, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                    {inviteSent ? <><Check size={14} /> Enviado</> : <><Send size={14} /> Enviar Convite</>}
                  </button>
                </div>
              </div>
            )}

            {/* Members table */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, overflow: 'visible' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                  <th style={thStyle}>Membro</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, width: '40px' }}></th>
                </tr></thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const st = userStatuses[user.id] || user.status;
                    return (
                      <tr key={user.id} style={{ borderBottom: `1px solid ${COLORS.border}` }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: COLORS.lightGray, border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Users size={14} color={COLORS.muted} />
                            </div>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>{user.name}</div>
                              <div style={{ fontSize: '11px', color: COLORS.muted }}>{user.lastAccess}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px', fontSize: '12px', fontWeight: '500' }}>{user.role}</td>
                        <td style={{ padding: '12px', fontSize: '12px', color: COLORS.muted }}>{user.email}</td>
                        <td style={{ padding: '12px' }}><Badge color={st === 'Ativo' ? 'green' : 'yellow'}>{st}</Badge></td>
                        <td style={{ padding: '12px', position: 'relative' }}>
                          <button onClick={() => setUserMenuOpen(userMenuOpen === user.id ? null : user.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex' }}>
                            <MoreVertical size={16} color={COLORS.muted} />
                          </button>
                          {userMenuOpen === user.id && (
                            <div style={{ position: 'absolute', right: '12px', top: '100%', backgroundColor: '#fff', borderRadius: '8px', border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 24px rgba(0,0,0,.12)', zIndex: 50, minWidth: '160px', overflow: 'hidden' }}>
                              <button onClick={() => { setPermissionsOpen(user.id); setPermissionsRole(user.role); setUserMenuOpen(null); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: '#000' }} onMouseEnter={e => e.target.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
                                <Shield size={14} color={COLORS.muted} /> Permissões
                              </button>
                              {st === 'Ativo' ? (
                                <button onClick={() => handleUserAction(user.id, 'deactivate')} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: '#000' }} onMouseEnter={e => e.target.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
                                  <Ban size={14} color={COLORS.muted} /> Desativar
                                </button>
                              ) : (
                                <button onClick={() => handleUserAction(user.id, 'activate')} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: COLORS.success }} onMouseEnter={e => e.target.style.backgroundColor = COLORS.lightGray} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
                                  <Play size={14} /> Reativar
                                </button>
                              )}
                              <button onClick={() => handleUserAction(user.id, 'remove')} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: COLORS.error }} onMouseEnter={e => e.target.style.backgroundColor = '#FEE2E2'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
                                <Trash2 size={14} /> Remover
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Role Permissions panel */}
            {permissionsOpen && (() => {
              const user = MOCK_DATA.users.find(u => u.id === permissionsOpen);
              const perms = PERMISSIONS[permissionsRole] || PERMISSIONS['Operador'];
              return (
                <div style={{ marginTop: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000', margin: 0 }}>Permissões — {user?.name}</h3>
                    <button onClick={() => { setPermissionsOpen(null); setPermissionsSaved(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: COLORS.muted, padding: '4px' }}>x</button>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '11px', color: COLORS.muted, fontWeight: '600', display: 'block', marginBottom: '4px' }}>Role</label>
                    <select value={permissionsRole} onChange={e => { setPermissionsRole(e.target.value); setPermissionsSaved(false); }} style={{ padding: '8px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#fff', minWidth: '160px' }}>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    {Object.entries(PERM_LABELS).map(([key, label]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#000' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '3px', border: `1px solid ${perms[key] ? COLORS.primary : COLORS.border}`, backgroundColor: perms[key] ? COLORS.primary : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {perms[key] && <Check size={10} color="#fff" />}
                        </div>
                        {label}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setPermissionsSaved(true); if (logActivity) logActivity('Permissões atualizadas', `${user?.name} → ${permissionsRole}`, { category: 'governance' }); setTimeout(() => setPermissionsSaved(false), 2000); }} style={{ padding: '8px 20px', backgroundColor: permissionsSaved ? COLORS.success : COLORS.primary, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background-color 0.2s' }}>
                    {permissionsSaved ? <><Check size={14} /> Salvo</> : 'Guardar Permissões'}
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

const AjudaPage = ({ logActivity }) => {
  const [supportSent, setSupportSent] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const faqSections = [
    { title: 'Data Sync & Connections', items: [
      { q: 'Quais fontes de dados posso conectar?', a: 'O Revfy Trust Hub suporta data warehouses (Revfy Warehouse, BigQuery, Redshift, PostgreSQL), CRMs (Salesforce, HubSpot), plataformas de mídia paga (Meta Ads, Google Ads, TikTok) via ingest reverso, além de uploads manuais (CSV/SFTP) e APIs REST/Webhooks.' },
      { q: 'Como funciona a sincronização de dados?', a: 'Cada source pode ser configurada com frequência de sync: tempo real, horária, diária ou manual. Para warehouses, utilizamos queries otimizadas com CDC (Change Data Capture) via Streams para sincronizar apenas dados alterados, minimizando custo e latência.' },
      { q: 'O que são Dataset Groups?', a: 'Dataset Groups definem universos de tabelas conectadas via joins. Cada grupo tem uma tabela primária que determina a granularidade (ex: 1 cliente, 1 household). Tabelas adicionais são vinculadas via chaves de join com cardinalidade definida (one-to-one, many-to-one).' },
      { q: 'Como funciona o schema mapping?', a: 'Ao conectar uma fonte, você seleciona tabelas, define chaves únicas e configura campos individuais — incluindo alias, tipo de dado, classificação PII e exclusão de personalização. Campos PII são automaticamente mascarados em visualizações.' },
    ]},
    { title: 'Audiências', items: [
      { q: 'Como crio uma audiência?', a: 'Use o Audience Builder visual: selecione um dataset, adicione filtros por campo (geográfico, demográfico, comportamental, modelo), combine com lógica AND/OR e exclua audiências existentes. O tamanho estimado atualiza em tempo real conforme você ajusta os filtros.' },
      { q: 'Posso exportar audiências para múltiplos destinos?', a: 'Sim. Na página Destinos, cada destination pode receber múltiplas audiências simultaneamente. Ao configurar um destino, você seleciona quais audiências sincronizar, o modo de sync (Upsert, Mirror, Add/Remove) e os campos de matching e personalização.' },
      { q: 'O que são Breakdowns?', a: 'Breakdowns são relatórios granulares que decompõem uma audiência por campos do seu data warehouse — ex: distribuição por região, faixa etária ou score de engajamento. Útil para entender a composição antes de ativar.' },
    ]},
    { title: 'Destinos & Ativação', items: [
      { q: 'Quais plataformas de destino são suportadas?', a: 'Meta/Facebook Ads, Google Ads, TikTok Ads, X (Twitter), Microsoft Ads, Snapchat, Braze, Sailthru, Salesforce Marketing Cloud, Display & Video 360, LiveRamp e Conversica. Novos destinos podem ser adicionados via API.' },
      { q: 'O que são Match Fields?', a: 'Match Fields são os identificadores usados para reconciliar registros do seu warehouse com a plataforma de destino — ex: email_hash, phone_hash, device_id. Campos são hasheados (SHA-256) antes do envio para garantir privacidade.' },
      { q: 'O que são Personalization Fields?', a: 'Atributos adicionais do warehouse enviados como metadados à plataforma de destino — ex: nome, cidade, score de engajamento. Permitem personalização de anúncios e mensagens sem expor dados sensíveis.' },
      { q: 'Posso conectar mais de um Business Manager (Meta Ads, Google Ads, etc)?', rich: true, a: () => (
        <div>
          <div style={{ padding: '12px 16px', backgroundColor: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0', marginBottom: '14px', fontSize: '13px', color: '#065F46', fontWeight: '600' }}>Sim — o Revfy suporta múltiplas contas e Business Managers por plataforma.</div>
          <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.65', margin: '0 0 12px' }}>Você pode conectar, por exemplo, 3 Ad Accounts do Meta e 2 Customer IDs do Google Ads simultaneamente — cada um com suas próprias credenciais e permissões.</p>
          <div style={{ fontSize: '13px', color: '#444', lineHeight: '1.65', marginBottom: '12px' }}>Isso é ideal para empresas que gerenciam:</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
            {[{ icon: '🏢', label: 'Multi-marca', desc: 'Marcas diferentes sob o mesmo grupo' }, { icon: '🌎', label: 'Multi-região', desc: 'Contas separadas por país ou mercado' }, { icon: '📊', label: 'Multi-BU', desc: 'Unidades de negócio independentes' }].map((c, i) => (
              <div key={i} style={{ padding: '10px 12px', backgroundColor: COLORS.lightGray, borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{c.icon}</div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#000' }}>{c.label}</div>
                <div style={{ fontSize: '11px', color: COLORS.muted }}>{c.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.65', margin: '0 0 12px' }}>Cada conexão funciona como um canal independente: métricas de feedback (via Openflow) e ativação de audiências são rastreadas individualmente por conta.</p>
          <div style={{ padding: '10px 14px', backgroundColor: COLORS.bgBlue, borderRadius: '8px', fontSize: '12px', color: COLORS.primary }}>
            <strong>Como adicionar:</strong> Data Sync → Data Media Channels ou Destinos → crie uma nova conexão com o Ad Account ID ou Customer ID da conta adicional.
          </div>
        </div>
      )},
      { q: 'Como consigo o ID das contas nos Business Managers para conectar com o Revfy?', rich: true, a: () => (
        <div>
          <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.65', margin: '0 0 14px' }}>Cada plataforma tem seu próprio formato e local para encontrar o ID da conta:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
            {[
              { platform: 'Meta / Facebook Ads', color: '#1877F2', icon: 'f', format: 'act_XXXXXXXXX', steps: ['Acesse business.facebook.com', 'Configurações do Negócio → Contas → Contas de Anúncio', 'O ID aparece ao lado do nome de cada conta'], alt: 'Também visível na URL do Ads Manager após "?act=" ou no dropdown de contas no topo esquerdo.' },
              { platform: 'Google Ads', color: '#4285F4', icon: 'g', format: 'XXX-XXX-XXXX (10 dígitos)', steps: ['Abra ads.google.com', 'Olhe no canto superior esquerdo, abaixo do nome da conta', 'Para MCC: menu lateral → Contas → tabela com todos os Customer IDs'], alt: '' },
              { platform: 'TikTok Ads', color: '#000', icon: 'tt', format: 'Número do Advertiser ID', steps: ['Abra TikTok Ads Manager', 'Configurações → Informações da Conta', 'O Advertiser ID aparece logo abaixo do nome'], alt: '' },
              { platform: 'Google DV360', color: '#4285F4', icon: 'dv', format: 'Partner ID numérico', steps: ['Faça login na plataforma DV360', 'O Partner ID aparece na URL após "/p/"'], alt: '' },
            ].map((p, i) => (
              <div key={i} style={{ padding: '14px 16px', backgroundColor: COLORS.lightGray, borderRadius: '10px', border: `1px solid ${COLORS.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: p.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: p.icon.length > 2 ? '10px' : '14px', fontWeight: '700', color: p.color }}>{p.icon}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#000' }}>{p.platform}</div>
                    <div style={{ fontSize: '11px', color: COLORS.muted, fontFamily: 'monospace' }}>Formato: {p.format}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '42px' }}>
                  {p.steps.map((s, si) => (
                    <div key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#444', lineHeight: '1.5' }}>
                      <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: p.color + '15', color: p.color, fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{si + 1}</span>
                      <span>{s}</span>
                    </div>
                  ))}
                  {p.alt && <div style={{ fontSize: '11px', color: COLORS.muted, paddingLeft: '26px', marginTop: '4px', fontStyle: 'italic' }}>{p.alt}</div>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px 14px', backgroundColor: '#FFF7ED', borderRadius: '8px', border: '1px solid #FED7AA', fontSize: '12px', color: '#9A3412' }}>
            <strong>Dica:</strong> Se você não tem acesso direto, peça ao administrador da conta para compartilhar o ID. Ele não é um dado sensível — é apenas um identificador numérico.
          </div>
        </div>
      )},
    ]},
    { title: 'RevFy IQ (AI/ML)', items: [
      { q: 'Quais modelos de IA estão disponíveis?', a: 'O RevFy IQ integra com Revfy Cortex para oferecer: análise de sentimento (SENTIMENT), classificação de clientes (AI_CLASSIFY), previsão de conversão (FORECAST), embeddings para lookalike audiences (AI_EMBED), e tradução automática (TRANSLATE).' },
      { q: 'Como funciona o AI Decisioning?', a: 'Agentes de reinforcement learning otimizam automaticamente a alocação de audiências entre canais e campanhas, maximizando conversão dentro de restrições de budget e compliance definidas por você.' },
      { q: 'Posso treinar modelos customizados?', a: 'Sim. Via fine-tuning supervisionado no Revfy Cortex, você pode criar modelos específicos para seu domínio usando dados do seu warehouse. Modelos são versionados e monitorados com métricas de accuracy em produção.' },
    ]},
    { title: 'Governança & Compliance', items: [
      { q: 'Quais certificações de segurança o Revfy possui?', a: 'O Revfy Trust Hub opera sob SOC 2 Type II, com suporte a LGPD, GDPR e políticas de data residency. Dados PII são criptografados em repouso e em trânsito, com masking automático baseado em roles.' },
      { q: 'Como funciona o controle de acesso?', a: 'Controle granular baseado em RBAC (Role-Based Access Control): Admin, Operador, Analista, Parceiro (somente leitura). Cada role tem permissões específicas sobre quais datasets, audiências e destinos pode acessar.' },
      { q: 'O que é User Consent enforcement?', a: 'Ao configurar destinos, você pode ativar consent enforcement — o sistema automaticamente respeita opt-outs e preferências de privacidade do usuário, removendo registros não-consentidos antes da sincronização.' },
    ]},
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#000', margin: 0 }}>Central de Ajuda</h1>
        </div>
        <p style={{ fontSize: '13px', color: COLORS.muted, margin: '8px 0 24px' }}>Perguntas frequentes sobre a plataforma Revfy Trust Hub.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {faqSections.map((section, si) => (
            <div key={si}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '12px', paddingBottom: '8px', borderBottom: `2px solid ${COLORS.primary}20` }}>{section.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {section.items.map((item, ii) => {
                  const key = `${si}-${ii}`;
                  const isOpen = expandedFaq === key;
                  return (
                    <div key={key} style={{ backgroundColor: COLORS.cardBg, borderRadius: '10px', border: `1px solid ${isOpen ? COLORS.primary + '30' : COLORS.border}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                      <button onClick={() => setExpandedFaq(isOpen ? null : key)} style={{
                        width: '100%', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: isOpen ? COLORS.primary : '#000' }}>{item.q}</span>
                        <ChevronDown size={16} color={COLORS.muted} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }} />
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 18px 16px', fontSize: '13px', color: '#444', lineHeight: '1.65' }}>{item.rich ? item.a() : item.a}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact support */}
        <div style={{ marginTop: '32px', padding: '20px 24px', backgroundColor: COLORS.bgBlue, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>Não encontrou o que procura?</div>
            <div style={{ fontSize: '13px', color: COLORS.muted }}>Entre em contato com o time de suporte Revfy.</div>
          </div>
          <button onClick={() => { setSupportSent(true); if (logActivity) logActivity('Solicitação de suporte enviada', 'Support Request', { category: 'general' }); setTimeout(() => setSupportSent(false), 3000); }} style={{ padding: '10px 24px', backgroundColor: supportSent ? '#10B981' : COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}>{supportSent ? '✓ Solicitação Enviada!' : 'Falar com Suporte'}</button>
        </div>
      </div>
    </div>
  );
};

export default function RevfyTrustHubDemo() {
  const [currentPage, setCurrentPage] = useState('overview');

  // Lifted state from DataSyncPage
  const [sourceStates, setSourceStates] = useState({});
  const [deletedSources, setDeletedSources] = useState({});
  const [loadingSources, setLoadingSources] = useState({});
  const [dynamicSources, setDynamicSources] = useState([]);
  const [nextId, setNextId] = useState(100);

  // ── Collaboration summary (lifted from ColaboracaoPage) ──
  const [collabSummary, setCollabSummary] = useState({ active: 3, paused: 0, deactivated: 0, total: 3, participants: 3, queries: 1247 });
  const updateCollabSummary = useCallback((summary) => setCollabSummary(summary), []);

  // ── User access alerts (lifted from UsuariosPage) ──
  const [userAccessAlerts, setUserAccessAlerts] = useState(() => {
    return MOCK_DATA.users.filter(u => u.status === 'Inativo').length;
  });
  const updateUserAlerts = useCallback((count) => setUserAccessAlerts(count), []);

  // ── Centralized Activity Log ──
  const [activityLog, setActivityLog] = useState(() => {
    const now = new Date(2026, 2, 25, 14, 32);
    const seed = [
      { ts: new Date(now - 0),        user: 'Jules Marques', action: 'Acessou Overview',              detail: 'Sessão iniciada',              status: 'Sucesso', category: 'navigation' },
      { ts: new Date(now - 2*3600000), user: 'Jules Marques', action: 'Audiência ativada',             detail: 'Segmento SP 25-44 → Meta',    status: 'Sucesso', category: 'audience' },
      { ts: new Date(now - 4*3600000), user: 'Sistema',       action: 'Dataset sincronizado',          detail: 'Revfy DCR (3.1M registros)', status: 'Sucesso', category: 'sync' },
      { ts: new Date(now - 6*3600000), user: 'Ana Costa',     action: 'Novo usuário adicionado',       detail: 'Perfil: Parceiro',             status: 'Sucesso', category: 'user' },
      { ts: new Date(now - 8*3600000), user: 'Maria Silva',   action: 'Alterou policy de masking',     detail: 'CPF → Document Mask',          status: 'Sucesso', category: 'governance' },
      { ts: new Date(now - 12*3600000),user: 'Carlos Gomes',  action: 'Auditoria de conformidade',     detail: 'LGPD checklist completo',      status: 'Sucesso', category: 'governance' },
      { ts: new Date(now - 18*3600000),user: 'Ana Costa',     action: 'Adicionou participante ao DCR', detail: 'Parceiro externo',             status: 'Aviso',   category: 'governance' },
      { ts: new Date(now - 24*3600000),user: 'Jules Marques', action: 'Sincronizou dados com Revfy Warehouse', detail: 'Full refresh',               status: 'Sucesso', category: 'sync' },
      { ts: new Date(now - 30*3600000),user: 'Jules Marques', action: 'Relatório compliance exportado', detail: 'Governança Q1 2026',          status: 'Sucesso', category: 'governance' },
      { ts: new Date(now - 48*3600000),user: 'Maria Silva',   action: 'Destino configurado',           detail: 'Meta Ads → Campanha SP',       status: 'Sucesso', category: 'destination' },
      { ts: new Date(now - 72*3600000),user: 'Jules Marques', action: 'Nova source conectada',          detail: 'GA4 Web Analytics',            status: 'Sucesso', category: 'source' },
    ];
    return seed;
  });

  const logActivity = useCallback((action, detail, opts = {}) => {
    setActivityLog(prev => [{
      ts: new Date(),
      user: opts.user || 'Jules Marques',
      action,
      detail: detail || '',
      status: opts.status || 'Sucesso',
      category: opts.category || 'general',
    }, ...prev].slice(0, 50));
  }, []);

  // Track page navigation
  const handleNavigate = useCallback((page) => {
    const pageNames = { overview: 'Overview', datasync: 'Data Sync', audiencias: 'Audiências', destinos: 'Destinos', revfyiq: 'RevFy IQ', governanca: 'Governança', faturamento: 'Faturamento', coligados: 'Parceiros', usuarios: 'Usuários', ajuda: 'Ajuda' };
    if (page !== currentPage) {
      logActivity(`Acessou ${pageNames[page] || page}`, `Navegação`, { category: 'navigation' });
    }
    setCurrentPage(page);
  }, [currentPage, logActivity]);

  // Data computation engine
  const platformData = useMemo(() => {
    const allSources = [...MOCK_DATA.sources, ...dynamicSources];
    const visibleSources = allSources.filter(s => !deletedSources[s.id]);

    const getSourceStatus = (source) => {
      if (source.native) return source;
      if (loadingSources[source.id]) return { ...source, status: 'Conectando...', extra: '', lastSync: '—' };
      const overrideStatus = sourceStates[source.id];
      if (overrideStatus === 'Ativo') return { ...source, status: 'Ativo', extra: source.connectedExtra, lastSync: source.connectedSync };
      if (overrideStatus === 'Pausado') return { ...source, status: 'Pausado', extra: source.connectedExtra, lastSync: source.connectedSync };
      if (overrideStatus === 'Desconectado') return { ...source, status: 'Desconectado', extra: '', lastSync: '—' };
      return source;
    };

    const activeSourceNames = visibleSources.filter(s => {
      const resolved = getSourceStatus(s);
      return resolved.status === 'Ativo' || resolved.status === 'Conectado' || resolved.status === 'Nativo';
    }).map(s => s.name);

    // Dynamic datasets from connected sources
    const dynamicDatasets = dynamicSources.filter(s => !deletedSources[s.id] && (sourceStates[s.id] === 'Ativo' || sourceStates[s.id] === 'Conectado')).flatMap(s => {
      return generateSourceDatasets(s.name);
    });

    const allDatasets = [...MOCK_DATA.datasets, ...dynamicDatasets];

    // Dynamic logs from connected sources
    const dynamicLogs = dynamicSources.filter(s => !deletedSources[s.id] && (sourceStates[s.id] === 'Ativo' || sourceStates[s.id] === 'Conectado')).map(s => {
      const connData = SOURCE_CONNECTED_DATA[s.name];
      return connData ? connData.log : null;
    }).filter(Boolean);

    const allLogs = [...INGESTION_LOG, ...dynamicLogs];

    // Compute total records from active sources
    const parseRecordCount = (extraStr) => {
      const match = extraStr.match(/([\d.,]+)\s*(M|K)?\s*registros/i);
      if (!match) return 0;
      let num = parseFloat(match[1].replace(',', '.'));
      if (match[2] === 'M') num *= 1000000;
      else if (match[2] === 'K') num *= 1000;
      else num = parseInt(extraStr.split(' ')[0].replace(/[.,]/g, '')) || 0;
      return Math.round(num);
    };
    const totalRecords = activeSourceNames.reduce((sum, name) => {
      if (name === 'Upload CSV') return sum + 45231;
      if (name === 'Revfy Pixel') return sum + 3100000;
      const connData = SOURCE_CONNECTED_DATA[name];
      if (connData) return sum + parseRecordCount(connData.extra);
      return sum;
    }, 0);

    // Compute KPIs dynamically
    const syncingAuds = MOCK_DATA.syncs.filter(s => s.status === 'Sucesso' || s.status === 'Aviso');
    const uniqueSyncAuds = [...new Set(syncingAuds.map(s => s.audiencia))];
    const allDests = MOCK_DATA.destinations;
    const openflowDests = allDests.filter(d => d.feedbackType === 'full_loop');
    const totalSyncRecords = MOCK_DATA.syncs.reduce((sum, s) => sum + s.records, 0);
    const billingData = MOCK_DATA.billing;
    const monthCredits = billingData.currentMonth.usedCredits;
    const fmtMonthCredits = monthCredits >= 1000 ? `${(monthCredits/1000).toFixed(1)}K` : String(monthCredits);
    const ytdPct = ((billingData.ytdUsedCredits / billingData.contract.totalCredits) * 100).toFixed(0);
    const feedbackCoverage = Math.round((openflowDests.length / allDests.length) * 100);

    const kpis = MOCK_DATA.kpis.map(kpi => {
      if (kpi.label === 'Registros Ativados') {
        return { ...kpi, value: totalSyncRecords.toLocaleString(), change: `+${Math.round(totalSyncRecords * 0.08).toLocaleString()}` };
      }
      if (kpi.label === 'Audiências em Sync') {
        return { ...kpi, value: String(uniqueSyncAuds.length), change: `de ${MOCK_DATA.audiences.length} total` };
      }
      if (kpi.label === 'Créditos Consumidos') {
        return { ...kpi, value: fmtMonthCredits, change: `${ytdPct}% do contrato YTD` };
      }
      if (kpi.label === 'Feedback Coverage') {
        return { ...kpi, value: `${feedbackCoverage}%`, change: `${openflowDests.length} de ${allDests.length} canais` };
      }
      return kpi;
    });

    return {
      kpis,
      visibleSources,
      getSourceStatus,
      activeSourceNames,
      allDatasets,
      allLogs,
    };
  }, [sourceStates, deletedSources, loadingSources, dynamicSources]);

  // Source action handlers
  const sourceActions = useMemo(() => ({
    handleSourceAction: (source, action) => {
      const actionLabels = { activate: 'Source ativada', pause: 'Source pausada', disconnect: 'Source desconectada', delete: 'Source removida' };
      switch (action) {
        case 'activate': setSourceStates(prev => ({ ...prev, [source.id]: 'Ativo' })); break;
        case 'pause': setSourceStates(prev => ({ ...prev, [source.id]: 'Pausado' })); break;
        case 'disconnect': setSourceStates(prev => ({ ...prev, [source.id]: 'Desconectado' })); break;
        case 'delete': setDeletedSources(prev => ({ ...prev, [source.id]: true })); break;
        default: break;
      }
      if (actionLabels[action]) logActivity(actionLabels[action], source.name, { category: 'source' });
    },
    handleSaveAndClose: (selectedSource) => {
      const matchedMock = MOCK_DATA.sources.find(s => s.name === selectedSource.name);
      if (matchedMock) {
        setLoadingSources(prev => ({ ...prev, [matchedMock.id]: true }));
        setTimeout(() => {
          setLoadingSources(prev => { const n = { ...prev }; delete n[matchedMock.id]; return n; });
          setSourceStates(prev => ({ ...prev, [matchedMock.id]: 'Ativo' }));
        }, 3500);
      } else {
        const connData = SOURCE_CONNECTED_DATA[selectedSource.name];
        const newId = nextId;
        setNextId(prev => prev + 1);
        const newSource = {
          id: newId,
          name: selectedSource.name,
          type: connData ? connData.type : selectedSource.category,
          status: 'Conectando...',
          extra: '',
          lastSync: '—',
          color: connData ? connData.color : COLORS.cardBg,
          connectedExtra: connData ? connData.extra : '—',
          connectedSync: connData ? connData.lastSync : 'Agora',
        };
        setDynamicSources(prev => [...prev, newSource]);
        setLoadingSources(prev => ({ ...prev, [newId]: true }));
        setTimeout(() => {
          setLoadingSources(prev => { const n = { ...prev }; delete n[newId]; return n; });
          setSourceStates(prev => ({ ...prev, [newId]: 'Ativo' }));
        }, 3500);
      }
    },
    handleUploadCSV: () => {
      setSourceStates(prev => ({ ...prev, 4: 'Ativo' }));
      logActivity('Upload CSV importado', 'Arquivo manual', { category: 'source' });
    }
  }), [nextId, logActivity]);

  const sourceState = useMemo(() => ({
    visibleSources: platformData.visibleSources,
    getSourceStatus: platformData.getSourceStatus,
    activeSourceNames: platformData.activeSourceNames,
  }), [platformData]);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview': return <OverviewPage platformData={platformData} activityLog={activityLog} logActivity={logActivity} />;
      case 'datasync': return <DataSyncPage sourceState={sourceState} sourceActions={sourceActions} platformData={platformData} logActivity={logActivity} />;
      case 'audiencias': return <AudienciasPage platformData={platformData} logActivity={logActivity} />;
      case 'destinos': return <DestinosPage logActivity={logActivity} />;
      case 'revfyiq': return <RevFyIQPage logActivity={logActivity} />;
      case 'governanca': return <GovernancaPage activityLog={activityLog} onNavigate={handleNavigate} collabSummary={collabSummary} userAccessAlerts={userAccessAlerts} />;
      case 'faturamento': return <FaturamentoPage logActivity={logActivity} />;
      case 'coligados': return <ColaboracaoPage logActivity={logActivity} onCollabSummaryChange={updateCollabSummary} />;
      case 'usuarios': return <UsuariosPage logActivity={logActivity} onUserAlertsChange={updateUserAlerts} />;
      case 'ajuda': return <AjudaPage logActivity={logActivity} />;
      default: return <OverviewPage platformData={platformData} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: COLORS.pageBg, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#000' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeInDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} alerts={{ governanca: (userAccessAlerts > 0 ? 1 : 0) + ((collabSummary.paused || 0) + (collabSummary.deactivated || 0) > 0 ? 1 : 0) }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: COLORS.pageBg }}>
        {renderPage()}
      </div>
    </div>
  );
}
