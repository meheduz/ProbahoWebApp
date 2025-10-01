import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput, Button, Card, ActivityIndicator } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../contexts/AuthContext'
import { validatePhoneNumber, validatePIN } from '@probaho/shared'

export default function LoginScreen() {
  const navigation = useNavigation()
  const { login, isLoading } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pin, setPin] = useState('')
  const [errors, setErrors] = useState<{ phone?: string; pin?: string }>({})

  const validateForm = () => {
    const newErrors: { phone?: string; pin?: string } = {}

    if (!phoneNumber) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phone = 'Please enter a valid Bangladesh phone number'
    }

    if (!pin) {
      newErrors.pin = 'PIN is required'
    } else if (!validatePIN(pin)) {
      newErrors.pin = 'PIN must be 4-6 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    try {
      const success = await login({
        phoneNumber,
        pin,
      })

      if (!success) {
        Alert.alert('Login Failed', 'Invalid phone number or PIN. Please try again.')
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.')
    }
  }

  const handleRegister = () => {
    navigation.navigate('Register' as never)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo and Title */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>P</Text>
            </View>
            <Text style={styles.title}>Probaho</Text>
            <Text style={styles.subtitle}>Your Money, Your Control</Text>
          </View>

          {/* Login Form */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.formTitle}>Welcome Back</Text>
              <Text style={styles.formSubtitle}>Sign in to your account</Text>

              <TextInput
                label="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="01XXXXXXXXX"
                style={styles.input}
                error={!!errors.phone}
                mode="outlined"
                left={<TextInput.Affix text="+880" />}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

              <TextInput
                label="PIN"
                value={pin}
                onChangeText={setPin}
                secureTextEntry
                keyboardType="numeric"
                placeholder="Enter your PIN"
                style={styles.input}
                error={!!errors.pin}
                mode="outlined"
                maxLength={6}
              />
              {errors.pin && <Text style={styles.errorText}>{errors.pin}</Text>}

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <TouchableOpacity style={styles.forgotPinButton}>
                <Text style={styles.forgotPinText}>Forgot PIN?</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>

          {/* Register Link */}
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <Text style={styles.featuresTitle}>Why Choose Probaho?</Text>
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>• 80% lower fees than cash-out</Text>
              <Text style={styles.featureItem}>• Instant cross-MFS transfers</Text>
              <Text style={styles.featureItem}>• Bank-grade security</Text>
              <Text style={styles.featureItem}>• 24/7 availability</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 12,
  },
  loginButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  forgotPinButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPinText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  registerText: {
    color: '#6b7280',
    fontSize: 14,
    marginRight: 4,
  },
  registerLink: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  features: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  featureList: {
    alignItems: 'flex-start',
  },
  featureItem: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 4,
  },
})
