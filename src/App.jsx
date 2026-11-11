import Content from "./Components/Content";
import Footer from "./Components/Footer";
import Revelar from "./Components/Revelar";

function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Content />
      <Revelar>
        <Footer />
      </Revelar>
    </div>
  );
}

export default App;