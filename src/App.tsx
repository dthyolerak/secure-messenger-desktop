import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './app/store';
import { checkSession } from './app/slices/authSlice';
import Welcome from './pages/Welcome';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    void dispatch(checkSession());
  }, [dispatch]);

  return <Welcome />;
};

export default App;
