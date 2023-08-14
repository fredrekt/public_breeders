import { Button, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MissingPage: React.FC = () => {
	const navigate = useNavigate();
	return (
		<div className="missingPage absolute-centered">
			<Result
				className="missingPageResult"
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
				extra={[
					<Button onClick={() => navigate('/')} type="primary" key="console">
						Go Home
					</Button>
				]}
			/>
		</div>
	);
};

export default MissingPage;
