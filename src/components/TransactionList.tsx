// src/components/TransactionList.tsx

import React, { useContext } from 'react'
import { TransactionContext } from '../context/TransactionContext'
import toast from 'react-hot-toast'

const TransactionList = () => {
  const { watchList, prices, removeSymbol, clearWatchList } = useContext(TransactionContext)

  const handleRemove = (symbol: string) => {
    removeSymbol(symbol)
    toast.success(`${symbol} removed from the watch list.`)
  }

  const handleClearAll = () => {
    clearWatchList()
    toast.success('All symbols cleared.')
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Selected Symbols</h2>
        {watchList.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear List
          </button>
        )}
      </div>

      {watchList.length === 0 ? (
        <p className="text-gray-500 italic">No symbols added yet.</p>
      ) : (
        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2">Symbol</th>
              <th className="p-2">Last Price</th>
              <th className="p-2">Bid</th>
              <th className="p-2">Ask</th>
              <th className="p-2">Change (%)</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {watchList.map((symbol) => {
              const data = prices[symbol]

              return (
                <tr key={symbol} className="border-t hover:bg-gray-50">
                  <td className="p-2 font-medium">{symbol}</td>
                  <td className="p-2">{data?.lastPrice || '-'}</td>
                  <td className="p-2">{data?.bidPrice || '-'}</td>
                  <td className="p-2">{data?.askPrice || '-'}</td>
                  <td className="p-2 font-medium">
                    {data?.priceChangePercent ? (
                      <span
                        className={
                          parseFloat(data.priceChangePercent) >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        {parseFloat(data.priceChangePercent).toFixed(2)}%
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleRemove(symbol)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TransactionList
