import { useState, useMemo, useCallback } from 'react';
import { Home, Database, Table2, Users, Send, RefreshCw, Brain, Shield, DollarSign, Building2, Plug, UserCog, Calendar, Plus, Trash2, MoreVertical, Check, AlertCircle, Snowflake, Link2, Cloud, FileSpreadsheet, Cog, Radio, TrendingUp, Zap, UserPlus, FileText, ShieldCheck, Wrench, ClipboardList, Megaphone, Ban, Search, Archive, BarChart3, Pause, Play, CircleDot, Upload, FolderSync, Webhook, ChevronRight, Activity, Target, Eye, FileDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      { id: 'sincronizacoes', label: 'Sincronizações', icon: RefreshCw },
      { id: 'revfyiq', label: 'RevFy IQ', icon: Brain },
    ]
  },
  {
    section: 'Trust Hub',
    items: [
      { id: 'governanca', label: 'Governança', icon: Shield },
      { id: 'investimento', label: 'Investimento', icon: DollarSign },
      { id: 'coligados', label: 'Parceiros', icon: Building2 },
    ]
  },
  {
    section: 'Configuração',
    items: [
      { id: 'integracoes', label: 'Integrações', icon: Plug },
      { id: 'usuarios', label: 'Usuários', icon: UserCog },
      { id: 'calendario', label: 'Calendário', icon: Calendar },
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
      'Snowflake': ['sf_customers', 'sf_events', 'sf_transactions', 'sf_segments'],
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
      'Snowflake': [1203847, 923456, 847293, 1456789],
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
    { label: 'Registros no DCR', value: '0', change: '+0', icon: 'database', computed: true },
    { label: 'Audiências Ativas', value: '12', change: '+3', icon: 'users' },
    { label: 'Canais Conectados', value: '4/4', change: '100%', icon: 'link' },
    { label: 'Score Compliance', value: '94%', change: '+2.1%', icon: 'shield' },
    { label: 'Investimento', value: 'R$ 4.8M', change: 'de R$ 16.5M', icon: 'dollar' },
    { label: 'Match Rate Médio', value: '79.8%', change: '+3.2%', icon: 'trending' },
  ],
  sources: [
    { id: 4, name: 'Upload CSV', type: 'Arquivo (Manual)', status: 'Ativo', extra: '3 arquivos • 45K registros', lastSync: '15min atrás', color: '#FFF8E8', connectedExtra: '3 arquivos • 45K registros', connectedSync: '15min atrás', autoRefresh: true },
    { id: 6, name: 'Revfy Pixel', type: 'Native First-Party', status: 'Nativo', extra: '3.1M eventos', lastSync: 'Tempo real', color: '#E8F0FF', native: true },
  ],
  destinations: [
    { id: 1, name: 'Meta', type: 'Custom Audiences + CAPI', icon: 'f', match: '87%', status: 'Conectado' },
    { id: 2, name: 'Google Ads', type: 'Customer Match', icon: 'g', match: '82%', status: 'Conectado' },
    { id: 3, name: 'TikTok', type: 'Audiences API', icon: 'tt', match: '79%', status: 'Conectado' },
    { id: 4, name: 'X (Twitter)', type: 'Custom Audiences', icon: 'x', match: '71%', status: 'Conectado' },
  ],
  audiences: [
    { id: 1, name: 'Segmento SP 25-44', size: 847293, status: 'Ativo', created: '2026-03-10' },
    { id: 2, name: 'Lookalike Sudeste', size: 1567890, status: 'Ativo', created: '2026-03-08' },
    { id: 3, name: 'Alto Valor - Classe A/B', size: 234567, status: 'Teste', created: '2026-03-15' },
    { id: 4, name: 'Base Inativa 90d', size: 123456, status: 'Rascunho', created: '2026-03-20' },
  ],
  datasets: [
    { nome: 'Upload Março', fonte: 'CSV', tipo: 'Arquivo', registros: '45,231', atualizacao: 'Manual', qualidade: '91%', status: 'Revisão' },
    { nome: 'revfy_events', fonte: 'Revfy Pixel', tipo: 'Native', registros: '3,100,000', atualizacao: 'Tempo real', qualidade: '99%', status: 'Ativo' },
    { nome: 'Audiência Indecisos', fonte: 'Blended', tipo: 'Modelo', registros: '2,341,567', atualizacao: 'Horária', qualidade: '96%', status: 'Ativo' },
    { nome: 'Lookalike Sudeste', fonte: 'RevFy IQ', tipo: 'ML', registros: '1,567,890', atualizacao: 'Diária', qualidade: '94%', status: 'Ativo' },
  ],
  syncs: [
    { id: 1, audiencia: 'Segmento SP 25-44', destino: 'Meta', modo: 'Upsert', records: 847293, frequencia: 'Diária', lastRun: 'Há 2h', status: 'Sucesso' },
    { id: 2, audiencia: 'Lookalike Sudeste', destino: 'Google Ads', modo: 'Mirror', records: 1567890, frequencia: 'A cada 6h', lastRun: 'Há 30min', status: 'Sucesso' },
    { id: 3, audiencia: 'Alto Valor - Classe A/B', destino: 'TikTok', modo: 'Upsert', records: 234567, frequencia: 'Horária', lastRun: 'Há 12min', status: 'Sucesso' },
    { id: 4, audiencia: 'Base Inativa 90d', destino: 'X', modo: 'Upsert', records: 123456, frequencia: 'Diária', lastRun: 'Há 4h', status: 'Aviso' },
    { id: 5, audiencia: 'Segmento SP 25-44', destino: 'TikTok', modo: 'Upsert', records: 847293, frequencia: 'A cada 12h', lastRun: 'Há 6h', status: 'Sucesso' },
  ],
  users: [
    { id: 1, name: 'Jules Marques', email: 'jules@revfy.io', role: 'Admin', lastAccess: 'Agora', status: 'Ativo' },
    { id: 2, name: 'Maria Silva', email: 'maria@cliente.com', role: 'Operador', lastAccess: '2h atrás', status: 'Ativo' },
    { id: 3, name: 'Carlos Gomes', email: 'carlos@compliance.com', role: 'Auditor', lastAccess: '1d atrás', status: 'Ativo' },
    { id: 4, name: 'Ana Costa', email: 'ana@parceiro.com', role: 'Parceiro', lastAccess: '3h atrás', status: 'Ativo' },
    { id: 5, name: 'Pedro Agência', email: 'pedro@agencia.com', role: 'Agência', lastAccess: '5d atrás', status: 'Inativo' },
  ],
  compliance: [
    { req: 'Art. 9º-I — Inversão ônus da prova', status: 'Completo', detail: 'logs imutáveis ativos' },
    { req: 'Art. 125-B — Plano de conformidade', status: 'Completo', detail: 'documento gerado' },
    { req: 'LGPD — Consentimento e anonimização', status: 'Completo', detail: 'DCR ativo' },
    { req: 'Blackout IA — Monitoramento 72h', status: 'Completo', detail: 'configurado' },
    { req: 'Viewability — Blacklist de sites', status: 'Aviso', detail: '2 pendentes' },
    { req: 'Registro SHA-256 — Hash de cada operação', status: 'Completo', detail: '100%' },
  ],
  calendar: [
    { date: 'Mar-Mai', phase: 'Setup & Integração', status: 'current', icon: 'wrench' },
    { date: 'Jun', phase: 'Onboard base de dados', status: 'upcoming', icon: 'clipboard' },
    { date: 'Jul', phase: 'Ativação de audiências', status: 'upcoming', icon: 'megaphone' },
    { date: 'Ago', phase: 'Início de campanhas pagas', status: 'upcoming', icon: 'zap' },
    { date: 'Set', phase: 'Blackout IA (compliance)', status: 'upcoming', icon: 'ban' },
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
  };
  return iconMap[name] || null;
};

const getSourceIcon = (name) => {
  const iconMap = {
    'Snowflake': { icon: Snowflake, bg: '#E8F4FF' },
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
    <div style={{ fontSize: '28px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>{value}</div>
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

const Sidebar = ({ currentPage, onNavigate }) => (
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
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)} style={{ width: 'calc(100% - 20px)', margin: '0 10px', padding: '8px 10px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: currentPage === item.id ? '600' : '400', color: currentPage === item.id ? COLORS.primary : '#000', backgroundColor: currentPage === item.id ? COLORS.bgBlue : 'transparent', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { if (currentPage !== item.id) e.currentTarget.style.backgroundColor = COLORS.lightGray; }}
                onMouseLeave={(e) => { if (currentPage !== item.id) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <IconComponent size={16} />
                {item.label}
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
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#000', margin: 0 }}>{title}</h2>
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
  { name: 'Snowflake', category: 'ETL', auth: 'credentials', fields: ['Account URL', 'Warehouse', 'Database', 'Schema', 'Username', 'Password'] },
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
  'Snowflake': { type: 'Data Warehouse', extra: '1,203,847 registros • 4 tabelas', lastSync: '2min atrás', color: '#E8F4FF', log: { source: 'Snowflake', records: '1,203,847', duration: '2m 14s', time: '25/03 14:32', status: 'Sucesso' } },
  'BigQuery': { type: 'Data Warehouse (GCP)', extra: '2.4M registros • 6 tabelas', lastSync: '5min atrás', color: '#EEF1FF', log: { source: 'BigQuery', records: '2,400,000', duration: '3m 05s', time: '25/03 13:10', status: 'Sucesso' } },
  'HubSpot': { type: 'CRM (OAuth)', extra: '1,200,532 contatos • 3 objetos', lastSync: '3min atrás', color: '#FFF3E8', log: { source: 'HubSpot', records: '1,200,532', duration: '3m 42s', time: '25/03 12:15', status: 'Sucesso' } },
  'Salesforce': { type: 'CRM (OAuth)', extra: '845,231 leads • 2 objetos', lastSync: '10min atrás', color: '#E8F0FF', log: { source: 'Salesforce', records: '845,231', duration: '4m 08s', time: '25/03 10:00', status: 'Sucesso' } },
  'Redshift': { type: 'Data Warehouse', extra: '980K registros • 3 tabelas', lastSync: '8min atrás', color: '#FFE8E8', log: { source: 'Redshift', records: '980,000', duration: '1m 55s', time: '25/03 11:45', status: 'Sucesso' } },
  'PostgreSQL': { type: 'Database', extra: '520K registros • 5 tabelas', lastSync: '6min atrás', color: '#E8F8FF', log: { source: 'PostgreSQL', records: '520,000', duration: '1m 12s', time: '25/03 09:30', status: 'Sucesso' } },
  'MySQL': { type: 'Database', extra: '310K registros • 4 tabelas', lastSync: '12min atrás', color: '#FFF8E8', log: { source: 'MySQL', records: '310,000', duration: '0m 48s', time: '25/03 08:00', status: 'Sucesso' } },
  'Google Sheets': { type: 'Planilha (OAuth)', extra: '15K registros • 2 sheets', lastSync: '1min atrás', color: '#E8FFE8', log: { source: 'Google Sheets', records: '15,000', duration: '0m 05s', time: '25/03 14:00', status: 'Sucesso' } },
  'API REST': { type: 'API Endpoint', extra: '312K registros', lastSync: '4min atrás', color: '#F0E8FF', log: { source: 'API REST', records: '312,104', duration: '1m 22s', time: '25/03 14:32', status: 'Sucesso' } },
  'Webhook': { type: 'Webhook Endpoint', extra: '89K eventos', lastSync: 'Tempo real', color: '#FFE8F8', log: { source: 'Webhook', records: '89,000', duration: '—', time: 'Tempo real', status: 'Ativo' } },
  'SFTP': { type: 'Arquivo Remoto', extra: '78K registros • 4 arquivos', lastSync: '1h atrás', color: '#F5F0E8', log: { source: 'SFTP', records: '78,000', duration: '0m 32s', time: '25/03 07:00', status: 'Sucesso' } },
};

const INGESTION_LOG = [
  { source: 'Upload CSV', records: '45,231', duration: '0m 18s', time: '24/03 09:15', status: 'Sucesso' },
  { source: 'Revfy Pixel', records: '3,100,000', duration: '—', time: 'Tempo real', status: 'Ativo' },
];

const OverviewPage = ({ platformData }) => (
  <div style={{ flex: 1, overflowY: 'auto' }}>
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px', color: '#000' }}>Overview</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {platformData.kpis.map((kpi, idx) => (<KPICard key={idx} {...kpi} />))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#000' }}>Registros Processados (últimos 30 dias)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={MOCK_DATA.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} /><XAxis dataKey="day" stroke={COLORS.muted} /><YAxis stroke={COLORS.muted} /><Tooltip /><Line type="monotone" dataKey="records" stroke={COLORS.primary} strokeWidth={2} dot={{ fill: COLORS.primary }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#000' }}>Atividade Recente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            {platformData.recentActivity.map((activity, idx) => (
              <div key={idx} style={{ padding: '12px', backgroundColor: COLORS.lightGray, borderRadius: '8px', borderLeft: `3px solid ${COLORS.primary}` }}>
                <div style={{ fontWeight: '600', color: '#000', marginBottom: '2px' }}>{activity.action}</div>
                <div style={{ color: COLORS.muted, fontSize: '12px' }}>{activity.detail} • {activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#000' }}>Distribuição por Canal</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={MOCK_DATA.spendData}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} /><XAxis dataKey="channel" stroke={COLORS.muted} /><YAxis stroke={COLORS.muted} /><Tooltip /><Bar dataKey="spend" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const DataSyncPage = ({ sourceState, sourceActions, platformData }) => {
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
  const stepLabels = ['Selecionar Fonte', 'Autenticação', 'Configurar', 'Testar'];

  const tabs = ['connections', 'datasets', 'logs'];
  const tabLabels = { connections: 'Connections', datasets: 'Datasets', logs: 'Logs' };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#000' }}>Data Sync</h1>
          <button onClick={() => setShowWizard(true)} style={{ padding: '10px 20px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>+ Add Source</button>
        </div>

        <div style={{ display: 'flex', borderBottom: `2px solid ${COLORS.border}`, margin: '20px 0 24px' }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '600', color: activeTab === tab ? COLORS.primary : COLORS.muted, cursor: 'pointer', borderBottom: activeTab === tab ? `2px solid ${COLORS.primary}` : '2px solid transparent', marginBottom: '-2px', background: 'none', border: 'none', borderBottomStyle: 'solid', borderBottomWidth: '2px', borderBottomColor: activeTab === tab ? COLORS.primary : 'transparent', transition: 'all 0.15s' }}>{tabLabels[tab]}</button>
          ))}
        </div>

        {activeTab === 'connections' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
              {sourceState.visibleSources.map((source) => (<SourceCard key={source.id} source={sourceState.getSourceStatus(source)} onConnect={handleCardConnect} onAction={sourceActions.handleSourceAction} />))}
              <div onClick={() => setShowWizard(true)} style={{ padding: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `2px dashed ${COLORS.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.backgroundColor = COLORS.bgBlue; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.backgroundColor = COLORS.cardBg; }}>
                <div style={{ textAlign: 'center' }}>
                  <Plus size={32} color={COLORS.primary} style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.primary }}>Connect Source</div>
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button style={{ padding: '8px 16px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>+ Create Dataset</button>
            </div>
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
                  {platformData.allDatasets.map((ds, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.border}` }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '12px', fontSize: '13px' }}><div style={{ fontWeight: '600' }}>{ds.nome}</div></td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{ds.fonte}</td>
                      <td style={{ padding: '12px', fontSize: '13px', fontWeight: '600' }}>{ds.registros}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{ds.status === 'Ativo' ? <Badge color="green">Active</Badge> : <Badge color="yellow">Review</Badge>}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{ds.atualizacao}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{ padding: '4px 10px', fontSize: '11px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', background: 'none', cursor: 'pointer', color: COLORS.muted }}>Edit</button>
                          <button style={{ padding: '4px 10px', fontSize: '11px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', background: 'none', cursor: 'pointer', color: COLORS.primary }}>Sync</button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: COLORS.success, marginBottom: '8px' }}>
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
            <div style={{ padding: '12px 16px', backgroundColor: `${COLORS.success}10`, borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', border: `1px solid ${COLORS.success}30` }}>
              <Check size={16} color={COLORS.success} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#000' }}>Conexão com {selectedSource.name} ativa</span>
              <span style={{ fontSize: '11px', color: COLORS.muted, marginLeft: 'auto' }}>Latência: 38ms</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>Nome da Conexão</label>
                <input type="text" defaultValue={selectedSource.name} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>Frequência de Sync</label>
                <select style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px' }}>
                  <option>A cada 15 minutos</option><option>A cada hora</option><option>A cada 6 horas</option><option>Diariamente</option><option>Manual</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#000', marginBottom: '6px' }}>Objetos para Sincronizar</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['Contatos', 'Empresas', 'Negócios', 'Listas'].map((obj) => (
                    <label key={obj} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: COLORS.lightGray, borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                      <input type="checkbox" defaultChecked={obj === 'Contatos' || obj === 'Listas'} style={{ width: '16px', height: '16px' }} />{obj}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setWizardStep(3)} style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Testar e Conectar</button>
          </div>
        )}

        {wizardStep === 3 && selectedSource && (
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
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: COLORS.success, marginBottom: '8px' }}>Conexão bem-sucedida!</h3>
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

        {wizardStep > 0 && wizardStep < 3 && !authenticating && (
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
    </div>
  );
};

const AudienciasPage = ({ platformData }) => {
  const [selectedAudience, setSelectedAudience] = useState(MOCK_DATA.audiences[0]);
  const [activeTab, setActiveTab] = useState('construtor');
  const [showActivateModal, setShowActivateModal] = useState(false);
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px', minHeight: '100vh' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: COLORS.muted, marginBottom: '16px', textTransform: 'uppercase' }}>Audiências</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MOCK_DATA.audiences.map((aud) => (
              <div key={aud.id} onClick={() => setSelectedAudience(aud)} style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: selectedAudience.id === aud.id ? COLORS.bgBlue : 'transparent', borderLeft: selectedAudience.id === aud.id ? `3px solid ${COLORS.primary}` : '3px solid transparent', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { if (selectedAudience.id !== aud.id) e.currentTarget.style.backgroundColor = COLORS.lightGray; }}
                onMouseLeave={(e) => { if (selectedAudience.id !== aud.id) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>{aud.name}</div>
                <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '4px' }}>{aud.size.toLocaleString()} perfis</div>
                <Badge color={aud.status === 'Ativo' ? 'green' : aud.status === 'Teste' ? 'blue' : 'yellow'}>{aud.status}</Badge>
              </div>
            ))}
          </div>
          <button style={{ width: '100%', marginTop: '20px', padding: '10px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>+ Nova Audiência</button>
        </div>
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
            <div>
              <input type="text" defaultValue={selectedAudience.name} style={{ fontSize: '24px', fontWeight: '700', border: 'none', padding: '0', backgroundColor: 'transparent', cursor: 'text', color: '#000' }} />
              <div style={{ marginTop: '8px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Badge color={selectedAudience.status === 'Ativo' ? 'green' : 'blue'}>{selectedAudience.status}</Badge>
                <span style={{ fontSize: '12px', color: COLORS.muted }}>Criada em {selectedAudience.created}</span>
              </div>
            </div>
            <button onClick={() => setShowActivateModal(true)} style={{ padding: '10px 20px', backgroundColor: COLORS.success, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Ativar Audiência</button>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '12px' }}>
            {['construtor', 'sql', 'configs'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 0', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: activeTab === tab ? COLORS.primary : COLORS.muted, borderBottom: activeTab === tab ? `2px solid ${COLORS.primary}` : 'none' }}>
                {tab === 'construtor' && 'Construtor'} {tab === 'sql' && 'SQL'} {tab === 'configs' && 'Configurações'}
              </button>
            ))}
          </div>
          {activeTab === 'construtor' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: COLORS.muted, marginBottom: '12px', textTransform: 'uppercase' }}>Filtros</div>
                {[{ entity: 'Estado', attr: 'Valor', op: '=', val: 'SP' }, { entity: 'Faixa Etária', attr: 'Valor', op: 'BETWEEN', val: '25-44' }, { entity: 'Comportamento', attr: 'engajamento_digital', op: '>=', val: '0.7' }].map((filter, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                    <select style={{ padding: '8px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '13px' }} defaultValue={filter.entity}><option>{filter.entity}</option></select>
                    <select style={{ padding: '8px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '13px' }} defaultValue={filter.attr}><option>{filter.attr}</option></select>
                    <select style={{ padding: '8px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '13px' }} defaultValue={filter.op}><option>{filter.op}</option></select>
                    <input type="text" defaultValue={filter.val} style={{ padding: '8px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                    <Trash2 size={16} color={COLORS.muted} style={{ cursor: 'pointer' }} />
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px', backgroundColor: COLORS.bgBlue, borderRadius: '8px', marginTop: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: COLORS.primary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><BarChart3 size={16} /> Tamanho da Audiência</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>847,293 perfis</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div>Tratada: <span style={{ fontWeight: '700', color: COLORS.primary }}>523,841</span></div>
                  <div>Controlado: <span style={{ fontWeight: '700', color: COLORS.primary }}>323,452</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={showActivateModal} title="Ativar Audiência" onClose={() => setShowActivateModal(false)}>
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
        <button style={{ width: '100%', padding: '12px', backgroundColor: COLORS.success, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Ativar</button>
      </Modal>
    </div>
  );
};

const DestinosPage = () => (
  <div style={{ flex: 1, overflowY: 'auto' }}>
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: '#000' }}>Destinos</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {MOCK_DATA.destinations.map((dest) => (
          <div key={dest.id} style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>{dest.name}</div>
                <div style={{ fontSize: '12px', color: COLORS.muted }}>{dest.type}</div>
              </div>
              <Badge color="green">{dest.status}</Badge>
            </div>
            <div style={{ padding: '12px 16px', backgroundColor: COLORS.lightGray, borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '4px' }}>Match Rate</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#000' }}>{dest.match}</div>
            </div>
            <button style={{ width: '100%', padding: '10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: COLORS.primary }}>Configurar</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SincronizacoesPage = () => (
  <div style={{ flex: 1, overflowY: 'auto' }}>
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: '#000' }}>Sincronizações</h1>
      <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Audiência</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Destino</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Registros</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Frequência</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Último Sync</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Status</th>
          </tr></thead>
          <tbody>
            {MOCK_DATA.syncs.map((sync) => (
              <tr key={sync.id} style={{ borderBottom: `1px solid ${COLORS.border}` }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '12px', fontWeight: '600' }}>{sync.audiencia}</td>
                <td style={{ padding: '12px' }}>{sync.destino}</td>
                <td style={{ padding: '12px' }}>{sync.records.toLocaleString()}</td>
                <td style={{ padding: '12px' }}>{sync.frequencia}</td>
                <td style={{ padding: '12px' }}>{sync.lastRun}</td>
                <td style={{ padding: '12px' }}><Badge color={sync.status === 'Sucesso' ? 'green' : 'yellow'}>{sync.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const RevFyIQPage = () => (
  <div style={{ flex: 1, overflowY: 'auto' }}>
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: '#000' }}>RevFy IQ</h1>
      <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#000' }}>Modelos de Machine Learning</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[{ name: 'Lookalike Sudeste', accuracy: '94%', dataset: '1.5M registros' }, { name: 'Churn Prediction', accuracy: '91%', dataset: '847K registros' }].map((model, idx) => (
            <div key={idx} style={{ padding: '16px', backgroundColor: COLORS.lightGray, borderRadius: '8px' }}>
              <div style={{ fontWeight: '600', color: '#000', marginBottom: '4px' }}>{model.name}</div>
              <div style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '8px' }}>Acurácia: {model.accuracy}</div>
              <div style={{ fontSize: '11px', color: COLORS.muted }}>{model.dataset}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const GovernancaPage = () => (
  <div style={{ flex: 1, overflowY: 'auto' }}>
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: '#000' }}>Governança</h1>
      <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Requisito</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Detalhe</th>
          </tr></thead>
          <tbody>
            {MOCK_DATA.compliance.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.border}` }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '12px', fontWeight: '600' }}>{item.req}</td>
                <td style={{ padding: '12px' }}><Badge color={item.status === 'Completo' ? 'green' : 'yellow'}>{item.status}</Badge></td>
                <td style={{ padding: '12px', fontSize: '12px', color: COLORS.muted }}>{item.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const InvestimentoPage = () => (
  <div style={{ flex: 1, overflowY: 'auto' }}>
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: '#000' }}>Investimento</h1>
      <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', color: COLORS.muted, marginBottom: '4px' }}>Investimento Total</div>
        <div style={{ fontSize: '32px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>R$ 4.8M</div>
        <div style={{ fontSize: '12px', color: COLORS.success, fontWeight: '600' }}>de R$ 16.5M alocado</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {MOCK_DATA.spendData.map((item) => (
          <div key={item.channel} style={{ padding: '16px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '8px' }}>{item.channel}</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#000' }}>R$ {(item.spend / 1000000).toFixed(1)}M</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ColigadosPage = () => (
  <div style={{ flex: 1, overflowY: 'auto' }}>
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: '#000' }}>Parceiros</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {MOCK_DATA.coalitions.map((coalition, idx) => (
          <div key={idx} style={{ padding: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: coalition.color + '20', marginBottom: '12px' }} />
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>{coalition.name}</div>
            <div style={{ fontSize: '12px', color: COLORS.muted, marginBottom: '8px' }}>{coalition.role}</div>
            <div style={{ fontSize: '11px', color: COLORS.primary, fontWeight: '600' }}>{coalition.access}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const IntegracoesPage = () => (
  <div style={{ flex: 1, overflowY: 'auto' }}>
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: '#000' }}>Integrações</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {[{ name: 'Snowflake', status: 'Conectado' }, { name: 'BigQuery', status: 'Configurando' }, { name: 'HubSpot', status: 'Conectado' }, { name: 'Salesforce', status: 'Conectado' }, { name: 'Meta Ads', status: 'Conectado' }, { name: 'Google Ads', status: 'Conectado' }].map((int, idx) => (
          <div key={idx} style={{ padding: '20px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#000' }}>{int.name}</div>
              <Badge color={int.status === 'Conectado' ? 'green' : 'blue'}>{int.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const UsuariosPage = () => (
  <div style={{ flex: 1, overflowY: 'auto' }}>
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: '#000' }}>Usuários</h1>
      <div style={{ backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Nome</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Papel</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Último Acesso</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.muted }}>Status</th>
          </tr></thead>
          <tbody>
            {MOCK_DATA.users.map((user) => (
              <tr key={user.id} style={{ borderBottom: `1px solid ${COLORS.border}` }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.lightGray} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '12px', fontWeight: '600' }}>{user.name}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>{user.email}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>{user.role}</td>
                <td style={{ padding: '12px', fontSize: '13px', color: COLORS.muted }}>{user.lastAccess}</td>
                <td style={{ padding: '12px' }}><Badge color={user.status === 'Ativo' ? 'green' : 'yellow'}>{user.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const CalendarioPage = () => (
  <div style={{ flex: 1, overflowY: 'auto' }}>
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '32px', color: '#000' }}>Calendário</h1>
      <div style={{ padding: '24px', backgroundColor: COLORS.cardBg, borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
        <div style={{ position: 'relative', paddingLeft: '60px' }}>
          {MOCK_DATA.calendar.map((event, idx) => {
            const bgColor = event.status === 'current' ? COLORS.bgBlue : event.status === 'critical' ? '#FF6B6B' + '15' : 'transparent';
            const borderColor = event.status === 'current' ? COLORS.primary : event.status === 'critical' ? '#FF6B6B' : COLORS.border;
            return (
              <div key={idx} style={{ position: 'relative', paddingTop: idx === 0 ? '0' : '20px', paddingBottom: '20px' }}>
                <div style={{ position: 'absolute', left: '0', top: '12px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: event.status === 'current' ? COLORS.primary : event.status === 'critical' ? '#FF6B6B' : COLORS.border, border: `4px solid ${COLORS.cardBg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: event.status === 'current' || event.status === 'critical' ? '#fff' : COLORS.muted, fontWeight: '700', marginLeft: '-40px' }}>
                  {event.status === 'current' ? <Check size={12} color="#fff" /> : ''}
                </div>
                {idx < MOCK_DATA.calendar.length - 1 && (
                  <div style={{ position: 'absolute', left: '11px', top: '36px', width: '2px', height: '40px', backgroundColor: COLORS.border, marginLeft: '-40px' }} />
                )}
                <div style={{ padding: '16px', backgroundColor: bgColor, borderRadius: '8px', border: `1px solid ${borderColor}`, marginLeft: '24px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', marginBottom: '4px' }}>{event.date}</div>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#000', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>{getCalendarIcon(event.icon)} {event.phase}</h3>
                  {event.status === 'current' && <Badge color="blue">Atual</Badge>}
                  {event.status === 'critical' && <Badge color="red">Crítico</Badge>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

export default function RevfyTrustHubDemo() {
  const [currentPage, setCurrentPage] = useState('overview');

  // Lifted state from DataSyncPage
  const [sourceStates, setSourceStates] = useState({});
  const [deletedSources, setDeletedSources] = useState({});
  const [loadingSources, setLoadingSources] = useState({});
  const [dynamicSources, setDynamicSources] = useState([]);
  const [nextId, setNextId] = useState(100);

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

    // Compute KPIs
    const kpis = MOCK_DATA.kpis.map(kpi => {
      if (kpi.label === 'Registros no DCR') {
        return { ...kpi, value: totalRecords.toLocaleString() };
      }
      return kpi;
    });

    // Recent activity including source connections
    const recentActivity = [
      ...activeSourceNames.slice(-2).reverse().map(source => ({
        action: `${source} conectado`,
        detail: `${source} • Dados sincronizados`,
        time: 'Agora'
      })),
      { action: 'Audiência ativada', detail: 'Segmento SP 25-44 → Meta', time: 'Há 2h' },
      { action: 'Dataset sincronizado', detail: `${activeSourceNames[0] || 'Upload CSV'} (${totalRecords > 1000000 ? (totalRecords / 1000000).toFixed(1) : totalRecords / 1000}M registros)`, time: 'Há 4h' },
      { action: 'Novo usuário adicionado', detail: 'Ana Costa (Parceiro)', time: 'Há 6h' },
      { action: 'Relatório compliance exportado', detail: 'Governança Q1 2026', time: 'Há 1d' },
    ];

    return {
      kpis,
      visibleSources,
      getSourceStatus,
      activeSourceNames,
      allDatasets,
      allLogs,
      recentActivity,
    };
  }, [sourceStates, deletedSources, loadingSources, dynamicSources]);

  // Source action handlers
  const sourceActions = useMemo(() => ({
    handleSourceAction: (source, action) => {
      switch (action) {
        case 'activate': setSourceStates(prev => ({ ...prev, [source.id]: 'Ativo' })); break;
        case 'pause': setSourceStates(prev => ({ ...prev, [source.id]: 'Pausado' })); break;
        case 'disconnect': setSourceStates(prev => ({ ...prev, [source.id]: 'Desconectado' })); break;
        case 'delete': setDeletedSources(prev => ({ ...prev, [source.id]: true })); break;
        default: break;
      }
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
    }
  }), [nextId]);

  const sourceState = useMemo(() => ({
    visibleSources: platformData.visibleSources,
    getSourceStatus: platformData.getSourceStatus,
    activeSourceNames: platformData.activeSourceNames,
  }), [platformData]);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview': return <OverviewPage platformData={platformData} />;
      case 'datasync': return <DataSyncPage sourceState={sourceState} sourceActions={sourceActions} platformData={platformData} />;
      case 'audiencias': return <AudienciasPage platformData={platformData} />;
      case 'destinos': return <DestinosPage />;
      case 'sincronizacoes': return <SincronizacoesPage />;
      case 'revfyiq': return <RevFyIQPage />;
      case 'governanca': return <GovernancaPage />;
      case 'investimento': return <InvestimentoPage />;
      case 'coligados': return <ColigadosPage />;
      case 'integracoes': return <IntegracoesPage />;
      case 'usuarios': return <UsuariosPage />;
      case 'calendario': return <CalendarioPage />;
      default: return <OverviewPage platformData={platformData} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: COLORS.pageBg, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#000' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: COLORS.pageBg }}>
        {renderPage()}
      </div>
    </div>
  );
}
