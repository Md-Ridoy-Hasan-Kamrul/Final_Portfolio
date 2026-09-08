/**
 * Port of Framer FluidImage
 * https://framer.com/m/FluidImage-sQ3Sdp.js@OnzxeJHBv5svzF26KWFj
 */
import type { ReactElement } from 'react';
import FluidImageImpl from './FluidImage.js';

export type FluidImageProps = {
  image?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  colors?: {
    preset?:
      | 'tropical'
      | 'ocean'
      | 'sunset'
      | 'neon'
      | 'forest'
      | 'monochrome'
      | 'custom';
    customColors?: string[];
  };
  effect?: {
    showGradient?: boolean;
    radius?: number;
    strength?: number;
    distortion?: number;
    hueShift?: number;
    colorCycle?: number;
  };
  animation?: {
    speed?: number;
    persistence?: number;
    pointerSmooth?: number;
  };
  advanced?: {
    fadeIn?: boolean;
    fadeInDuration?: number;
    maxDpr?: number;
    overflowPadding?: number;
    quality?: 'high' | 'low';
  };
};

const FluidImage = FluidImageImpl as (
  props: FluidImageProps
) => ReactElement | null;

export default FluidImage;
