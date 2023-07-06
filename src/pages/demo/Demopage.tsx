import React from 'react'
import './Demopage.scss'
import PublicLayout from '../../layouts/public/PublicLayout'
import { Result } from 'antd'

const Demopage: React.FC = () => {
  return (
    <PublicLayout navbar className='demoPage  absolute-centered'>
		<Result status="404" title="404" subTitle="Sorry, this is still in progress. Walkthrough will be provided." />
    </PublicLayout>
  )
}

export default Demopage