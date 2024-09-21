import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameLog from './pages/GameLog';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './layouts/MainLayout';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import GameAnalysis from './components/GameAnalysis';
import ValLog from './components/ValLog'
import ValAnalysis from './components/ValAnalysis'
import './index.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="gamelog" element={<GameLog />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="analysis" element={<GameAnalysis />} />
      <Route path="val-log" element={<ValLog />} />
      <Route path="val-analysis" element={<ValAnalysis />} />
    </Route>
  )
);

const App = () => {
  return (
    <> 
      <RouterProvider router={router} />
    </>
  );
};

export default App;
