import userProfile from './user-profile.svg';
import security from './security.svg';
import warning from './warning.svg';
import healthcare from './healthcare.svg';
import shield from './shield.svg';
import heartbeat from './heartbeat.svg';
import heartbeatWave from './heartbeat-wave.svg';
import subtract from './Subtract.png';
import logoPulse from './logo-pulse.svg';
import idCard from './be1e2013b2f3f759c175662dd8f723d9839d9813 (1).png';

export const icons = {
  userProfile,
  security,
  warning,
  healthcare,
  shield,
  heartbeat,
  heartbeatWave,
  subtract,
  logoPulse,
  idCard,
};

export const Icon = ({ name, className = '', alt = 'icon', width = 32, height = 32 }) => {
  const iconSrc = icons[name];
  
  if (!iconSrc) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <img
      src={iconSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
    />
  );
};

export default Icon;
