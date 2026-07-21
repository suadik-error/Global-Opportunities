import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { authStore, HirerSecuritySettings } from '../../constants/authStore';

export default function HirerSecurityScreen() {
  const router = useRouter();
  const [security, setSecurity] = useState<HirerSecuritySettings>(authStore.hirerSecurity);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => setSecurity({ ...authStore.hirerSecurity }));
    return unsubscribe;
  }, []);

  const handleToggle = (key: keyof HirerSecuritySettings) => {
    authStore.updateHirerSecurity({ [key]: !security[key] });
  };

  const handleUpdatePassword = () => {
    if (newPassword && newPassword === confirmPassword) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const isPasswordValid = currentPassword.length > 0 && newPassword.length > 0 && newPassword === confirmPassword;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <ChevronLeft size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} className="font-sans">Manage security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel} className="font-sans">Current password</Text>
          <TextInput
            style={styles.input} placeholder="Enter your current password" placeholderTextColor="#8A8D9F"
            secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} className="font-sans"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel} className="font-sans">New password</Text>
          <TextInput
            style={styles.input} placeholder="Enter your new password" placeholderTextColor="#8A8D9F"
            secureTextEntry value={newPassword} onChangeText={setNewPassword} className="font-sans"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel} className="font-sans">Confirm new password</Text>
          <TextInput
            style={styles.input} placeholder="Confirm your new password" placeholderTextColor="#8A8D9F"
            secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} className="font-sans"
          />
        </View>

        <TouchableOpacity
          style={[styles.updateButton, !isPasswordValid && styles.disabledButton]}
          onPress={handleUpdatePassword}
          disabled={!isPasswordValid}
          activeOpacity={0.8}
        >
          <Text style={[styles.updateButtonText, !isPasswordValid && styles.disabledButtonText]} className="font-sans">
            Update password
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionHeader} className="font-sans">Privacy Controls</Text>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel} className="font-sans">Show company profile publicly</Text>
          <Switch
            value={security.publicCompanyProfile}
            onValueChange={() => handleToggle('publicCompanyProfile')}
            trackColor={{ false: '#E5E6F2', true: '#6671E4' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E5E6F2"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F9' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
  },
  backButton: {
    width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#E5E6F2',
    backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  fieldGroup: { marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '500', color: '#1A1A1A', marginBottom: 8 },
  input: {
    height: 52, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E6F2',
    borderRadius: 12, paddingHorizontal: 16, fontSize: 14, color: '#1A1A1A',
  },
  updateButton: {
    height: 52, backgroundColor: '#6671E4', borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 32,
  },
  disabledButton: { backgroundColor: '#EBEBEE' },
  updateButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  disabledButtonText: { color: '#8A8D9F' },
  sectionHeader: { fontSize: 13, color: '#8A8D9F', fontWeight: '500', marginBottom: 12 },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EBEBEE',
  },
  toggleLabel: { fontSize: 13, fontWeight: '500', color: '#1A1A1A' },
});
