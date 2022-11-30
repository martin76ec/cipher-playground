import { Provider as PaperProvider } from 'react-native-paper';

const ThemeProvider = ({ children }: any) => {
  return (
    <PaperProvider>{children}</PaperProvider>
  );
};

export { ThemeProvider };