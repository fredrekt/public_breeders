const statusText = (status: string): string => {
	let statusText: string = '';
	switch (status) {
		case 'PENDING':
			statusText = 'Pending';
			break;
		case 'IN_TRANSIT':
			statusText = 'In Transit';
			break;
		case 'DELIVERED':
			statusText = 'Delivered';
			break;
		case 'CANCELLED':
			statusText = 'Cancelled';
			break;
        case 'COMPLETED':
            statusText = 'Completed';
            break;
        case 'REFUNDED':
            statusText = 'Refunded';
            break;
		default:
			break;
	}
	return statusText;
};

export default statusText;