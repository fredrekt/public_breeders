const FormatMoney = (number: number) => {
	if (!number) number = 0;
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AUD' }).format(number);
};

export default FormatMoney;
