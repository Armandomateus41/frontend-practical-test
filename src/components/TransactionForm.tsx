import React, { useState, useContext, useMemo, useEffect } from 'react'
import { TransactionContext } from '../context/TransactionContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const TransactionForm = () => {
  const {
    symbols,
    addSymbols,
    watchList,
    isLoadingSymbols,
    hasSymbolLoadError,
  } = useContext(TransactionContext)

  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')

  // Exibe toast de erro uma vez se a API da Binance falhar
  useEffect(() => {
    if (hasSymbolLoadError) {
      toast.error('Failed to load symbols from Binance. Try again later.')
    }
  }, [hasSymbolLoadError])

  const filtered = useMemo(() => {
    return symbols
      .filter((sym) => sym.toLowerCase().includes(search.toLowerCase()))
      .filter((sym) => !watchList.includes(sym))
      .sort()
  }, [symbols, search, watchList])

  const toggleSymbol = (symbol: string) => {
    setSelected((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    )
  }

  const handleAddToList = () => {
    if (selected.length === 0) {
      toast.error('Please select at least one symbol.')
      return
    }

    addSymbols(selected)
    toast.success(`${selected.length} symbol(s) added to the watch list.`)
    setSelected([])
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Select Symbols</h2>

      {hasSymbolLoadError ? (
        <div className="text-red-600 font-medium">
          Error loading symbols from Binance API. Please try again later.
        </div>
      ) : isLoadingSymbols ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-600 dark:text-gray-300">
          <motion.div
            className="h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          />
          <p className="mt-3">Loading symbols...</p>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search symbols"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border p-2 mb-4 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />

          <div className="h-64 overflow-y-scroll border p-2 rounded dark:border-gray-600">
            {filtered.length === 0 ? (
              <p className="text-gray-500 italic dark:text-gray-400">
                No symbols found.
              </p>
            ) : (
              filtered.map((symbol) => (
                <label key={symbol} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={selected.includes(symbol)}
                    onChange={() => toggleSymbol(symbol)}
                    className="mr-2"
                  />
                  {symbol}
                </label>
              ))
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToList}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add to List
          </motion.button>
        </>
      )}
    </div>
  )
}

export default TransactionForm
