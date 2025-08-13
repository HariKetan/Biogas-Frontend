import { createGlobalStyle } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

// Define a global style for the background and header color
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f0f8ef ;
    margin: 0;
    padding: 0;
  }

  /* Change the header color to white */
  header {
    background-color: white;
    /* Add additional styles as needed */
  }
`;

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <GlobalStyle />
          <ScrollToTop />
          <StyledChart />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
