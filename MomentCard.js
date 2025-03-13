import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../styles/theme';
import { formatDistanceToNow } from 'date-fns';

const MomentCard = ({ moment, onPress }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'wedding': return colors.wedding;
      case 'trip': return colors.trip;
      case 'challenge': return colors.challenge;
      default: return colors.primary;
    }
  };
  
  const getTimeText = () => {
    if (moment.status === 'in-progress') {
      const endDate = new Date(moment.endDate);
      const daysRemaining = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
      return `${daysRemaining} days remaining`;
    } else if (moment.date) {
      const date = new Date(moment.date);
      if (Date.now() - date.getTime() < 14 * 24 * 60 * 60 * 1000) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else {
        return date.toLocaleDateString();
      }
    }
    return '';
  };
  
  const getParticipantsText = () => {
    if (!moment.participants || moment.participants.length === 0) return '';
    
    if (moment.participants.length === 1) {
      return `With ${moment.participants[0].name}`;
    } else {
      return `With ${moment.participants.length} ${moment.participants.length === 1 ? 'Friend' : 'Friends'}`;
    }
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.imageContainer, { backgroundColor: getTypeColor(moment.type) }]}>
        {moment.photos && moment.photos.length > 0 ? (
          <Image 
            source={{ uri: moment.photos[0] }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{moment.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {getParticipantsText()} • {getTimeText()}
        </Text>
        
        {moment.nftMinted ? (
          <View style={styles.nftBadge}>
            <Text style={styles.nftText}>NFT</Text>
          </View>
        ) : moment.status === 'in-progress' ? (
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>In Progress</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 220,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 120,
    width: '100%',
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: spacing.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  nftBadge: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nftText: {
    fontSize: fontSize.xs,
    color: 'white',
    fontWeight: 'bold',
  },
  progressBadge: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.sm,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.inProgress,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: fontSize.xs,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MomentCard;