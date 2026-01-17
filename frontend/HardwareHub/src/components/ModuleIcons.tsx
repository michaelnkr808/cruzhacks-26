/**
 * SVG Icons for IF MAGIC Modules
 * 
 * These replace emoji with professional SVG icons
 * Each icon is designed to match the hacker theme
 */

interface IconProps {
  size?: number;
  color?: string;
}

export const ButtonIcon = ({ size = 24, color = '#00ff87' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="4" fill={color} opacity="0.6"/>
  </svg>
);

export const SliderIcon = ({ size = 24, color = '#00ff87' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="11" width="20" height="2" fill={color} opacity="0.4"/>
    <rect x="10" y="7" width="4" height="10" rx="1" fill={color} stroke={color} strokeWidth="2"/>
  </svg>
);

export const DialIcon = ({ size = 24, color = '#00ff87' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="2" fill={color}/>
    <line x1="12" y1="12" x2="12" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const JoystickIcon = ({ size = 24, color = '#00ff87' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="14" width="12" height="6" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="9" r="4" stroke={color} strokeWidth="2" fill={color} opacity="0.4"/>
    <line x1="12" y1="13" x2="12" y2="14" stroke={color} strokeWidth="2"/>
  </svg>
);

export const DistanceIcon = ({ size = 24, color = '#00ff87' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8 L6 8 M4 12 L8 12 M4 16 L10 16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 8 L18 8 M20 12 L16 12 M20 16 L14 16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="2" fill={color}/>
  </svg>
);

export const LightIcon = ({ size = 24, color = '#00ff87' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="10" r="4" fill={color} opacity="0.6"/>
    <path d="M10 14 L14 14 L13 18 L11 18 Z" fill={color}/>
    <line x1="12" y1="3" x2="12" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="18" y1="6" x2="16.5" y2="7.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="20" y1="10" x2="18" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const ColorIcon = ({ size = 24, color = '#00ff87' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M12 3 A9 9 0 0 1 21 12" stroke="#ff6b6b" strokeWidth="2" fill="none"/>
    <path d="M21 12 A9 9 0 0 1 12 21" stroke="#64ffda" strokeWidth="2" fill="none"/>
    <path d="M12 21 A9 9 0 0 1 3 12" stroke="#00d9ff" strokeWidth="2" fill="none"/>
    <path d="M3 12 A9 9 0 0 1 12 3" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

export const SoundIcon = ({ size = 24, color = '#00ff87' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9 L6 15 L10 15 L16 20 L16 4 L10 9 Z" fill={color} opacity="0.6" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M19 8 Q21 10 21 12 Q21 14 19 16" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);

export const MotionIcon = ({ size = 24, color = '#00ff87' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" opacity="0.3"/>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" opacity="0.6"/>
    <circle cx="16" cy="12" r="3" stroke={color} strokeWidth="2" fill={color} opacity="0.8"/>
  </svg>
);

export const GlowIcon = ({ size = 24, color = '#ff6b6b' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="5" fill={color} opacity="0.8"/>
    <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1" opacity="0.4"/>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1" opacity="0.2"/>
  </svg>
);

export const ToneIcon = ({ size = 24, color = '#ff6b6b' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12 Q9 6 12 12 Q15 18 18 12" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="12" cy="12" r="1.5" fill={color}/>
  </svg>
);

export const FlexIcon = ({ size = 24, color = '#00ff87' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12 Q8 6 12 12 Q16 18 20 12" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="4" cy="12" r="2" fill={color}/>
    <circle cx="20" cy="12" r="2" fill={color}/>
  </svg>
);

export const ForceIcon = ({ size = 24, color = '#00ff87' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="10" width="8" height="8" rx="1" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="12" y1="4" x2="12" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 4 L10 6 M12 4 L14 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const ProximityIcon = ({ size = 24, color = '#00ff87' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="2" fill={color}/>
    <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5" opacity="0.6"/>
    <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1" opacity="0.3"/>
  </svg>
);

export const MoveIcon = ({ size = 24, color = '#ff6b6b' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="8" height="8" rx="1" fill={color} opacity="0.6"/>
    <path d="M20 12 L16 12 M20 12 L18 10 M20 12 L18 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SpinIcon = ({ size = 24, color = '#ff6b6b' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4 A8 8 0 0 1 20 12" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M20 12 L17 11 L19 9" fill={color}/>
    <circle cx="12" cy="12" r="3" fill={color} opacity="0.4"/>
  </svg>
);

export const DigitalIcon = ({ size = 24, color = '#00ff87' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="4" height="8" fill={color} opacity="0.6"/>
    <rect x="10" y="4" width="4" height="16" fill={color}/>
    <rect x="16" y="10" width="4" height="6" fill={color} opacity="0.6"/>
  </svg>
);

// Icon mapping object
export const MODULE_ICONS: Record<string, React.FC<IconProps>> = {
  button: ButtonIcon,
  slider: SliderIcon,
  dial: DialIcon,
  joystick: JoystickIcon,
  distance: DistanceIcon,
  light: LightIcon,
  color: ColorIcon,
  sound: SoundIcon,
  motion: MotionIcon,
  glow: GlowIcon,
  tone: ToneIcon,
  flex: FlexIcon,
  force: ForceIcon,
  proximity: ProximityIcon,
  move: MoveIcon,
  spin: SpinIcon,
  digital: DigitalIcon,
};
