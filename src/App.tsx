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
import ProtectedRoute from './utils/ProtectedRoute';
import Dashboardpage from './pages/dashboard/Dashboardpage';
import Aboutpage from './pages/about/Aboutpage';
import Contactpage from './pages/contact/Contactpage';
import Demopage from './pages/demo/Demopage';
import AppStorepage from './pages/appStore/AppStorepage';
import { message } from 'antd';
import TermsAndConditionsPage from './pages/termsAndConditions/TermsAndConditionsPage';
import PrivacyPolicypage from './pages/privacyPolicy/PrivacyPolicypage';
import BreederOnboardingPayoutpage from './pages/breederOnboardingPayout/BreederOnboardingPayoutpage';
import SuccessPage from './pages/stripe/SuccessPage';
import MissingPage from './pages/missing/MissingPage';

message.config({
	duration: 1,
	top: 80
})

const App: React.FC = () => {
	return (
		<>
			<Routes>
				<Route path="/" index element={<Homepage />} />
				<Route path="/login" element={<Loginpage />} />
				<Route path="/register" element={<Registerpage />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/forgot-password/:id" element={<ForgotPassword />} />
				<Route path="/about" element={<Aboutpage />} />
				<Route path="/contact" element={<Contactpage />} />
				<Route path="/demo" element={<Demopage />} />
				<Route path="/mobile" element={<AppStorepage />} />
				<Route path="/terms-and-conditions" element={<TermsAndConditionsPage/>} />
				<Route path="/privacy-policy" element={<PrivacyPolicypage/>} />
				<Route path="/stripe/success" element={<SuccessPage />} />
				<Route
					path="/breeder/:id"
					element={
						<ProtectedRoute>
							<Breederpage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/animal/:id"
					element={
						<ProtectedRoute>
							<Animalpage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/inbox"
					element={
						<ProtectedRoute>
							<Inboxpage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/favorites"
					element={
						<ProtectedRoute>
							<Favoritespage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/orders"
					element={
						<ProtectedRoute>
							<Orderspage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<Profilepage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Dashboardpage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/breeder/onboarding"
					element={
						<ProtectedRoute>
							<BreederOnboardingPayoutpage />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<MissingPage />} />
			</Routes>
		</>
	);
};

export default App;
