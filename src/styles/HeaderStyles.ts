import { StyleSheet } from 'react-native';

export const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: 'lightblue',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    height: 56,
  },
  backButton: {
    marginRight: 16,
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 28,
    color: '#000000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
});