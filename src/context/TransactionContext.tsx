import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import axios from 'axios'

export type PriceData = {
  lastPrice: string
  bidPrice: string
  askPrice: string
  priceChangePercent: string
}

type TransactionContextType = {
  symbols: string[]
  watchList: string[]
  prices: Record<string, PriceData>
  isLoadingSymbols: boolean
  hasSymbolLoadError: boolean
  addSymbols: (newSyms: string[]) => void
  removeSymbol: (sym: string) => void
  clearWatchList: () => void
}

export const TransactionContext = createContext<TransactionContextType>({
  symbols: [],
  watchList: [],
  prices: {},
  isLoadingSymbols: false,
  hasSymbolLoadError: false,
  addSymbols: () => {},
  removeSymbol: () => {},
  clearWatchList: () => {},
})

export default function TransactionProvider({ children }: { children: ReactNode }) {
  const [symbols, setSymbols] = useState<string[]>([])
  const [watchList, setWatchList] = useState<string[]>([])
  const [prices, setPrices] = useState<Record<string, PriceData>>({})
  const [isLoadingSymbols, setIsLoadingSymbols] = useState(true)
  const [hasSymbolLoadError, setHasSymbolLoadError] = useState(false)

  // Carregar watchList do localStorage no início
  useEffect(() => {
    const stored = localStorage.getItem('watchList')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setWatchList(parsed)
        }
      } catch (e) {
        console.warn('Failed to parse watchList from localStorage:', e)
      }
    }
  }, [])

  // Salvar watchList no localStorage a cada mudança
  useEffect(() => {
    localStorage.setItem('watchList', JSON.stringify(watchList))
  }, [watchList])

  useEffect(() => {
    axios
      .get('https://api.binance.com/api/v3/exchangeInfo')
      .then((res) => {
        const all = res.data.symbols.map((s: any) => s.symbol)
        setSymbols(all)
        setHasSymbolLoadError(false)
      })
      .catch((err) => {
        console.error('Erro ao carregar símbolos:', err)
        setHasSymbolLoadError(true)
      })
      .finally(() => setIsLoadingSymbols(false))
  }, [])

  useEffect(() => {
    if (watchList.length === 0) return

    const streams = watchList
      .map((s) => s.toLowerCase())
      .map((s) => `${s}@ticker`)
      .join('/')

    const ws = new WebSocket(
      `wss://data-stream.binance.com/stream?streams=${streams}`
    )

    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data)
      const data = msg.data
      setPrices((prev) => ({
        ...prev,
        [data.s]: {
          lastPrice: data.c,
          bidPrice: data.b,
          askPrice: data.a,
          priceChangePercent: data.P,
        },
      }))
    }

    return () => {
      ws.close()
    }
  }, [watchList])

  const addSymbols = useCallback((newSyms: string[]) => {
    setWatchList((prev) => Array.from(new Set([...prev, ...newSyms])))
  }, [])

  const removeSymbol = useCallback((sym: string) => {
    setWatchList((prev) => prev.filter((s) => s !== sym))
    setPrices((prev) => {
      const copy = { ...prev }
      delete copy[sym]
      return copy
    })
  }, [])

  const clearWatchList = useCallback(() => {
    setWatchList([])
    setPrices({})
    localStorage.removeItem('watchList')
  }, [])

  return (
    <TransactionContext.Provider
      value={{
        symbols,
        watchList,
        prices,
        isLoadingSymbols,
        hasSymbolLoadError,
        addSymbols,
        removeSymbol,
        clearWatchList,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
