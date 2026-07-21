import { useState, useEffect } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { Tabs, useGlobalSearchParams } from 'expo-router';
import { Home, Compass, PlusCircle, Target, Users, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authStore } from '../../constants/authStore';

const TabIcon = ({ Icon, focused }: { Icon: any; focused: boolean }) => (
  <View style={{
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 4 : 0,
  }}>
    <Icon size={24} color="#FFFFFF" style={{ opacity: focused ? 1 : 0.65 }} />
    <View
      style={{
        width: 16,
        height: 3,
        backgroundColor: focused ? '#FFFFFF' : 'transparent',
        borderRadius: 1.5,
        marginTop: 5,
      }}
    />
  </View>
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 49 + insets.bottom : 56;
  const [role, setRole] = useState(authStore.role);
  const params = useGlobalSearchParams();
  const viewMode = params.view;

  useEffect(() => {
    return authStore.subscribe(() => {
      setRole(authStore.role);
    });
  }, []);

  const commonOptions = {
    headerShown: false,
    tabBarShowLabel: false,
    tabBarStyle: {
      backgroundColor: '#6671E4',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: 'rgba(255, 255, 255, 0.15)',
      height: TAB_BAR_HEIGHT,
      paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0,
      // Subtle shadow separating tab bar from content
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 8,
    },
    tabBarActiveTintColor: '#FFFFFF',
    tabBarInactiveTintColor: '#FFFFFF',
  };

  if (role === 'hirer') {
    return (
      <Tabs screenOptions={commonOptions}>
        <Tabs.Screen
          name="index"
          options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} /> }}
        />
        <Tabs.Screen
          name="career"
          options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={Target} focused={focused} /> }}
        />
        <Tabs.Screen
          name="opportunities"
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('opportunities', { view: undefined });
            },
          })}
          options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={PlusCircle} focused={viewMode === 'all' ? false : focused} /> }}
        />
        <Tabs.Screen
          name="community"
          options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={Users} focused={focused} /> }}
        />
        <Tabs.Screen
          name="profile"
          options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} /> }}
        />
      </Tabs>
    );
  }

  // Seeker role (Find Opportunities)
  return (
    <Tabs screenOptions={commonOptions}>
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} /> }}
      />
      <Tabs.Screen
        name="opportunities"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={Compass} focused={focused} /> }}
      />
      <Tabs.Screen
        name="career"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={Target} focused={focused} /> }}
      />
      <Tabs.Screen
        name="community"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={Users} focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} /> }}
      />
    </Tabs>
  );
}
