import React from 'react'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import Toolbar from './components/Toolbar'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-4 transition-colors">
      <h1 className="text-2xl font-bold mb-4">Binance WebSocket Ticker</h1>
      <Toolbar />
      <TransactionForm />
      <TransactionList />
      <Toaster position="top-right" />
    </div>
  )
}

export default App
