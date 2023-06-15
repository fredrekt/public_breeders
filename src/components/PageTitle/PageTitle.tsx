import React from 'react';
import './PageTitle.scss';
import { Typography } from 'antd';
import { Helmet } from 'react-helmet';
import descriptionContent from './content.json';

interface PageTitleProps {
	title: string;
	className?: string;
	level?: typeof TITLE_ELE_LIST[number];
}

declare const TITLE_ELE_LIST: readonly [1, 2, 3, 4, 5];

const descriptionContentParsed: any = descriptionContent;

const PageTitle: React.FC<PageTitleProps> = ({ title, className, level }) => {
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
			<Typography.Title className={className} level={level}>{title}</Typography.Title>
		</>
	);
};

export default PageTitle;
