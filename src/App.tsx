import React, { useState, useEffect } from 'react'
import { supabase, Usuario, Meta, Resultado, Programa, Equipe } from './lib/supabase'
import { ExternalLink, Target, TrendingUp, Users, Calendar, AlertCircle, LogOut, CheckCircle, Clock, FileText, Building2, Link } from 'lucide-react'

function App() {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'login' | 'dashboard' | 'nova-meta' | 'lancar-resultado' | 'equipes'>('login')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single()
      
      if (data) {
        setUser(data)
        setView('dashboard')
      }
    }
    setLoading(false)
  }

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error && data.user) {
      const { data: userData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', data.user.id)
        .single()
      
      if (userData) {
        setUser(userData)
        setView('dashboard')
      }
    } else {
      alert('Erro ao fazer login: ' + error?.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setView('login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'dashboard' && <Dashboard user={user} onNavigate={setView} />}
        {view === 'nova-meta' && <NovaMeta user={user} onBack={() => setView('dashboard')} />}
        {view === 'lancar-resultado' && <LancarResultado user={user} onBack={() => setView('dashboard')} />}
        {view === 'equipes' && <GerenciarEquipes user={user} onBack={() => setView('dashboard')} />}
      </main>
    </div>
  )
}

// ============================================
// COMPONENTE: Login
// ============================================
function Login({ onLogin }: { onLogin: (email: string, password: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Gestão de Metas</h1>
          <p className="text-gray-600 mt-2">Acesse sua conta para continuar</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <button
            onClick={() => onLogin(email, password)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Entrar
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs font-medium text-blue-900 mb-2">💡 Sistema 100% Informativo</p>
          <p className="text-xs text-blue-700">Sem cálculos, pesos ou análises automáticas</p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// COMPONENTE: Header
// ============================================
function Header({ user, onLogout }: { user: Usuario; onLogout: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sistema de Gestão de Metas</h1>
              <p className="text-sm text-gray-600">Olá, {user.nome}</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}

// ============================================
// COMPONENTE: Dashboard
// ============================================
function Dashboard({ user, onNavigate }: { user: Usuario; onNavigate: (view: any) => void }) {
  const [metas, setMetas] = useState<Meta[]>([])
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [programas, setProgramas] = useState<Programa[]>([])

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    const { data: metasData } = await supabase.from('metas').select('*')
    const { data: resultadosData } = await supabase.from('resultados').select('*')
    const { data: programasData } = await supabase.from('programas').select('*')
    
    if (metasData) setMetas(metasData)
    if (resultadosData) setResultados(resultadosData)
    if (programasData) setProgramas(programasData)
  }

  const cards = [
    { title: 'Programas Ativos', value: programas.filter(p => p.status === 'ativo').length, icon: Calendar, color: 'text-blue-600' },
    { title: 'Metas Cadastradas', value: metas.length, icon: Target, color: 'text-green-600' },
    { title: 'Pendentes de Lançamento', value: resultados.filter(r => r.status === 'pendente').length, icon: AlertCircle, color: 'text-orange-600' },
    { title: 'Aprovações Pendentes', value: resultados.filter(r => r.status === 'pendente').length, icon: Clock, color: 'text-purple-600' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        {user.tipo === 'admin' && (
          <button
            onClick={() => onNavigate('equipes')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            <Building2 className="w-4 h-4" />
            Gerenciar Equipes
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold mt-2 text-gray-900">{card.value}</p>
              </div>
              <card.icon className={`w-12 h-12 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      {resultados.filter(r => r.status === 'pendente').length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <p className="font-medium text-orange-900">Atenção</p>
            <p className="text-sm text-orange-700">Você possui {resultados.filter(r => r.status === 'pendente').length} resultados pendentes de aprovação.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetasCard metas={metas} onNovaMeta={() => onNavigate('nova-meta')} userTipo={user.tipo} />
        <ResultadosCard resultados={resultados} onLancar={() => onNavigate('lancar-resultado')} />
      </div>
    </div>
  )
}

// ============================================
// COMPONENTE: MetasCard
// ============================================
function MetasCard({ metas, onNovaMeta, userTipo }: { metas: Meta[]; onNovaMeta: () => void; userTipo: string }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Metas</h3>
          {userTipo !== 'lancador' && (
            <button
              onClick={onNovaMeta}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Target className="w-4 h-4" />
              Nova Meta
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6 space-y-3">
        {metas.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhuma meta cadastrada</p>
        ) : (
          metas.slice(0, 5).map(meta => (
            <div key={meta.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">{meta.nome}</h4>
              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {meta.periodo_acompanhamento}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {meta.tipo_metrica}
                </span>
              </div>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  meta.status === 'ativa' ? 'bg-green-100 text-green-800' :
                  meta.status === 'sugestao' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {meta.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ============================================
// COMPONENTE: ResultadosCard
// ============================================
function ResultadosCard({ resultados, onLancar }: { resultados: Resultado[]; onLancar: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Resultados</h3>
          <button
            onClick={onLancar}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <TrendingUp className="w-4 h-4" />
            Lançar Resultado
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-3">
        {resultados.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhum resultado lançado</p>
        ) : (
          resultados.slice(0, 5).map(resultado => (
            <div key={resultado.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">
                    {new Date(resultado.mes_referencia).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
                  <p className="font-medium text-blue-600 mt-1">{resultado.resultado}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  resultado.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                  resultado.status === 'reprovado' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {resultado.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ============================================
// COMPONENTE: NovaMeta
// ============================================
function NovaMeta({ user, onBack }: { user: Usuario; onBack: () => void }) {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    tipo_metrica: 'numerico',
    periodo_acompanhamento: 'mensal',
    equipe_id: user.equipe_id || '',
    programa_id: ''
  })
  const [programas, setProgramas] = useState<Programa[]>([])

  useEffect(() => {
    carregarProgramas()
  }, [])

  const carregarProgramas = async () => {
    const { data } = await supabase.from('programas').select('*').eq('status', 'ativo')
    if (data) setProgramas(data)
  }

  const handleSalvar = async () => {
    if (!form.nome || !form.programa_id) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const { error } = await supabase.from('metas').insert({
      ...form,
      created_by: user.id,
      status: 'sugestao'
    })

    if (error) {
      alert('Erro ao salvar meta: ' + error.message)
    } else {
      alert('Meta criada com sucesso!')
      onBack()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Nova Meta</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Meta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({...form, nome: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Atendimento ao Cliente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({...form, descricao: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva o objetivo desta meta..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Métrica</label>
              <select
                value={form.tipo_metrica}
                onChange={(e) => setForm({...form, tipo_metrica: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="numerico">Numérico</option>
                <option value="monetario">Monetário (R$)</option>
                <option value="percentual">Percentual</option>
                <option value="data">Data</option>
                <option value="quantidade">Quantidade</option>
                <option value="nota">Nota</option>
                <option value="dias">Diferença de Dias</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <select
                value={form.periodo_acompanhamento}
                onChange={(e) => setForm({...form, periodo_acompanhamento: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="mensal">Mensal</option>
                <option value="bimestral">Bimestral</option>
                <option value="trimestral">Trimestral</option>
                <option value="quadrimestral">Quadrimestral</option>
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Programa <span className="text-red-500">*</span>
            </label>
            <select
              value={form.programa_id}
              onChange={(e) => setForm({...form, programa_id: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um programa</option>
              {programas.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar Meta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// COMPONENTE: LancarResultado
// ============================================
function LancarResultado({ user, onBack }: { user: Usuario; onBack: () => void }) {
  const [form, setForm] = useState({
    meta_id: '',
    mes_referencia: '',
    resultado: '',
    observacao: '',
    comprovante_anexado: false
  })
  const [metas, setMetas] = useState<Meta[]>([])
  const [metaSelecionada, setMetaSelecionada] = useState<Meta | null>(null)
  const [equipe, setEquipe] = useState<Equipe | null>(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    carregarMetas()
  }, [])

  useEffect(() => {
    if (form.meta_id) {
      carregarEquipeMeta()
    }
  }, [form.meta_id])

  const carregarMetas = async () => {
    const { data } = await supabase.from('metas').select('*').eq('status', 'ativa')
    if (data) setMetas(data)
  }

  const carregarEquipeMeta = async () => {
    const meta = metas.find(m => m.id === form.meta_id)
    if (meta) {
      setMetaSelecionada(meta)
      const { data } = await supabase
        .from('equipes')
        .select('*')
        .eq('id', meta.equipe_id)
        .single()
      if (data) setEquipe(data)
    }
  }

  const handleEnviar = async () => {
    if (!form.meta_id || !form.resultado || !form.observacao) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    if (!form.comprovante_anexado) {
      alert('Você deve anexar o comprovante no link da equipe e marcar a confirmação')
      return
    }

    setEnviando(true)

    try {
      const { error } = await supabase.from('resultados').insert({
        ...form,
        lancado_by: user.id,
        status: 'pendente'
      })

      if (error) throw error

      alert('Resultado enviado para aprovação com sucesso!')
      onBack()
    } catch (error: any) {
      alert('Erro ao enviar resultado: ' + error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Lançar Resultado</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta <span className="text-red-500">*</span>
            </label>
            <select
              value={form.meta_id}
              onChange={(e) => setForm({...form, meta_id: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione a meta</option>
              {metas.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>

          {equipe?.link_comprovantes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 mb-1">Link para Anexar Comprovante</p>
                  <p className="text-sm text-blue-700 mb-3">
                    Acesse o link abaixo para anexar o comprovante deste resultado na pasta da equipe:
                  </p>
                  <a
                    href={equipe.link_comprovantes}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir Link para Upload
                  </a>
                  <p className="text-xs text-blue-600 mt-3">
                    📌 Salve o arquivo com o nome: <strong>META_{metaSelecionada?.nome}_MES_{form.mes_referencia || 'YYYY-MM'}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mês de Referência <span className="text-red-500">*</span>
            </label>
            <input
              type="month"
              value={form.mes_referencia}
              onChange={(e) => setForm({...form, mes_referencia: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resultado <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.resultado}
              onChange={(e) => setForm({...form, resultado: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 150 ou R$ 250.000,00 ou 85%"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observação <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.observacao}
              onChange={(e) => setForm({...form, observacao: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva detalhes sobre este resultado..."
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="comprovante_anexado"
                checked={form.comprovante_anexado}
                onChange={(e) => setForm({...form, comprovante_anexado: e.target.checked})}
                className="mt-1 w-5 h-5"
              />
              <label htmlFor="comprovante_anexado" className="flex-1">
                <p className="font-medium text-gray-900">
                  Confirmo que anexei o comprovante <span className="text-red-500">*</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Marque esta opção após fazer upload do comprovante no link fornecido acima.
                </p>
              </label>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="text-sm text-orange-700">
              <p className="font-medium text-orange-900 mb-1">Atenção</p>
              <p>Certifique-se de anexar o comprovante no link antes de enviar. O resultado será enviado para aprovação.</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onBack}
              disabled={enviando}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleEnviar}
              disabled={enviando}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {enviando ? 'Enviando...' : 'Enviar para Aprovação'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// COMPONENTE: GerenciarEquipes
// ============================================
function GerenciarEquipes({ user, onBack }: { user: Usuario; onBack: () => void }) {
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [editando, setEditando] = useState<string | null>(null)
  const [linkTemp, setLinkTemp] = useState('')

  useEffect(() => {
    carregarEquipes()
  }, [])

  const carregarEquipes = async () => {
    const { data } = await supabase
      .from('equipes')
      .select('*, setores(nome)')
      .order('nome')
    if (data) setEquipes(data as any)
  }

  const handleSalvarLink = async (equipeId: string) => {
    if (!linkTemp.trim()) {
      alert('Informe um link válido')
      return
    }

    const { error } = await supabase
      .from('equipes')
      .update({ link_comprovantes: linkTemp })
      .eq('id', equipeId)

    if (error) {
      alert('Erro ao salvar: ' + error.message)
    } else {
      alert('Link salvo com sucesso!')
      setEditando(null)
      setLinkTemp('')
      carregarEquipes()
    }
  }

  const iniciarEdicao = (equipe: Equipe) => {
    setEditando(equipe.id)
    setLinkTemp(equipe.link_comprovantes || '')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Gerenciar Equipes</h2>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Configurar Links para Comprovantes</h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure o link (Google Drive, Dropbox, OneDrive, etc.) onde cada equipe anexará os comprovantes.
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {equipes.map(equipe => (
            <div key={equipe.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{equipe.nome}</h4>
                  <p className="text-sm text-gray-600">Setor: {(equipe as any).setores?.nome}</p>
                </div>
                {editando !== equipe.id && (
                  <button
                    onClick={() => iniciarEdicao(equipe)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Editar Link
                  </button>
                )}
              </div>

              {editando === equipe.id ? (
                <div className="space-y-3">
                  <input
                    type="url"
                    value={linkTemp}
                    onChange={(e) => setLinkTemp(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSalvarLink(equipe.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => {
                        setEditando(null)
                        setLinkTemp('')
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {equipe.link_comprovantes ? (
                    <>
                      <Link className="w-5 h-5 text-green-600" />
                      <a
                        href={equipe.link_comprovantes}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate flex-1"
                      >
                        {equipe.link_comprovantes}
                      </a>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-gray-500">Nenhum link configurado</span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium text-blue-900 mb-2">💡 Dicas para configurar o link:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use Google Drive, Dropbox, OneDrive ou qualquer serviço de nuvem</li>
              <li>Crie uma pasta específica para cada equipe</li>
              <li>Configure permissões de upload para os membros da equipe</li>
              <li>Oriente a equipe a nomear os arquivos de forma padronizada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
