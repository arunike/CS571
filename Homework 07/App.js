import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import BadgerBakery from './src/components/BadgerBakery'

export default function App() {
  return <View style={styles.container}>
    <BadgerBakery/>
    <StatusBar style="auto" />
  </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
