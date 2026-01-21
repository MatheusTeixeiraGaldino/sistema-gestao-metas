import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos TypeScript
export interface Setor {
  id: string
  nome: string
  descricao?: string
  ativo: boolean
  created_at: string
}

export interface Equipe {
  id: string
  nome: string
  setor_id: string
  descricao?: string
  link_comprovantes?: string
  ativo: boolean
  created_at: string
}

export interface Usuario {
  id: string
  auth_user_id?: string
  nome: string
  email: string
  tipo: 'admin' | 'gerente' | 'lancador'
  equipe_id?: string
  ativo: boolean
  created_at: string
}

export interface Programa {
  id: string
  nome: string
  data_inicio: string
  data_fim: string
  periodo_sugestao_inicio?: string
  periodo_sugestao_fim?: string
  status: 'ativo' | 'encerrado' | 'suspenso'
  created_at: string
}

export interface Meta {
  id: string
  programa_id: string
  equipe_id: string
  nome: string
  descricao?: string
  tipo_metrica: 'numerico' | 'monetario' | 'percentual' | 'data' | 'quantidade' | 'nota' | 'dias'
  periodo_acompanhamento: 'mensal' | 'bimestral' | 'trimestral' | 'quadrimestral' | 'semestral' | 'anual'
  status: 'sugestao' | 'aprovada' | 'reprovada' | 'ativa' | 'inativa'
  created_by: string
  created_at: string
}

export interface Resultado {
  id: string
  meta_id: string
  mes_referencia: string
  resultado: string
  observacao: string
  comprovante_anexado: boolean
  status: 'pendente' | 'aprovado' | 'reprovado'
  lancado_by: string
  created_at: string
}

export interface HistoricoAuditoria {
  id: string
  tabela: string
  registro_id: string
  campo_alterado: string
  valor_anterior?: string
  valor_novo?: string
  usuario_id: string
  acao: 'criacao' | 'alteracao' | 'exclusao'
  created_at: string
}
