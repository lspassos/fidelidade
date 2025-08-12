import React, { useState, useEffect } from 'react'
import { Star, Instagram, Users, TrendingUp, Gift, Bell, Download, Settings, Loader } from 'lucide-react'

export default function LoyaltySystem() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [newMentions, setNewMentions] = useState(0)
  const [config, setConfig] = useState({
    postPoints: 10,
    storyPoints: 5,
    hashtagBonus: 3,
    discountThreshold: 50
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/sheets')
      const data = await response.json()
      setCustomers(data.customers || [])
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      setLoading(false)
    }
  }

  const saveCustomer = async (customerData) => {
    try {
      await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      })
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
    }
  }

  const checkInstagramMentions = async () => {
    try {
      const response = await fetch('/api/instagram')
      const data = await response.json()
      return data.mentions || []
    } catch (error) {
      console.error('Erro ao verificar menções:', error)
      return []
    }
  }

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(async () => {
        const mentions = await checkInstagramMentions()
        
        mentions.forEach(mention => {
          const points = mention.type === 'post' ? config.postPoints : config.storyPoints
          
          setCustomers(prev => {
            const existingIndex = prev.findIndex(c => c.username === mention.username)
            
            if (existingIndex >= 0) {
              const updated = [...prev]
              updated[existingIndex] = {
                ...updated[existingIndex],
                points: updated[existingIndex].points + points,
                [mention.type === 'post' ? 'posts' : 'stories']: 
                  updated[existingIndex][mention.type === 'post' ? 'posts' : 'stories'] + 1,
                lastActivity: new Date().toISOString().split('T')[0]
              }
              
              saveCustomer(updated[existingIndex])
              
              return updated
            } else {
              const newCustomer = {
                id: Date.now(),
                name: mention.username,
                username: mention.username,
                points: points,
                posts: mention.type === 'post' ? 1 : 0,
                stories: mention.type === 'story' ? 1 : 0,
                lastActivity: new Date().toISOString().split('T')[0],
                email: ''
              }
              
              saveCustomer(newCustomer)
              
              return [...prev, newCustomer]
            }
          })
        })
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [isMonitoring, config])

  const totalPoints = customers.reduce((sum, customer) => sum + customer.points, 0)
  const totalMentions = customers.reduce((sum, customer) => sum + customer.posts + customer.stories, 0)
  const eligibleForDiscount = customers.filter(c => c.points >= config.discountThreshold)

  const exportToSheet = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nome,Username,Pontos,Posts,Stories,Última Atividade,Email\n"
      + customers.map(c => `${c.name},${c.username},${c.points},${c.posts},${c.stories},${c.lastActivity},${c.email}`).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "clientes_fidelidade.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getDiscountPercentage = (points) => {
    if (points >= 100) return "20%"
    if (points >= 75) return "15%"
    if (points >= 50) return "10%"
    return "0%"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Instagram className="text-pink-400" />
            Sistema de Fidelidade
          </h1>
          <p className="text-blue-200">@avidaeumafestacb - Monitoramento de Menções</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-blue-400 w-8 h-8" />
              <span className="text-2xl font-bold text-white">{customers.length}</span>
            </div>
            <p className="text-blue-200">Clientes Ativos</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-green-400 w-8 h-8" />
              <span className="text-2xl font-bold text-white">{totalMentions}</span>
            </div>
            <p className="text-blue-200">Total Menções</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Star className="text-yellow-400 w-8 h-8" />
              <span className="text-2xl font-bold text-white">{totalPoints}</span>
            </div>
            <p className="text-blue-200">Pontos Totais</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Gift className="text-pink-400 w-8 h-8" />
              <span className="text-2xl font-bold text-white">{eligibleForDiscount.length}</span>
            </div>
            <p className="text-blue-200">Elegíveis p/ Desconto</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Controles
              </h3>
              
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`w-full py-3 px-4 rounded-lg font-semibold mb-4 transition-all ${
                  isMonitoring 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isMonitoring ? 'Parar Monitoramento' : 'Iniciar Monitoramento'}
              </button>

              <button
                onClick={exportToSheet}
                className="w-full py-3 px-4 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 mb-4"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>

              <button
                onClick={loadCustomers}
                className="w-full py-3 px-4 rounded-lg font-semibold bg-purple-500 hover:bg-purple-600 text-white mb-4"
              >
                Atualizar Dados
              </button>

              {newMentions > 0 && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-200">
                    {newMentions} cliente(s) elegível(is) para desconto!
                  </span>
                </div>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Configurações</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-blue-200 mb-2">Pontos por Post</label>
                  <input
                    type="number"
                    value={config.postPoints}
                    onChange={(e) => setConfig(prev => ({...prev, postPoints: parseInt(e.target.value)}))}
                    className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-blue-200 mb-2">Pontos por Story</label>
                  <input
                    type="number"
                    value={config.storyPoints}
                    onChange={(e) => setConfig(prev => ({...prev, storyPoints: parseInt(e.target.value)}))}
                    className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-blue-200 mb-2">Limite para Desconto</label>
                  <input
                    type="number"
                    value={config.discountThreshold}
                    onChange={(e) => setConfig(prev => ({...prev, discountThreshold: parseInt(e.target.value)}))}
                    className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <div className="p-6 border-b border-white/20">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Ranking de Clientes
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {customers
                    .sort((a, b) => b.points - a.points)
                    .map((customer, index) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">👤</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white">{customer.name}</h4>
                            <span className="text-blue-300 text-sm">{customer.username}</span>
                            <span className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full text-xs">
                              #{index + 1}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">
                            {customer.posts} posts • {customer.stories} stories • {customer.lastActivity}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="font-bold text-white">{customer.points}</span>
                        </div>
                        <div className={`text-sm px-2 py-1 rounded-full ${
                          customer.points >= config.discountThreshold 
                            ? 'bg-green-500/30 text-green-200' 
                            : 'bg-gray-500/30 text-gray-300'
                        }`}>
                          {getDiscountPercentage(customer.points)} desconto
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
