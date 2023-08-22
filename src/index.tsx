import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ReactGA from "react-ga4";

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID || 'G-FQBJWG3LKH');
ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#97c66a',
					colorLink: '#007aff',
					fontFamily: `'Roboto', sans-serif`
				}
			}}
		>
			<Router>
				<App />
			</Router>
		</ConfigProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
