import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Modal, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, X } from 'lucide-react-native';
import { profileStore, SecuritySettings } from '../../constants/mockProfile';

export default function ManageSecurityScreen() {
  const router = useRouter();
  const [security, setSecurity] = useState<SecuritySettings>(profileStore.security);
  const [deleteVisible, setDeleteVisible] = useState(false);

  // Form password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const unsubscribe = profileStore.subscribe(() => {
      setSecurity({ ...profileStore.security });
    });
    return unsubscribe;
  }, []);

  const handleToggle = (key: keyof SecuritySettings) => {
    profileStore.updateSecurity({ [key]: !security[key] });
  };

  const handleUpdatePassword = () => {
    if (newPassword && newPassword === confirmPassword) {
      console.log('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleDeleteAccount = () => {
    setDeleteVisible(false);
    profileStore.deleteAccount();
    // Redirect to login or onboarding
    router.replace('/');
  };

  const isPasswordValid = currentPassword.length > 0 && newPassword.length > 0 && newPassword === confirmPassword;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} className="font-sans">Manage security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Passwords */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel} className="font-sans">Current password</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter your current password"
            placeholderTextColor="#8A8D9F"
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            className="font-sans"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel} className="font-sans">New password</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter your new password"
            placeholderTextColor="#8A8D9F"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
            className="font-sans"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel} className="font-sans">Confirm new password</Text>
          <TextInput 
            style={styles.input}
            placeholder="Confirm your new password"
            placeholderTextColor="#8A8D9F"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            className="font-sans"
          />
        </View>

        {/* Update Password Button */}
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

        {/* Privacy Controls Header */}
        <Text style={styles.sectionHeader} className="font-sans">Privacy Controls</Text>
        
        {/* Toggle Option */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel} className="font-sans">Show profile to recruiters</Text>
          <Switch
            value={security.showProfileToRecruiters}
            onValueChange={() => handleToggle('showProfileToRecruiters')}
            trackColor={{ false: '#E5E6F2', true: '#6671E4' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E5E6F2"
          />
        </View>

      </ScrollView>

      {/* Delete Account bottom option */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => setDeleteVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteButtonText} className="font-sans">Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle} className="font-sans">Delete account</Text>
            <Text style={styles.modalSubtitle} className="font-sans">Are you sure you want to Delete your account?</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setDeleteVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText} className="font-sans">No, keep it</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmDeleteButton} 
                onPress={handleDeleteAccount}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmDeleteText} className="font-sans">Yes, delete!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E5E6F2',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E6F2',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1A1A1A',
  },
  updateButton: {
    height: 52,
    backgroundColor: '#6671E4',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  disabledButton: {
    backgroundColor: '#EBEBEE',
  },
  updateButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: '#8A8D9F',
  },
  sectionHeader: {
    fontSize: 13,
    color: '#8A8D9F',
    fontWeight: '500',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEE',
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  deleteButton: {
    height: 52,
    backgroundColor: '#FFEAEA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ED4C5C',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#8A8D9F',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  confirmDeleteButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#ED4C5C',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmDeleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
