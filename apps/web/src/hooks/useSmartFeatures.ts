'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'

export function useSmartFeatures() {
  const [features, setFeatures] = useState({
    quickSend: [] as string[],
    frequentAmounts: [] as number[],
    preferredMFS: '',
    smartSuggestions: [] as string[]
  })

  useEffect(() => {
    const transactions = storage.getTransactions()
    
    // Analyze frequent recipients
    const recipients = transactions
      .filter(tx => tx.type === 'debit' && tx.account)
      .reduce((acc, tx) => {
        acc[tx.account!] = (acc[tx.account!] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    
    const quickSend = Object.entries(recipients)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([phone]) => phone)

    // Analyze frequent amounts
    const amounts = transactions
      .filter(tx => tx.type === 'debit')
      .map(tx => tx.amount)
      .reduce((acc, amount) => {
        acc[amount] = (acc[amount] || 0) + 1
        return acc
      }, {} as Record<number, number>)
    
    const frequentAmounts = Object.entries(amounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([amount]) => Number(amount))

    // Determine preferred MFS
    const mfsUsage = transactions
      .filter(tx => tx.mfsProvider)
      .reduce((acc, tx) => {
        acc[tx.mfsProvider!] = (acc[tx.mfsProvider!] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    
    const preferredMFS = Object.entries(mfsUsage)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || ''

    // Generate smart suggestions
    const suggestions = []
    if (quickSend.length > 0) suggestions.push('Quick send to frequent contacts')
    if (frequentAmounts.length > 0) suggestions.push('Use common amounts')
    if (preferredMFS) suggestions.push(`Prefer ${preferredMFS} for lower fees`)

    setFeatures({
      quickSend,
      frequentAmounts,
      preferredMFS,
      smartSuggestions: suggestions
    })
  }, [])

  return features
}