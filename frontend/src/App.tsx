import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  // Simple routing example
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/hello' element={<h1>Hello!</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
