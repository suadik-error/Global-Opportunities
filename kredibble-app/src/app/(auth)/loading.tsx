import { useEffect, useRef } from 'react';
import { View, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { G, Rect, Defs, ClipPath } from 'react-native-svg';

const LogoSVG = () => (
  <Image 
    source={require('../../../assets/images/logo.png')} 
    style={{ width: 100, height: 100, borderRadius: 50 }} 
    resizeMode="contain" 
  />
);

export default function LoadingScreen() {
  const router = useRouter();
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F7F9', justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <LogoSVG />
      </Animated.View>
    </View>
  );
}
