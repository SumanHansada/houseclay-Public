import "./App.css";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { routes } from "./routes";
import MainLayout from "./components/layout/MainLayout";
import Login from "./components/signin/Login";
import Notfound from "./components/common/Notfound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {routes}
      </Route>
      <Route path="/login" element={<Login />}></Route>

      <Route path="*" element={<Notfound />}></Route>
    </Routes>
  );
}

export default App;
