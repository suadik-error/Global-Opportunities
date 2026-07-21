import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulate checking user state, then route after 5 seconds
    const timer = setTimeout(() => {
      // For now, always route to onboarding. 
      // In a real app, check if user is new or existing.
      router.replace('/(onboarding)/1');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 bg-[#F5F5F5] items-center justify-center">
      <Image
        source={require('../../assets/images/logo_light.png')}
        style={{ width: 70, height: 70 }}
        resizeMode="contain"
      />
    </View>
  );
}
