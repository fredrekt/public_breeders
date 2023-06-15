import React from 'react';
import './PageTitle.scss';
import { Typography } from 'antd';
import { Helmet } from 'react-helmet';
import descriptionContent from './content.json';

interface PageTitleProps {
	title: string;
	className?: string;
}

const descriptionContentParsed: any = descriptionContent;

const PageTitle: React.FC<PageTitleProps> = ({ title, className }) => {
	const cleanedPageTitle: string = title.toLowerCase().trim();
	const description: string =
		(descriptionContentParsed[cleanedPageTitle] as any) || descriptionContentParsed['default'];

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>
					{title ? `${title} | ` : ''}
					{process.env.REACT_APP_APP_NAME}
				</title>
				<meta name="description" content={description} />
			</Helmet>
			<Typography.Title className={className}>{title}</Typography.Title>
		</>
	);
};

export default PageTitle;
