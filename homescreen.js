import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StatusBar
} from 'react-native';
import { MomentsContext } from '../context/MomentsContext';
import { AuthContext } from '../context/AuthContext';
import { colors, spacing, borderRadius, fontSize } from '../styles/theme';
import MomentCard from '../components/MomentCard';

const HomeScreen = ({ navigation }) => {
  const { moments, loading } = useContext(MomentsContext);
  const { user } = useContext(AuthContext);
  
  const activeMoments = moments.filter(m => m.status === 'in-progress' || !m.status);
  const completedMoments = moments.filter(m => m.status === 'completed');
  const mintedNFTs = moments.filter(m => m.nftMinted);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading your moments...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <ScrollView>
        {/* Create New Moment Section */}
        <TouchableOpacity 
          style={styles.createSection}
          onPress={() => navigation.navigate('Create')}
        >
          <View style={styles.createIconContainer}>
            <Text style={styles.createIcon}>+</Text>
          </View>
          <View style={styles.createTextContainer}>
            <Text style={styles.createTitle}>Create New Moment</Text>
            <Text style={styles.createSubtitle}>Capture and verify your special experiences</Text>
          </View>
        </TouchableOpacity>
        
        {/* Recent Moments Section */}
        <Text style={styles.sectionTitle}>Recent Moments</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.momentsContainer}
        >
          {moments.map(moment => (
            <MomentCard 
              key={moment.id} 
              moment={moment} 
              onPress={() => navigation.navigate('MomentDetails', { momentId: moment.id })}
            />
          ))}
        </ScrollView>
        
        {/* Status Bar */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {activeMoments.length} Active Moments • {completedMoments.length} Completed • {mintedNFTs.length} NFTs Minted
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createSection: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.promise,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.promiseBorder,
  },
  createIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  createIcon: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
  },
  createTextContainer: {
    flex: 1,
  },
  createTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  createSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  momentsContainer: {
    paddingHorizontal: spacing.md,
  },
  statusContainer: {
    borderTopWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  statusText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});

export default HomeScreen;