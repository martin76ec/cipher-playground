import { StyleSheet } from 'react-native';
import { ThemeProvider } from './src/providers';
import { Navigator } from './src/components/Navigation';


export default function App() {
  const t = 'This text in bits is:';

  return (
    <ThemeProvider>
      <Navigator></Navigator>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
