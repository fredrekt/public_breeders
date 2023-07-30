import React from 'react'
import './ComingSoonpage.scss'
import { Link } from 'react-router-dom'
import logoImg from '../../assets/images/transparent_logo_lg.png'
import { Typography } from 'antd'

const ComingSoonpage: React.FC = () => {
  return (
    <div className='comingSoonpage'>
        <div className="comingSoonLogoContainer">
            <img src={logoImg} alt="logo" className="comingSoonLogo" />
        </div>
        <div className="comingSoonContent">
            <Typography.Title level={2} className='comingSoonContentHeader'>Coming Soon</Typography.Title>
        </div>
        <div className="comingSoonLinks">
            <Link to="/privacy-policy">
                Privacy policy
            </Link>
            <Link to="/terms-and-conditions">
                Terms & Conditions
            </Link>
        </div>
    </div>
  )
}

export default ComingSoonpage