import React from 'react';
import { motion } from 'framer-motion';
import '../Styles/Login.css';

const HeaderLogo = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={fadeInUp} 
      className="flex flex-row-reverse items-center mb-8 gap-4"
    >
      <div className="logo-box shadow-2xl">
        <svg 
          width="50" 
          height="55" 
          viewBox="0 0 50 55" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drawing-svg"
        >
          {/* مسار الدرع الخارجي - أنيميشن الرسم */}
          <path 
            className="logo-path-draw"
            d="M42.0513 28.5964C42.0513 41.5942 33.8263 48.0931 24.0503 51.8625C23.5384 52.0544 22.9823 52.0452 22.4758 51.8365C12.6763 48.0931 4.45128 41.5942 4.45128 28.5964V10.3994C4.45128 9.70998 4.69887 9.04877 5.13958 8.56126C5.58029 8.07374 6.17802 7.79986 6.80128 7.79986C11.5013 7.79986 17.3763 4.68038 21.4653 0.729047C21.9631 0.258522 22.5965 0 23.2513 0C23.9061 0 24.5394 0.258522 25.0373 0.729047C29.1498 4.70638 35.0013 7.79986 39.7013 7.79986C40.3245 7.79986 40.9223 8.07374 41.363 8.56126C41.8037 9.04877 42.0513 9.70998 42.0513 10.3994V28.5964Z" 
            stroke="white" 
            strokeOpacity="0.3" 
            strokeWidth="3.54696" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* مسار النبض الداخلي - أنيميشن الرسم المتأخر قليلاً */}
          <path 
            className="logo-path-draw pulse-line"
            d="M46.7513 25.9969H40.9233C39.8963 25.9945 38.8968 26.3642 38.0777 27.0496C37.2587 27.735 36.6651 28.6984 36.3878 29.7923L30.8653 51.5246C30.8297 51.6596 30.7555 51.7782 30.6538 51.8626C30.5521 51.9469 30.4284 51.9925 30.3013 51.9925C30.1742 51.9925 30.0505 51.9469 29.9488 51.8626C29.8471 51.7782 29.7729 51.6596 29.7373 51.5246L16.7653 0.469173C16.7297 0.334181 16.6555 0.2156 16.5538 0.131229C16.4521 0.0468591 16.3284 0.00125122 16.2013 0.00125122C16.0742 0.00125122 15.9505 0.0468591 15.8488 0.131229C15.7471 0.2156 15.6729 0.334181 15.6373 0.469173L10.1148 22.2015C9.8386 23.2911 9.24856 24.2513 8.43424 24.9363C7.61993 25.6213 6.62581 25.9937 5.60281 25.9969H-0.248688" 
            stroke="white" 
            strokeWidth="5.9116" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col text-right">
        <h1 className="text-[#004060] text-3xl font-bold whitespace-nowrap">MediCare</h1>
        <p className="text-gray-400 text-sm whitespace-nowrap">نظام الرعاية الطبية</p>
      </div>
    </motion.div>
  );
};

export default HeaderLogo;