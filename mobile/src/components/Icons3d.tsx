import React from 'react';
import Svg, {
  Path,
  Rect,
  Circle,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Ellipse,
} from 'react-native-svg';

interface IconProps {
  size?: number;
}

function Shadow({ size }: { size: number }) {
  return (
    <Ellipse cx={size / 2} cy={size - 4} rx={size * 0.35} ry={size * 0.08} fill="rgba(0,0,0,0.18)" />
  );
}

export function WrenchIcon({ size = 48 }: IconProps) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.46;
  return (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Defs>
        <RadialGradient id="wrenchBg" cx="0.4" cy="0.35" r="0.7">
          <Stop offset="0%" stopColor="#5BA3E6" />
          <Stop offset="100%" stopColor="#1E3A6E" />
        </RadialGradient>
      </Defs>
      <Shadow size={s} />
      <Circle cx={cx} cy={cy} r={r} fill="url(#wrenchBg)" />
      <Circle cx={cx} cy={cy} r={r - 1.5} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <G transform="translate(24,24) scale(0.55)">
        <Path
          d="M-10 6 C-14 6 -16 2 -16 -2 C-16 -6 -12 -8 -8 -8 L-6 -8 L-6 -6 C-6 -4 -4 -2 -2 -2 L2 -2 L2 -4 C2 -8 6 -12 10 -12 L12 -12 L12 -10 C12 -8 14 -6 16 -6 L16 -2 L14 -2 C12 -2 10 0 10 2 L10 6 L8 6 C6 6 4 8 4 10 L2 10 L2 6 L-2 6 L-2 8 L-4 8 C-4 6 -6 6 -10 6 Z"
          fill="#D4D4D4"
          stroke="#888"
          strokeWidth="0.8"
        />
        <Path
          d="M-8 -6 L-8 4 M8 -10 L8 0"
          stroke="#BBB"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

export function LightningIcon({ size = 48 }: IconProps) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.46;
  return (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Defs>
        <RadialGradient id="boltBg" cx="0.4" cy="0.35" r="0.7">
          <Stop offset="0%" stopColor="#FF6B35" />
          <Stop offset="100%" stopColor="#CC2200" />
        </RadialGradient>
      </Defs>
      <Shadow size={s} />
      <Circle cx={cx} cy={cy} r={r} fill="url(#boltBg)" />
      <Circle cx={cx} cy={cy} r={r - 1.5} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <G transform="translate(24,28) scale(0.65)">
        <Path
          d="M-4 -16 L-12 2 L-2 2 L-6 16 L10 -4 L1 -4 L6 -16 Z"
          fill="#FFD700"
          stroke="#CC9900"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <Path
          d="M-4 -16 L-12 2 L-2 2 L-6 16 L10 -4 L1 -4 L6 -16 Z"
          fill="none"
          stroke="#FFF"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </G>
    </Svg>
  );
}

export function TruckIcon({ size = 48 }: IconProps) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.46;
  return (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Defs>
        <RadialGradient id="truckBg" cx="0.4" cy="0.35" r="0.7">
          <Stop offset="0%" stopColor="#4A90D9" />
          <Stop offset="100%" stopColor="#1E5C8C" />
        </RadialGradient>
      </Defs>
      <Shadow size={s} />
      <Circle cx={cx} cy={cy} r={r} fill="url(#truckBg)" />
      <Circle cx={cx} cy={cy} r={r - 1.5} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <G transform="translate(24,26) scale(0.5)">
        <Rect x="-14" y="-8" width="18" height="14" rx="2" fill="#E8E8E8" stroke="#888" strokeWidth="0.8" />
        <Rect x="-12" y="-12" width="12" height="6" rx="1.5" fill="#D0D0D0" stroke="#888" strokeWidth="0.8" />
        <Rect x="4" y="-6" width="12" height="12" rx="1" fill="#C8C8C8" stroke="#888" strokeWidth="0.8" />
        <Circle cx="-10" cy="8" r="4" fill="#444" stroke="#222" strokeWidth="1" />
        <Circle cx="-10" cy="8" r="2" fill="#AAA" />
        <Circle cx="10" cy="8" r="4" fill="#444" stroke="#222" strokeWidth="1" />
        <Circle cx="10" cy="8" r="2" fill="#AAA" />
        <Rect x="6" y="-12" width="2" height="6" rx="0.5" fill="#666" />
      </G>
    </Svg>
  );
}

export function GarageIcon({ size = 48 }: IconProps) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.46;
  return (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      <Defs>
        <RadialGradient id="garageBg" cx="0.4" cy="0.35" r="0.7">
          <Stop offset="0%" stopColor="#FF8C42" />
          <Stop offset="100%" stopColor="#CC5500" />
        </RadialGradient>
      </Defs>
      <Shadow size={s} />
      <Circle cx={cx} cy={cy} r={r} fill="url(#garageBg)" />
      <Circle cx={cx} cy={cy} r={r - 1.5} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <G transform="translate(24,26) scale(0.55)">
        <Path d="M-16 8 L0 -12 L16 8 Z" fill="#E0A060" stroke="#A07040" strokeWidth="0.8" strokeLinejoin="round" />
        <Rect x="-12" y="4" width="24" height="12" rx="1" fill="#D09050" stroke="#A07040" strokeWidth="0.8" />
        <Rect x="-5" y="6" width="10" height="10" rx="1" fill="#8B5E3C" stroke="#6B4226" strokeWidth="0.8" />
        <Rect x="-5" y="6" width="10" height="2" fill="#A07040" />
      </G>
    </Svg>
  );
}
