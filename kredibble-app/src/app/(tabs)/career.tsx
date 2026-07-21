import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, Star, Check, Users, Sparkles, X } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, FontSize, FontWeight, Radius, Shadow } from '../../constants/design';
import { mockExperts, Expert } from '../../constants/mockExperts';
import { authStore } from '../../constants/authStore';

// ─── Logo ─────────────────────────────────────────────────────────────────────
const LogoSVG = () => (
  <Image
    source={require('../../../assets/images/logo.png')}
    style={{ width: 40, height: 40, borderRadius: 20 }}
    resizeMode="contain"
  />
);

// ─── Star Rating Component ────────────────────────────────────────────────────
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={14}
        color={i <= rating ? '#F6B612' : '#C4C4C4'}
        fill={i <= rating ? '#F6B612' : 'transparent'}
        style={{ marginRight: 2 }}
      />
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontSize: 13, color: Colors.textMuted, marginRight: 6, fontWeight: '500' }} className="font-sans">
        {rating.toFixed(1)}
      </Text>
      {stars}
    </View>
  );
};

// ─── Expert Card Component ────────────────────────────────────────────────────
const ExpertCard = ({ expert, onPress }: { expert: Expert; onPress: () => void }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        {/* Profile Image */}
        <Image
          source={{ uri: expert.image }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: Colors.bgAlt,
            marginRight: 12,
          }}
        />

        {/* Content Column */}
        <View style={{ flex: 1 }}>
          {/* Name, Title and Verified Check */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 4 }}>
            <Text style={{ fontSize: 13, color: Colors.textHeading, fontWeight: FontWeight.medium, flexShrink: 1 }} className="font-sans">
              {expert.name}
              <Text style={{ color: Colors.textMuted, fontWeight: FontWeight.regular }}> · {expert.profession}</Text>
            </Text>
            
            {expert.verified && (
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#16A34A',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 6,
                }}
              >
                <Check size={10} color="#FFFFFF" strokeWidth={3} />
              </View>
            )}
          </View>

          {/* Education / University */}
          <Text style={{ fontSize: 13, color: Colors.textMuted, marginTop: 2, fontWeight: '400' }} className="font-sans">
            {expert.education[0]?.institution || 'University of Ghana'}
          </Text>

          {/* Short Bio */}
          <Text
            numberOfLines={2}
            style={{ fontSize: 13, color: Colors.textMuted, marginTop: 8, lineHeight: 18, fontWeight: '400' }}
            className="font-sans"
          >
            {expert.bio}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: Colors.borderDefault, marginVertical: 12 }} />

      {/* Footer (Rating & Country) */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <StarRating rating={expert.rating} />
        <Text style={{ fontSize: 12, color: Colors.textMuted }} className="font-sans">
          {expert.country}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function CareerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    query?: string;
    city?: string;
    profession?: string;
    experience?: string;
    rating?: string;
    country?: string;
  }>();

  const [role, setRole] = useState(authStore.role);
  const [candidates, setCandidates] = useState(authStore.candidates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedCandId, setSelectedCandId] = useState<string | null>(null);

  useEffect(() => {
    setRole(authStore.role);
    setCandidates([...authStore.candidates]);

    const unsubscribe = authStore.subscribe(() => {
      setRole(authStore.role);
      setCandidates([...authStore.candidates]);
    });
    return unsubscribe;
  }, []);

  const handleInviteCandidate = (name: string) => {
    alert(`Success: Sent application invite to ${name}!`);
  };



  // Filter experts based on query parameters
  const filteredExperts = mockExperts.filter(expert => {
    // 1. Text Query (Search)
    if (params.query) {
      const q = params.query.toLowerCase();
      const matchesName = expert.name.toLowerCase().includes(q);
      const matchesProfession = expert.profession.toLowerCase().includes(q);
      const matchesBio = expert.bio.toLowerCase().includes(q);
      if (!matchesName && !matchesProfession && !matchesBio) return false;
    }

    // 2. City
    if (params.city) {
      const c = params.city.toLowerCase();
      if (!expert.city.toLowerCase().includes(c) && !expert.location.toLowerCase().includes(c)) return false;
    }

    // 3. Profession (Multi-select)
    if (params.profession) {
      const list = params.profession.split(',');
      if (!list.includes(expert.profession)) return false;
    }

    // 4. Experience Level (Multi-select)
    if (params.experience) {
      const list = params.experience.split(',');
      if (!list.includes(expert.experienceLevel)) return false;
    }

    // 5. Rating (Multi-select)
    if (params.rating) {
      const list = params.rating.split(',').map(Number);
      if (!list.includes(Math.floor(expert.rating))) return false;
    }

    // 6. Country (Multi-select)
    if (params.country) {
      const list = params.country.split(',');
      if (!list.includes(expert.country)) return false;
    }

    return true;
  });

  // Calculate active filter count
  const getFilterCount = () => {
    let count = 0;
    if (params.city) count += 1;
    if (params.profession) count += params.profession.split(',').length;
    if (params.experience) count += params.experience.split(',').length;
    if (params.rating) count += params.rating.split(',').length;
    if (params.country) count += params.country.split(',').length;
    return count;
  };

  const filterCount = getFilterCount();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgScreen }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 12,
        }}
      >
        <LogoSVG />
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: FontSize.screenTitle,
            fontWeight: FontWeight.semibold,
            color: Colors.textHeading,
            marginRight: 40,
          }}
          className="font-sans"
        >
          Expert listing
        </Text>
      </View>

      {/* Main List */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar / Filter trigger */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/experts/search')}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.white,
              borderRadius: Radius.searchBar,
              paddingHorizontal: 16,
              height: 50,
              ...Shadow.searchBar,
            }}
          >
            <Search size={18} color={Colors.textPlaceholder} style={{ marginRight: 10 }} />
            <Text style={{ flex: 1, fontSize: 13, color: Colors.textPlaceholder }} className="font-sans">
              {params.query || 'Search for experts'}
            </Text>

            {/* If filters are active, show a badge next to the filter icon */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push({
                pathname: '/experts/filter',
                params: params // pass current filters down
              })}
              style={{
                width: 32,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <SlidersHorizontal size={18} color={Colors.primary} />
              {filterCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    backgroundColor: Colors.primary,
                    borderRadius: 9,
                    minWidth: 18,
                    height: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ color: Colors.white, fontSize: 10, fontWeight: 'bold' }} className="font-sans">
                    {filterCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Selected Filter Chips (if any) */}
        {filterCount > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {params.query && (
              <View style={{ backgroundColor: Colors.primaryChip, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full }}>
                <Text style={{ fontSize: 12, color: Colors.primary, fontWeight: '500' }}>Search: {params.query}</Text>
              </View>
            )}
            {params.city && (
              <View style={{ backgroundColor: Colors.primaryChip, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full }}>
                <Text style={{ fontSize: 12, color: Colors.primary, fontWeight: '500' }}>City: {params.city}</Text>
              </View>
            )}
            {params.profession && (
              <View style={{ backgroundColor: Colors.primaryChip, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full }}>
                <Text style={{ fontSize: 12, color: Colors.primary, fontWeight: '500' }}>Profession ({params.profession.split(',').length})</Text>
              </View>
            )}
            {params.experience && (
              <View style={{ backgroundColor: Colors.primaryChip, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full }}>
                <Text style={{ fontSize: 12, color: Colors.primary, fontWeight: '500' }}>Exp: {params.experience}</Text>
              </View>
            )}
            {params.rating && (
              <View style={{ backgroundColor: Colors.primaryChip, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full }}>
                <Text style={{ fontSize: 12, color: Colors.primary, fontWeight: '500' }}>Rating: {params.rating}★</Text>
              </View>
            )}
            {params.country && (
              <View style={{ backgroundColor: Colors.primaryChip, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full }}>
                <Text style={{ fontSize: 12, color: Colors.primary, fontWeight: '500' }}>Country ({params.country.split(',').length})</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => router.replace('/career')}
              style={{ paddingHorizontal: 12, paddingVertical: 6 }}
            >
              <Text style={{ fontSize: 12, color: Colors.error, fontWeight: '600' }}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Expert Cards */}
        {filteredExperts.length > 0 ? (
          filteredExperts.map(expert => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              onPress={() => router.push(`/experts/${expert.id}`)}
            />
          ))
        ) : (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 14, color: Colors.textMuted }} className="font-sans">
              No experts match your filters.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
