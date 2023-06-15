import { Card, Typography } from 'antd';
import './AccountTypeSelection.scss';

interface AccountTypeSelectionProps {
	activeSetup: number;
	currentSetup: number;
	label: string;
	onClick: (activeSetup: number) => void;
	imgSrc: string;
}

const AccountTypeSelection: React.FC<AccountTypeSelectionProps> = ({
	activeSetup,
	currentSetup,
	label,
	onClick,
	imgSrc
}) => {
	return (
		<Card
			onClick={() => onClick(currentSetup)}
			className={`accountTypeSelection ${currentSetup === activeSetup ? 'selected' : ''}`}
		>
			<div className="accountTypePreviewImg">
				<img src={imgSrc} alt="account type selection" />
			</div>
			<Typography.Text className="setupSelectionLabel">{label}</Typography.Text>
		</Card>
	);
};
export default AccountTypeSelection;
