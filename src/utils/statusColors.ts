const statusColor = (status: string): string => {
	let color: string = '';
	switch (status) {
		case 'PENDING':
			color = 'warning';
			break;
		case 'IN_TRANSIT':
			color = 'processing';
			break;
		case 'DELIVERED':
			color = 'green';
			break;
		case 'CANCELLED':
			color = 'red';
			break;
        case 'COMPLETED':
            color = 'green';
            break;
        case 'REFUNDED':
            color = 'purple';
            break;
		default:
			break;
	}
	return color;
};

export default statusColor;