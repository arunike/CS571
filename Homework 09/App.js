
// Keep this here!
import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import BadgerChat from './src/components/BadgerChat';

export default function App() {
  return (
    <>
      <BadgerChat/>
      <StatusBar style="auto" />
    </>
  );
}