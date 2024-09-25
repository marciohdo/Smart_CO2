import GlobalStyles from "./styles/GlobalStyles";
import { light } from "./styles/Themes";
import { ThemeProvider } from "styled-components";
import Navigation from "./components/Navigation";
import About from "./components/sections/About";
import Home from "./components/sections/Home";
import Roadmap from "./components/sections/Roadmap";
import Team from "./components/sections/Team";
//import Sales from "./components/sections/Sales";
import Footer from "./components/Footer";
import Showcase from "./components/sections/Showcase";
import Faq from "./components/sections/Faq";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <main>
      <GlobalStyles />
      <ThemeProvider theme={light}>
        {/* <Suspense fallback={<Loading />}> */}
          <Navigation />
          <Home />
          <About />
          <Roadmap />
          <Showcase />
          <Team /> 
          <Faq />
          <Footer />
          {/* <ScrollToTop scrollPosition={y}/> */}
          <ScrollToTop />{" "}
        {/* </Suspense> */}
      </ThemeProvider>
    </main>
  );
}

export default App;
