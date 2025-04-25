import React, { useContext, useEffect, useState } from 'react'
import { TransactionContext } from '../context/TransactionContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const Toolbar = () => {
  const { watchList, prices } = useContext(TransactionContext)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success('Back online')
    }
    const handleOffline = () => {
      setIsOnline(false)
      toast.error('You are offline')
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const handleExportJSON = () => {
    const data = watchList.map((symbol) => ({
      symbol,
      ...prices[symbol],
    }))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'watchlist.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportCSV = () => {
    const headers = ['symbol', 'lastPrice', 'bidPrice', 'askPrice', 'priceChangePercent']
    const rows = watchList.map((symbol) => {
      const p = prices[symbol]
      return [symbol, p?.lastPrice, p?.bidPrice, p?.askPrice, p?.priceChangePercent].join(',')
    })
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'watchlist.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      className="flex justify-between items-center mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExportJSON}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export JSON
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExportCSV}
          className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Export CSV
        </motion.button>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-500'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDarkMode((prev) => !prev)}
          className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Toolbar
