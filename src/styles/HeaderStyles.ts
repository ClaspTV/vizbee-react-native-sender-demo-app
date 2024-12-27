import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export const headerStyles = StyleSheet.create({
    header: {
      backgroundColor: Colors.headerBackground,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      height: 56,
    },
    backButton: {
      marginRight: 16,
      padding: 4,
    },
    backArrow: {
      fontSize: 24,
      color: Colors.text.primary,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: Colors.text.primary,
    },
  });