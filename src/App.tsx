import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import Homepage from './pages/home/Homepage';
import Loginpage from './pages/login/Loginpage';
import Registerpage from './pages/register/Registerpage';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import Breederpage from './pages/breeder/Breederpage';
import Inboxpage from './pages/inbox/Inboxpage';
import Favoritespage from './pages/favorites/Favoritespage';
import Orderspage from './pages/orders/Orderspage';
import Profilepage from './pages/profile/Profilepage';
import Animalpage from './pages/animal/Animalpage';

const App: React.FC = () => {
	return (
		<>
			<Routes>
				<Route path="/" index element={<Homepage />} />
				<Route path="/login" element={<Loginpage />} />
				<Route path="/register" element={<Registerpage />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/breeder/:id" element={<Breederpage />} />
				<Route path="/animal/:id" element={<Animalpage />} />
				<Route path="/inbox" element={<Inboxpage />} />
				<Route path="/favorites" element={<Favoritespage />} />
				<Route path="/orders" element={<Orderspage />} />
				<Route path="/profile" element={<Profilepage />} />
			</Routes>
		</>
	);
};

export default App;
