import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { JOBS_DATA, JobCard } from '../jobs/index';
import { INTERNSHIPS_DATA, InternshipCard } from '../internships/index';

export default function RecommendedScreen() {
  const router = useRouter();

  // Combine jobs and internships for the recommended list.
  // We take a mix of top matching opportunities to simulate CV matching.
  const recommendedJobs = JOBS_DATA.slice(0, 2);
  const recommendedInternships = INTERNSHIPS_DATA.slice(0, 2);

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
        <Text style={styles.headerTitle} className="font-sans">Recommended for you</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.infoBanner}>
        <Sparkles size={16} color="#16A34A" />
        <Text style={styles.infoText} className="font-sans">
          These opportunities strongly match your profile and CV data.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle} className="font-sans">Jobs</Text>
        {recommendedJobs.map((job) => (
          <JobCard 
            key={job.id} 
            job={job} 
            onPress={() => router.push({ pathname: '/jobs/[id]', params: { id: job.id } })} 
          />
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 12 }]} className="font-sans">Internships</Text>
        {recommendedInternships.map((internship) => (
          <InternshipCard 
            key={internship.id} 
            item={internship} 
            onPress={() => router.push({ pathname: '/internships/[id]', params: { id: internship.id } })} 
          />
        ))}
        
      </ScrollView>
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '500',
    lineHeight: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  }
});
