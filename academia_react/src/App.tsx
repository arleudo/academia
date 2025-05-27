import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Home } from "./pages/Home";
import { FullStackAppBar } from "./components/FullStackAppBar";
import { Users } from "./pages/Users";
import { Payments } from "./pages/Payments";

function Layout() {
  return (
    <>
    <FullStackAppBar />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/alunos" Component={Users} />
        <Route path="/pagamentos" Component={Payments} />
      </Routes>
      <Toaster />
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
