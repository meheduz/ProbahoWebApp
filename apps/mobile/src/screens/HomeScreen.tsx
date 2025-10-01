import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, FAB, Avatar, Chip } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Wallet, Transaction, MFSProvider } from '@probaho/shared'
import { formatCurrency, getRelativeTime, getMFSProviderName, getMFSProviderColor } from '@probaho/shared'

const { width } = Dimensions.get('window')

export default function HomeScreen() {
  const navigation = useNavigation()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setWallet({
        id: '1',
        userId: '1',
        balance: 15750.50,
        currency: 'BDT',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      setRecentTransactions([
        {
          id: '1',
          userId: '1',
          type: 'credit',
          amount: 5000,
          currency: 'BDT',
          status: 'completed',
          description: 'Received from bKash',
          mfsProvider: 'bkash',
          createdAt: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
          id: '2',
          userId: '1',
          type: 'debit',
          amount: 2500,
          currency: 'BDT',
          status: 'completed',
          description: 'Sent to Rocket',
          recipientMfs: 'rocket',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
        }
      ])
      
      setIsLoading(false)
    }, 1000)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchWalletData()
    setRefreshing(false)
  }

  const quickActions = [
    {
      id: 'send',
      title: 'Send Money',
      icon: 'send',
      color: '#3b82f6',
      onPress: () => navigation.navigate('Send' as never)
    },
    {
      id: 'add',
      title: 'Add Money',
      icon: 'add-circle',
      color: '#22c55e',
      onPress: () => navigation.navigate('AddMoney' as never)
    },
    {
      id: 'qr',
      title: 'QR Payment',
      icon: 'qr-code',
      color: '#8b5cf6',
      onPress: () => console.log('QR Payment')
    },
    {
      id: 'bills',
      title: 'Pay Bills',
      icon: 'receipt',
      color: '#f59e0b',
      onPress: () => console.log('Pay Bills')
    }
  ]

  const mfsProviders: MFSProvider[] = ['bkash', 'rocket', 'nagad', 'upay', 'tapp', 'mycash']

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.userName}>Welcome back</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
            <Avatar.Icon size={40} icon="account" />
          </TouchableOpacity>
        </View>

        {/* Wallet Balance Card */}
        <Card style={styles.balanceCard}>
          <Card.Content>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Probaho Balance</Text>
              <TouchableOpacity>
                <Ionicons name="eye-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceAmount}>
              {wallet ? formatCurrency(wallet.balance) : '••••••'}
            </Text>
            <Text style={styles.balanceSubtext}>Available Balance</Text>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionButton, { backgroundColor: action.color }]}
                onPress={action.onPress}
              >
                <Ionicons name={action.icon as any} size={24} color="white" />
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Supported MFS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Supported MFS Providers</Text>
          <View style={styles.mfsProviders}>
            {mfsProviders.map((provider) => (
              <Chip
                key={provider}
                style={[styles.mfsChip, { backgroundColor: getMFSProviderColor(provider) }]}
                textStyle={styles.mfsChipText}
              >
                {getMFSProviderName(provider)}
              </Chip>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History' as never)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentTransactions.map((transaction) => (
            <Card key={transaction.id} style={styles.transactionCard}>
              <Card.Content>
                <View style={styles.transactionRow}>
                  <View style={styles.transactionLeft}>
                    <View style={[
                      styles.transactionIcon,
                      { backgroundColor: transaction.type === 'credit' ? '#22c55e' : '#ef4444' }
                    ]}>
                      <Ionicons
                        name={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                        size={20}
                        color="white"
                      />
                    </View>
                    <View>
                      <Text style={styles.transactionDescription}>
                        {transaction.description}
                      </Text>
                      <Text style={styles.transactionTime}>
                        {getRelativeTime(transaction.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    { color: transaction.type === 'credit' ? '#22c55e' : '#ef4444' }
                  ]}>
                    {transaction.type === 'credit' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Send' as never)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  balanceCard: {
    margin: 16,
    backgroundColor: '#2563eb',
    borderRadius: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 48) / 2,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  mfsProviders: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mfsChip: {
    marginBottom: 8,
  },
  mfsChipText: {
    color: 'white',
    fontSize: 12,
  },
  transactionCard: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  transactionTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2563eb',
  },
})
