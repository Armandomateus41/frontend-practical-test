import axios from 'axios'

interface SymbolInfo {
  symbol: string
}

interface ExchangeInfoResponse {
  symbols: SymbolInfo[]
}

export async function fetchAllSymbols(): Promise<string[]> {
  const resp = await axios.get<ExchangeInfoResponse>(
    'https://api.binance.com/api/v3/exchangeInfo'
  )
  return resp.data.symbols.map((s) => s.symbol)
}
