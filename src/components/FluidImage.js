/**
 *  28
 * #28 Fluid Image
 * Interactive WebGL image effect with cursor-driven fluid gradient overlay
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 600
 * @framerIntrinsicHeight 400
 */import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
const useIsStaticRenderer = () => false;const TRAIL_LENGTH=12;const NOISE_SIZE=256;// ── generate deterministic noise texture (random gradient vectors in RG) ──
function generateNoiseTexture(){const size=NOISE_SIZE;const data=new Uint8Array(size*size*4);// Park-Miller LCG for deterministic output
let seed=48271;const rand=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646;};for(let y=0;y<size;y++){for(let x=0;x<size;x++){const idx=(y*size+x)*4;const angle=rand()*Math.PI*2;data[idx]=(Math.cos(angle)*.5+.5)*255|0;data[idx+1]=(Math.sin(angle)*.5+.5)*255|0;data[idx+2]=rand()*255|0;data[idx+3]=255;}}return data;}const NOISE_DATA=generateNoiseTexture();// ── default placeholder: a warm gradient photo stand-in (pre-encoded for SSR) ──
const DEFAULT_IMAGE="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNjAwIDQwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMkQxQjY5Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMzAlIiBzdG9wLWNvbG9yPSIjNkIzRkEwIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNjAlIiBzdG9wLWNvbG9yPSIjRTg0NzVGIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGQzg1NyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9InVybCgjYSkiLz4KICA8Y2lyY2xlIGN4PSIxODAiIGN5PSIxNTAiIHI9IjgwIiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjEyIi8+CiAgPGNpcmNsZSBjeD0iNDIwIiBjeT0iMjgwIiByPSIxMTAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMDgiLz4KICA8Y2lyY2xlIGN4PSIzNTAiIGN5PSIxMDAiIHI9IjUwIiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjEiLz4KPC9zdmc+";// ── shaders ──
const VERTEX_SHADER=`
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;function buildFragmentShader(lowQuality){const trailCount=lowQuality?6:TRAIL_LENGTH;const fbmOctaves=lowQuality?2:4;return`
precision highp float;

varying vec2 vUv;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uNoiseTex;
uniform vec2 uImageSize;
uniform vec3 uEffectColor1;
uniform vec3 uEffectColor2;
uniform vec3 uEffectColor3;
uniform vec3 uEffectColor4;
uniform float uRadius;
uniform float uStrength;
uniform float uSpeed;
uniform float uDistortion;
uniform float uHueShift;
uniform float uColorCycle;
uniform float uShowGradient;
uniform vec2 uPadding;
uniform vec2 uTrail[${TRAIL_LENGTH}];
uniform vec2 uTrailVelocities[${TRAIL_LENGTH}];
uniform float uTrailStrengths[${TRAIL_LENGTH}];
uniform float uBurst;
uniform vec2 uBurstPos;
uniform float uObjectFit;

// ── texture-based gradient noise ──

vec4 sampleImageTexture(vec2 uv) {
    vec2 clampedUv = clamp(uv, 0.0, 1.0);
    vec4 sampleColor = texture2D(uTexture, clampedUv);
    float inBounds =
        step(0.0, uv.x) *
        step(uv.x, 1.0) *
        step(0.0, uv.y) *
        step(uv.y, 1.0);
    float alpha = sampleColor.a * inBounds;
    vec3 rgb = alpha > 0.0001
        ? sampleColor.rgb / max(sampleColor.a, 0.0001)
        : vec3(0.0);
    return vec4(rgb, alpha);
}

vec2 noiseTexCoord(vec2 i) {
    return (floor(mod(i, 256.0)) + 0.5) / 256.0;
}

float gnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    vec2 g00 = texture2D(uNoiseTex, noiseTexCoord(i)).rg * 2.0 - 1.0;
    vec2 g10 = texture2D(uNoiseTex, noiseTexCoord(i + vec2(1.0, 0.0))).rg * 2.0 - 1.0;
    vec2 g01 = texture2D(uNoiseTex, noiseTexCoord(i + vec2(0.0, 1.0))).rg * 2.0 - 1.0;
    vec2 g11 = texture2D(uNoiseTex, noiseTexCoord(i + vec2(1.0, 1.0))).rg * 2.0 - 1.0;
    return mix(mix(dot(g00, f - vec2(0.0, 0.0)),
                   dot(g10, f - vec2(1.0, 0.0)), u.x),
               mix(dot(g01, f - vec2(0.0, 1.0)),
                   dot(g11, f - vec2(1.0, 1.0)), u.x), u.y);
}

mat2 rot(float a) {
    float c = cos(a); float s = sin(a);
    return mat2(c, -s, s, c);
}

float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 r = rot(0.37);
    for (int i = 0; i < ${fbmOctaves}; i++) {
        v += a * gnoise(p);
        p = r * p * 2.0 + vec2(13.7, 31.5);
        a *= 0.5;
    }
    return v;
}

${!lowQuality?`
// ── curl noise (divergence-free flow field) ──
vec2 curlNoise(vec2 p) {
    float eps = 0.1;
    float n1 = gnoise(p + vec2(0.0, eps));
    float n2 = gnoise(p - vec2(0.0, eps));
    float n3 = gnoise(p + vec2(eps, 0.0));
    float n4 = gnoise(p - vec2(eps, 0.0));
    float dFdy = (n1 - n2) / (2.0 * eps);
    float dFdx = (n3 - n4) / (2.0 * eps);
    return vec2(dFdy, -dFdx);
}
`:""}

// ── HSL helpers ──

vec3 rgb2hsl(vec3 c) {
    float mx = max(max(c.r, c.g), c.b);
    float mn = min(min(c.r, c.g), c.b);
    float l = (mx + mn) * 0.5;
    if (mx == mn) return vec3(0.0, 0.0, l);
    float d = mx - mn;
    float s = l > 0.5 ? d / (2.0 - mx - mn) : d / (mx + mn);
    float h;
    if (mx == c.r) h = (c.g - c.b) / d + (c.g < c.b ? 6.0 : 0.0);
    else if (mx == c.g) h = (c.b - c.r) / d + 2.0;
    else h = (c.r - c.g) / d + 4.0;
    h /= 6.0;
    return vec3(h, s, l);
}

float hue2rgb(float p, float q, float t) {
    if (t < 0.0) t += 1.0;
    if (t > 1.0) t -= 1.0;
    if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
    if (t < 1.0 / 2.0) return q;
    if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
    return p;
}

vec3 hsl2rgb(vec3 hsl) {
    if (hsl.y == 0.0) return vec3(hsl.z);
    float q = hsl.z < 0.5 ? hsl.z * (1.0 + hsl.y) : hsl.z + hsl.y - hsl.z * hsl.y;
    float p = 2.0 * hsl.z - q;
    return vec3(
        hue2rgb(p, q, hsl.x + 1.0 / 3.0),
        hue2rgb(p, q, hsl.x),
        hue2rgb(p, q, hsl.x - 1.0 / 3.0)
    );
}

// ── main ──

void main() {
    vec2 uv = vUv;
    float canvasAspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 imageAreaSize = uResolution * (1.0 - 2.0 * uPadding);
    float imageAreaAspect = imageAreaSize.x / max(imageAreaSize.y, 1.0);
    float imageAspect = uImageSize.x / max(uImageSize.y, 1.0);

    // remap from padded canvas to image-area UVs
    vec2 imageUv = (uv - uPadding) / (1.0 - 2.0 * uPadding);

    // object-fit UV mapping (within image area)
    // uObjectFit: 0 = cover, 1 = contain, 2 = fill
    vec2 texUv = imageUv;
    if (uObjectFit < 0.5) {
        // cover: scale to fill, crop excess
        if (imageAreaAspect > imageAspect) {
            float scale = imageAreaAspect / imageAspect;
            texUv.y = (imageUv.y - 0.5) / scale + 0.5;
        } else {
            float scale = imageAspect / imageAreaAspect;
            texUv.x = (imageUv.x - 0.5) / scale + 0.5;
        }
    } else if (uObjectFit < 1.5) {
        // contain: scale to fit entirely, letterbox
        if (imageAreaAspect > imageAspect) {
            float scale = imageAspect / imageAreaAspect;
            texUv.x = (imageUv.x - 0.5) / scale + 0.5;
        } else {
            float scale = imageAreaAspect / imageAspect;
            texUv.y = (imageUv.y - 0.5) / scale + 0.5;
        }
    }
    // fill (uObjectFit >= 1.5): texUv = imageUv as-is (stretch)
    texUv.y = 1.0 - texUv.y;

    float time = uTime * uSpeed;

    vec2 aspect = vec2(canvasAspect, 1.0);
    vec2 p = uv * aspect;
    float radiusScaled = uRadius * max(canvasAspect, 1.0);

    // ── flow field ──
    ${!lowQuality?`vec2 flowField = curlNoise(p * 2.0 + time * 0.3);`:`vec2 flowField = vec2(
               gnoise(p * 2.0 + time * 0.3 + vec2(0.0, 73.1)),
               gnoise(p * 2.0 + time * 0.3 + vec2(131.7, 0.0))
           ) * 0.5;`}

    // ── hover proximity (color shifts even when pointer is still) ──
    float hoverDist = distance(p, uPointer * aspect);
    float hoverT = 1.0 - smoothstep(0.0, radiusScaled, hoverDist);
    float hoverInfluence = hoverT * hoverT * hoverT * uPointerActive * uStrength;
    float orbCore = pow(hoverT, 1.8) * uPointerActive;
    float orbHalo = pow(hoverT, 0.8) * uPointerActive;
    float orbRing = smoothstep(0.12, 0.58, hoverT) * (1.0 - smoothstep(0.58, 0.92, hoverT)) * uPointerActive;
    float orbPulse = (0.5 + 0.5 * sin(uTime * 1.2)) * (0.12 + 0.2 * orbCore);

    // ── trail: vortex + curl + smudge ──
    float trailInfluence = 0.0;
    vec2 totalSwirl = vec2(0.0);

    for (int i = 0; i < ${trailCount}; i++) {
        float trailStr = uTrailStrengths[i];
        if (trailStr < 0.001) continue;
        vec2 trailPos = uTrail[i] * aspect;
        vec2 toTrail = p - trailPos;
        float dist = length(toTrail);
        float t = 1.0 - smoothstep(0.0, radiusScaled, dist);
        float influence = t * t * t * trailStr;

        // noise modulation for organic shape
        float noiseOff = gnoise(uv * 5.0 + time * 0.4 + float(i) * 1.7) * uDistortion;
        influence *= (1.0 + noiseOff * 0.6);
        trailInfluence += influence;

        vec2 vel = uTrailVelocities[i];
        float velMag = length(vel);

        // vortex spin: perpendicular to direction-to-point
        vec2 tangent = vec2(-toTrail.y, toTrail.x);
        float vortexStr = influence * velMag * 2.0;
        totalSwirl += tangent / max(dist, 0.02) * vortexStr * uDistortion * 0.4;

        // reduced linear smudge (still needed for directional push)
        if (velMag > 0.001) {
            totalSwirl += vel * influence * uDistortion * 0.3;
        }

        // curl flow contribution (organic turbulence)
        totalSwirl += flowField * influence * uDistortion * 0.25;
    }
    trailInfluence = clamp(trailInfluence, 0.0, 1.0) * uStrength * uPointerActive;

    // ── burst (independent of pointer active) ──
    vec2 burstSwirl = vec2(0.0);
    float burstInfluence = 0.0;
    if (uBurst > 0.001) {
        float burstDist = distance(p, uBurstPos * aspect);
        float burstExpand = 1.0 + (1.0 - uBurst) * 2.0;
        float burstRadius = radiusScaled * burstExpand;
        float burstT = 1.0 - smoothstep(0.0, burstRadius, burstDist);
        burstInfluence = burstT * burstT * uBurst * uBurst * uStrength;
        vec2 burstDir = p - uBurstPos * aspect;
        float bdLen = length(burstDir);
        if (bdLen > 0.001) burstDir /= bdLen;
        burstSwirl = burstDir * burstInfluence * uDistortion * 0.8
                   + flowField * burstInfluence * uDistortion * 0.3;
    }

    // combine hover + trail + burst
    float combined = clamp(hoverInfluence + trailInfluence + burstInfluence, 0.0, 1.0);

    // ── texture distortion using curl-warped UVs ──
    vec2 swirlUv = totalSwirl * 0.5 * uPointerActive + burstSwirl * 0.5;
    // add subtle curl warp near cursor even when still
    swirlUv += flowField * hoverInfluence * 0.03;
    vec2 smudgedTexUv = texUv + swirlUv;
    vec4 smudgedColor = sampleImageTexture(smudgedTexUv);

    // warped boundary mask — edges distort with the swirl
    vec2 warpedImageUv = imageUv - swirlUv;
    float inImage = smoothstep(-0.005, 0.0, warpedImageUv.x) * smoothstep(-0.005, 0.0, 1.0 - warpedImageUv.x)
                  * smoothstep(-0.005, 0.0, warpedImageUv.y) * smoothstep(-0.005, 0.0, 1.0 - warpedImageUv.y);

    // hue shift + saturation boost (only when gradient effect is on)
    vec3 hueShifted = smudgedColor.rgb;
    if (uShowGradient > 0.5) {
        vec3 hsl = rgb2hsl(smudgedColor.rgb);
        float noiseHue = fbm(uv * 3.0 + time * 0.3);
        hsl.x = fract(hsl.x + uHueShift * combined * (0.5 + noiseHue * 0.5));
        hsl.y = min(1.0, hsl.y + combined * 0.6);
        hsl.z = clamp(hsl.z + combined * 0.1, 0.0, 1.0);
        hueShifted = hsl2rgb(hsl);
    }

    // animate effect colors — cycle hues over time
    vec3 c1hsl = rgb2hsl(uEffectColor1);
    c1hsl.x = fract(c1hsl.x + uTime * uColorCycle);
    vec3 cycledColor1 = hsl2rgb(c1hsl);

    vec3 c2hsl = rgb2hsl(uEffectColor2);
    c2hsl.x = fract(c2hsl.x + uTime * uColorCycle * 0.73);
    vec3 cycledColor2 = hsl2rgb(c2hsl);

    vec3 c3hsl = rgb2hsl(uEffectColor3);
    c3hsl.x = fract(c3hsl.x + uTime * uColorCycle * 1.17);
    vec3 cycledColor3 = hsl2rgb(c3hsl);

    vec3 c4hsl = rgb2hsl(uEffectColor4);
    c4hsl.x = fract(c4hsl.x + uTime * uColorCycle * 0.53);
    vec3 cycledColor4 = hsl2rgb(c4hsl);

    // ── domain-warped gradient overlay ──
    vec2 warpCoord = uv * 2.5 + (totalSwirl * uPointerActive + burstSwirl) * 4.0;
    ${!lowQuality?`float warpLayer = fbm(warpCoord + time * 0.15);
    float gradientT = fbm(warpCoord + warpLayer * 0.5 + time * 0.1);`:`float gradientT = fbm(warpCoord + time * 0.1);`}

    // remap FBM output (~[-0.94, 0.94]) to smooth [0, 1]
    float gt = clamp(gradientT * 0.5 + 0.5, 0.0, 1.0);
    gt = gt * gt * (3.0 - 2.0 * gt); // hermite smooth
    float premiumShift = (fbm(uv * 1.6 + flowField * 0.9 + time * 0.08) * 0.5 + 0.5) - 0.5;
    gt = clamp(gt + premiumShift * (0.08 * orbHalo + 0.05 * orbRing), 0.0, 1.0);

    // 4-stop gradient: color1 -> color2 -> color3 -> color4
    float seg = gt * 3.0;
    vec3 gradientColor;
    if (seg < 1.0) {
        gradientColor = mix(cycledColor1, cycledColor2, seg);
    } else if (seg < 2.0) {
        gradientColor = mix(cycledColor2, cycledColor3, seg - 1.0);
    } else {
        gradientColor = mix(cycledColor3, cycledColor4, seg - 2.0);
    }

    // blend: more gradient when swirling fast
    float swirlMag = length(totalSwirl * uPointerActive + burstSwirl);
    float distortionBand = clamp(orbRing * 1.15 + burstInfluence * 0.5 + trailInfluence * 0.35, 0.0, 1.0);
    float gradientMix = smoothstep(0.02, 0.72, combined * 0.28 + orbHalo * 0.3 + swirlMag * 1.4) * uShowGradient;
    vec3 premiumGradientColor = mix(gradientColor, vec3(1.0), 0.18 * orbCore + 0.06 * orbPulse);
    vec3 premiumHueShifted = mix(hueShifted, smudgedColor.rgb, 0.18 * (1.0 - orbHalo));
    vec3 effectColor = mix(premiumHueShifted, premiumGradientColor, gradientMix * (0.78 + 0.22 * orbHalo));

    // compositing: image area blends normally, overflow fades out
    float imageMix = clamp(combined * 0.55 + orbCore * 0.2 + orbHalo * 0.15, 0.0, 1.0);
    vec3 imageBlend = mix(smudgedColor.rgb, effectColor, imageMix);
    vec3 finalColor = mix(effectColor, imageBlend, inImage);
    float glow = clamp(orbHalo * 0.55 + orbCore * orbCore * 0.45 + distortionBand * 0.18, 0.0, 1.0);
    vec3 outerGlowColor = mix(gradientColor, premiumGradientColor, 0.5);
    finalColor += outerGlowColor * glow * (0.16 + 0.08 * orbPulse) * uShowGradient;
    finalColor += vec3(1.0) * orbCore * 0.045 * uShowGradient;
    finalColor = clamp(finalColor, 0.0, 1.0);

    float alpha = inImage * smudgedColor.a;
    gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
}
`;}// ── utilities ──
function clamp(value,min,max){return Math.min(max,Math.max(min,value));}function hslToRgb01(h,s,l){if(s===0)return[l,l,l];const q=l<.5?l*(1+s):l+s-l*s;const p=2*l-q;const hue2rgb=t=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};return[hue2rgb(h+1/3),hue2rgb(h),hue2rgb(h-1/3)];}function parseColorToRgb01(input){const value=input.trim();const hex=value.startsWith("#")?value.slice(1):null;if(hex){const normalized=hex.length===3?`${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`:hex.length===4?`${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`:hex.slice(0,6).padEnd(6,"0");const int=Number.parseInt(normalized,16);if(!Number.isNaN(int)){return[(int>>16&255)/255,(int>>8&255)/255,(int&255)/255];}}const rgbMatch=value.match(/rgba?\(([^)]+)\)/i);if(rgbMatch){const channels=rgbMatch[1].split(",").map(part=>part.trim());const toChannel=channel=>{if(channel.endsWith("%")){return clamp(Number.parseFloat(channel)/100*255,0,255);}return clamp(Number.parseFloat(channel),0,255);};const r=toChannel(channels[0]||"0");const g=toChannel(channels[1]||"0");const b=toChannel(channels[2]||"0");return[r/255,g/255,b/255];}// hsl / hsla
const hslMatch=value.match(/hsla?\(([^)]+)\)/i);if(hslMatch){const parts=hslMatch[1].split(/[,/]/).map(s=>s.trim());const h=Number.parseFloat(parts[0])/360;const s=Number.parseFloat(parts[1])/100;const l=Number.parseFloat(parts[2])/100;if(!Number.isNaN(h)&&!Number.isNaN(s)&&!Number.isNaN(l)){return hslToRgb01(h,s,l);}}// canvas fallback for named colors, oklch, etc.
if(typeof document!=="undefined"){try{const ctx=document.createElement("canvas").getContext("2d");if(ctx){ctx.fillStyle=value;const resolved=ctx.fillStyle;if(resolved.startsWith("#")){const int=Number.parseInt(resolved.slice(1),16);return[(int>>16&255)/255,(int>>8&255)/255,(int&255)/255];}}}catch{// ignore — fall through to default
}}return[0,0,0];}// ── color presets ──
const COLOR_PRESETS={tropical:["#0D9488","#A78BFA","#F472B6","#FBBF24"],ocean:["#0EA5E9","#6366F1","#14B8A6","#818CF8"],sunset:["#F97316","#EF4444","#A855F7","#FBBF24"],neon:["#22D3EE","#A3E635","#F472B6","#FACC15"],forest:["#16A34A","#065F46","#A3E635","#D9F99D"],monochrome:["#E5E5E5","#A3A3A3","#525252","#171717"]};const DEFAULT_PRESET="tropical";const PRESET_OPTIONS=[...Object.keys(COLOR_PRESETS),"custom"];const PRESET_TITLES=["Tropical","Ocean","Sunset","Neon","Forest","Mono","Custom"];/** Maps N user colors to exactly 4 shader colors by evenly sampling */function resolveColors(preset,customColors){const palette=preset==="custom"?customColors.length>0?customColors:COLOR_PRESETS[DEFAULT_PRESET]:COLOR_PRESETS[preset]||COLOR_PRESETS[DEFAULT_PRESET];if(palette.length===0)return["#000000","#000000","#000000","#000000"];if(palette.length===1)return[palette[0],palette[0],palette[0],palette[0]];if(palette.length===2)return[palette[0],palette[1],palette[1],palette[0]];if(palette.length===3)return[palette[0],palette[1],palette[2],palette[1]];if(palette.length===4)return[palette[0],palette[1],palette[2],palette[3]];// 5+ colors: sample 4 evenly spaced
const last=palette.length-1;return[palette[0],palette[Math.round(last/3)],palette[Math.round(last*2/3)],palette[last]];}function compileShader(gl,type,source){const shader=gl.createShader(type);if(!shader)throw new Error("Could not create shader");gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const info=gl.getShaderInfoLog(shader)||"Unknown shader compile error";gl.deleteShader(shader);throw new Error(info);}return shader;}function createProgram(gl,fragmentSource){const vertex=compileShader(gl,gl.VERTEX_SHADER,VERTEX_SHADER);const fragment=compileShader(gl,gl.FRAGMENT_SHADER,fragmentSource);const program=gl.createProgram();if(!program)throw new Error("Could not create shader program");gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);if(!gl.getProgramParameter(program,gl.LINK_STATUS)){const info=gl.getProgramInfoLog(program)||"Unknown program link error";gl.deleteProgram(program);throw new Error(info);}return program;}// ── component ──
export default function FluidImage(props){const{image,objectFit="cover",colors={},effect={},animation={},advanced={}}=props;const{preset=DEFAULT_PRESET,customColors=[]}=colors;const[effectColor1,effectColor2,effectColor3,effectColor4]=resolveColors(preset,customColors);const{showGradient=true,radius=.4,strength=.9,distortion=.4,hueShift=.5,colorCycle=.05}=effect;const{speed=.4,persistence=.97,pointerSmooth=.08}=animation;const{fadeIn=true,fadeInDuration=.6,maxDpr=1.75,overflowPadding=100,quality="high"}=advanced;const hostRef=React.useRef(null);const isStaticRenderer=useIsStaticRenderer();const[loadError,setLoadError]=React.useState(null);const[imageNaturalSize,setImageNaturalSize]=React.useState(null);const reducedMotionRef=React.useRef(false);React.useEffect(()=>{if(typeof window==="undefined"||!window.matchMedia)return;const mq=window.matchMedia("(prefers-reduced-motion: reduce)");reducedMotionRef.current=mq.matches;const handler=e=>{reducedMotionRef.current=e.matches;};mq.addEventListener("change",handler);return()=>mq.removeEventListener("change",handler);},[]);const imageSrc=image||DEFAULT_IMAGE;const objectFitValue=objectFit==="contain"?1:objectFit==="fill"?2:0;const stateRef=React.useRef({effectColor1Rgb:parseColorToRgb01(effectColor1),effectColor2Rgb:parseColorToRgb01(effectColor2),effectColor3Rgb:parseColorToRgb01(effectColor3),effectColor4Rgb:parseColorToRgb01(effectColor4),showGradient,radius,strength,speed,distortion,hueShift,colorCycle,persistence,pointerSmooth,maxDpr,fadeIn,fadeInDuration,overflowPadding,objectFit:objectFitValue});stateRef.current={effectColor1Rgb:parseColorToRgb01(effectColor1),effectColor2Rgb:parseColorToRgb01(effectColor2),effectColor3Rgb:parseColorToRgb01(effectColor3),effectColor4Rgb:parseColorToRgb01(effectColor4),showGradient,radius,strength,speed,distortion,hueShift,colorCycle,persistence,pointerSmooth,maxDpr,fadeIn,fadeInDuration,overflowPadding,objectFit:objectFitValue};// ref for image URL so the main effect can pick up changes
const imageUrlRef=React.useRef(imageSrc);imageUrlRef.current=imageSrc;// ref for reloading texture from outside the main effect
const reloadTextureRef=React.useRef(undefined);// watch image prop changes (skip initial mount — main effect handles first load)
const initialMountRef=React.useRef(true);React.useEffect(()=>{if(initialMountRef.current){initialMountRef.current=false;return()=>{};}if(reloadTextureRef.current){reloadTextureRef.current(imageSrc);}return()=>{};},[imageSrc]);// ── main WebGL lifecycle ──
React.useEffect(()=>{if(isStaticRenderer)return;if(!hostRef.current)return;let cancelled=false;let raf=0;let rafRunning=false;const host=hostRef.current;const canvas=document.createElement("canvas");const initPad=stateRef.current.overflowPadding;canvas.style.position="absolute";canvas.style.top=`-${initPad}px`;canvas.style.left=`-${initPad}px`;canvas.style.width=`calc(100% + ${initPad*2}px)`;canvas.style.height=`calc(100% + ${initPad*2}px)`;canvas.style.display="block";canvas.style.pointerEvents="none";const initState=stateRef.current;if(initState.fadeIn){canvas.style.opacity="0";canvas.style.transition=`opacity ${initState.fadeInDuration}s ease`;}host.appendChild(canvas);const gl=canvas.getContext("webgl",{alpha:true,premultipliedAlpha:false,antialias:false,preserveDrawingBuffer:false});if(!gl){setLoadError("WebGL is not available");if(canvas.parentElement===host)host.removeChild(canvas);return;}// ── mutable GL state ──
let program=null;let buffer=null;let texture=null;let noiseTex=null;let loc=null;let imageSize={w:1,h:1};let loadGen=0;// ── container size from ResizeObserver ──
let cw=Math.max(1,host.clientWidth||host.offsetWidth||1);let ch=Math.max(1,host.clientHeight||host.offsetHeight||1);// ── build shader based on quality ──
const fragSource=buildFragmentShader(quality==="low");// ── GL init (called on mount + context restore) ──
function initGL(){program=createProgram(gl,fragSource);gl.useProgram(program);const vertices=new Float32Array([-1,-1,3,-1,-1,3]);buffer=gl.createBuffer();if(!buffer)throw new Error("Could not create vertex buffer");gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);const posLoc=gl.getAttribLocation(program,"aPosition");gl.enableVertexAttribArray(posLoc);gl.vertexAttribPointer(posLoc,2,gl.FLOAT,false,0,0);loc={uResolution:gl.getUniformLocation(program,"uResolution"),uPointer:gl.getUniformLocation(program,"uPointer"),uPointerActive:gl.getUniformLocation(program,"uPointerActive"),uTime:gl.getUniformLocation(program,"uTime"),uTexture:gl.getUniformLocation(program,"uTexture"),uNoiseTex:gl.getUniformLocation(program,"uNoiseTex"),uImageSize:gl.getUniformLocation(program,"uImageSize"),uEffectColor1:gl.getUniformLocation(program,"uEffectColor1"),uEffectColor2:gl.getUniformLocation(program,"uEffectColor2"),uEffectColor3:gl.getUniformLocation(program,"uEffectColor3"),uEffectColor4:gl.getUniformLocation(program,"uEffectColor4"),uRadius:gl.getUniformLocation(program,"uRadius"),uStrength:gl.getUniformLocation(program,"uStrength"),uSpeed:gl.getUniformLocation(program,"uSpeed"),uDistortion:gl.getUniformLocation(program,"uDistortion"),uHueShift:gl.getUniformLocation(program,"uHueShift"),uColorCycle:gl.getUniformLocation(program,"uColorCycle"),uShowGradient:gl.getUniformLocation(program,"uShowGradient"),uTrail:gl.getUniformLocation(program,"uTrail"),uTrailVelocities:gl.getUniformLocation(program,"uTrailVelocities"),uTrailStrengths:gl.getUniformLocation(program,"uTrailStrengths"),uPadding:gl.getUniformLocation(program,"uPadding"),uBurst:gl.getUniformLocation(program,"uBurst"),uBurstPos:gl.getUniformLocation(program,"uBurstPos"),uObjectFit:gl.getUniformLocation(program,"uObjectFit")};// ── image texture (unit 0) ──
texture=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([128,128,128,255]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);// ── noise texture (unit 1) ──
noiseTex=gl.createTexture();gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,noiseTex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,NOISE_SIZE,NOISE_SIZE,0,gl.RGBA,gl.UNSIGNED_BYTE,NOISE_DATA);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);// switch back to unit 0 for image operations
gl.activeTexture(gl.TEXTURE0);}// ── image loading with generation counter ──
const loadImage=url=>{const gen=++loadGen;const img=new Image;// Only set crossOrigin for truly cross-origin URLs;
// Framer-hosted assets on the same origin don't need it,
// and setting it can cause CORS failures in preview.
try{const imgUrl=new URL(url,window.location.href);if(imgUrl.origin!==window.location.origin){img.crossOrigin="anonymous";}}catch{img.crossOrigin="anonymous";}img.onload=()=>{if(cancelled||gen!==loadGen)return;if(!img.naturalWidth||!img.naturalHeight||img.naturalWidth<=0||img.naturalHeight<=0)return;setLoadError(null);imageSize={w:img.naturalWidth,h:img.naturalHeight};setImageNaturalSize({w:img.naturalWidth,h:img.naturalHeight});gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0);requestAnimationFrame(()=>{canvas.style.opacity="1";});ensureRAF();};img.onerror=()=>{if(cancelled||gen!==loadGen)return;// Retry without crossOrigin if CORS was the issue
if(img.crossOrigin){const retry=new Image;retry.onload=img.onload;retry.onerror=()=>{if(!cancelled&&gen===loadGen)setLoadError("Failed to load image");};retry.src=url;return;}setLoadError("Failed to load image");};img.src=url;};// ── init ──
try{initGL();}catch(error){const message=error instanceof Error?error.message:"Unknown error while starting shader";setLoadError(message);const loseCtx=gl.getExtension("WEBGL_lose_context");if(loseCtx)loseCtx.loseContext();if(canvas.parentElement===host)host.removeChild(canvas);return undefined;}// expose reload for external image changes
reloadTextureRef.current=loadImage;loadImage(imageUrlRef.current);// ── ResizeObserver ──
const ro=new ResizeObserver(entries=>{for(const entry of entries){const cr=entry.contentRect;cw=Math.max(1,Math.floor(cr.width));ch=Math.max(1,Math.floor(cr.height));}ensureRAF();});ro.observe(host);// ── mouse tracking ──
let targetPointer={x:.5,y:.5};let smoothPointer={x:.5,y:.5};let prevSmooth={x:.5,y:.5};let pointerVelocity={x:0,y:0};let pointerInside=false;let pointerActiveFade=0;let lastPad=initPad;let lastPw=0;let lastPh=0;// ── burst state ──
let burstValue=0;let burstPos={x:.5,y:.5};const trail=Array.from({length:TRAIL_LENGTH},()=>({x:-1,y:-1,vx:0,vy:0,strength:0}));const trailFlat=new Float32Array(TRAIL_LENGTH*2);const trailVelFlat=new Float32Array(TRAIL_LENGTH*2);const trailStrengths=new Float32Array(TRAIL_LENGTH);const onPointerMove=event=>{if(reducedMotionRef.current)return;const rect=host.getBoundingClientRect();if(rect.width<=0||rect.height<=0)return;targetPointer={x:clamp((event.clientX-rect.left)/rect.width,0,1),y:clamp(1-(event.clientY-rect.top)/rect.height,0,1)};pointerInside=true;ensureRAF();};const onPointerLeave=()=>{pointerInside=false;ensureRAF();};const onPointerDown=event=>{if(reducedMotionRef.current)return;const rect=host.getBoundingClientRect();if(rect.width<=0||rect.height<=0)return;burstPos={x:clamp((event.clientX-rect.left)/rect.width,0,1),y:clamp(1-(event.clientY-rect.top)/rect.height,0,1)};burstValue=1;ensureRAF();};host.addEventListener("pointermove",onPointerMove);host.addEventListener("pointerleave",onPointerLeave);host.addEventListener("pointerdown",onPointerDown);// ── context loss / restore ──
const onContextLost=e=>{e.preventDefault();window.cancelAnimationFrame(raf);rafRunning=false;};const onContextRestored=()=>{try{initGL();loadImage(imageUrlRef.current);ensureRAF();}catch(error){setLoadError(error instanceof Error?error.message:"Context restore failed");}};canvas.addEventListener("webglcontextlost",onContextLost,false);canvas.addEventListener("webglcontextrestored",onContextRestored,false);// ── render loop ──
const start=performance.now();let lastFrameTime=0;function ensureRAF(){if(!rafRunning&&!cancelled){rafRunning=true;lastFrameTime=performance.now();raf=window.requestAnimationFrame(render);}}function render(now){if(cancelled){rafRunning=false;return;}if(!loc){rafRunning=false;return;}// frame-rate independent delta (capped at 100ms to avoid jumps)
const dt=Math.min((now-lastFrameTime)/1e3,.1);lastFrameTime=now;const dtScale=dt*60// normalized to 60fps baseline
;const s=stateRef.current;// resize (reads from ResizeObserver cache, no layout thrash)
const dpr=Math.min(window.devicePixelRatio||1,Math.max(.5,s.maxDpr));const padPx=s.overflowPadding;const canvasW=cw+2*padPx;const canvasH=ch+2*padPx;const pw=Math.floor(canvasW*dpr);const ph=Math.floor(canvasH*dpr);if(pw!==lastPw||ph!==lastPh){canvas.width=pw;canvas.height=ph;gl.viewport(0,0,pw,ph);lastPw=pw;lastPh=ph;}// update canvas overflow when padding changes
if(padPx!==lastPad){canvas.style.top=`-${padPx}px`;canvas.style.left=`-${padPx}px`;canvas.style.width=`calc(100% + ${padPx*2}px)`;canvas.style.height=`calc(100% + ${padPx*2}px)`;lastPad=padPx;}// smooth pointer (frame-rate independent exponential)
const smoothK=1-Math.pow(1-clamp(s.pointerSmooth,.01,1),dtScale);prevSmooth.x=smoothPointer.x;prevSmooth.y=smoothPointer.y;smoothPointer.x+=(targetPointer.x-smoothPointer.x)*smoothK;smoothPointer.y+=(targetPointer.y-smoothPointer.y)*smoothK;// velocity (frame-rate independent: convert per-frame delta to per-second)
const rawVx=dt>0?(smoothPointer.x-prevSmooth.x)/dt:0;const rawVy=dt>0?(smoothPointer.y-prevSmooth.y)/dt:0;const velDecay=Math.pow(.5,dtScale);pointerVelocity.x=pointerVelocity.x*velDecay+rawVx*(1-velDecay);pointerVelocity.y=pointerVelocity.y*velDecay+rawVy*(1-velDecay);// pointer active fade (frame-rate independent, faster rate)
const fadeTarget=pointerInside?1:0;const fadeK=1-Math.pow(1-.1,dtScale);pointerActiveFade+=(fadeTarget-pointerActiveFade)*fadeK;// burst decay (frame-rate independent)
if(burstValue>.001){burstValue*=Math.pow(.94,dtScale);if(burstValue<.001)burstValue=0;}// update trail (frame-rate independent persistence)
const trailDecay=Math.pow(s.persistence,dtScale);for(let i=0;i<TRAIL_LENGTH;i++){trail[i].strength*=trailDecay;}const dx=smoothPointer.x-trail[0].x;const dy=smoothPointer.y-trail[0].y;if(pointerInside&&dx*dx+dy*dy>5e-5){for(let i=TRAIL_LENGTH-1;i>0;i--){trail[i].x=trail[i-1].x;trail[i].y=trail[i-1].y;trail[i].vx=trail[i-1].vx;trail[i].vy=trail[i-1].vy;trail[i].strength=trail[i-1].strength;}trail[0].x=smoothPointer.x;trail[0].y=smoothPointer.y;trail[0].vx=pointerVelocity.x*dt;trail[0].vy=pointerVelocity.y*dt;trail[0].strength=1;}else if(pointerInside){trail[0].x=smoothPointer.x;trail[0].y=smoothPointer.y;trail[0].vx=pointerVelocity.x*dt;trail[0].vy=pointerVelocity.y*dt;trail[0].strength=1;}// padding normalization for canvas-space remapping
const padNormX=canvasW>0?padPx/canvasW:0;const padNormY=canvasH>0?padPx/canvasH:0;const scaleX=1-2*padNormX;const scaleY=1-2*padNormY;// upload trail uniforms (remapped to canvas UV space)
for(let i=0;i<TRAIL_LENGTH;i++){trailFlat[i*2]=trail[i].x*scaleX+padNormX;trailFlat[i*2+1]=trail[i].y*scaleY+padNormY;trailVelFlat[i*2]=trail[i].vx*scaleX;trailVelFlat[i*2+1]=trail[i].vy*scaleY;trailStrengths[i]=trail[i].strength;}// set uniforms
gl.uniform2f(loc.uResolution,pw,ph);gl.uniform2f(loc.uPadding,padNormX,padNormY);gl.uniform2f(loc.uPointer,smoothPointer.x*scaleX+padNormX,smoothPointer.y*scaleY+padNormY);gl.uniform1f(loc.uPointerActive,pointerActiveFade);gl.uniform1f(loc.uTime,(now-start)*.001);gl.uniform1i(loc.uTexture,0);gl.uniform1i(loc.uNoiseTex,1);gl.uniform2f(loc.uImageSize,imageSize.w,imageSize.h);const[r1,g1,b1]=s.effectColor1Rgb;gl.uniform3f(loc.uEffectColor1,r1,g1,b1);const[r2,g2,b2]=s.effectColor2Rgb;gl.uniform3f(loc.uEffectColor2,r2,g2,b2);const[r3,g3,b3]=s.effectColor3Rgb;gl.uniform3f(loc.uEffectColor3,r3,g3,b3);const[r4,g4,b4]=s.effectColor4Rgb;gl.uniform3f(loc.uEffectColor4,r4,g4,b4);gl.uniform1f(loc.uRadius,s.radius);gl.uniform1f(loc.uStrength,s.strength);gl.uniform1f(loc.uSpeed,s.speed);gl.uniform1f(loc.uDistortion,s.distortion);gl.uniform1f(loc.uHueShift,s.hueShift);gl.uniform1f(loc.uColorCycle,s.colorCycle);gl.uniform1f(loc.uShowGradient,s.showGradient?1:0);gl.uniform1f(loc.uObjectFit,s.objectFit);gl.uniform2fv(loc.uTrail,trailFlat);gl.uniform2fv(loc.uTrailVelocities,trailVelFlat);gl.uniform1fv(loc.uTrailStrengths,trailStrengths);// burst uniforms
gl.uniform1f(loc.uBurst,burstValue);gl.uniform2f(loc.uBurstPos,burstPos.x*scaleX+padNormX,burstPos.y*scaleY+padNormY);// draw
gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3);// ── idle check: stop RAF when nothing to animate ──
let allDecayed=pointerActiveFade<.001&&burstValue<.001;if(allDecayed){for(let i=0;i<TRAIL_LENGTH;i++){if(trailStrengths[i]>.001){allDecayed=false;break;}}}if(!pointerInside&&allDecayed){rafRunning=false;return;}raf=window.requestAnimationFrame(render);}ensureRAF();if(!initState.fadeIn){canvas.style.opacity="1";}setLoadError(null);return()=>{cancelled=true;window.cancelAnimationFrame(raf);rafRunning=false;reloadTextureRef.current=undefined;ro.disconnect();host.removeEventListener("pointermove",onPointerMove);host.removeEventListener("pointerleave",onPointerLeave);host.removeEventListener("pointerdown",onPointerDown);canvas.removeEventListener("webglcontextlost",onContextLost);canvas.removeEventListener("webglcontextrestored",onContextRestored);if(texture)gl.deleteTexture(texture);if(noiseTex)gl.deleteTexture(noiseTex);if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);const loseCtx=gl.getExtension("WEBGL_lose_context");if(loseCtx)loseCtx.loseContext();if(canvas.parentElement===host)host.removeChild(canvas);};},[isStaticRenderer,quality]);// ── static renderer fallback ──
if(isStaticRenderer){return /*#__PURE__*/_jsx("div",{style:{width:"100%",height:"100%",position:"relative",overflow:"visible"},children:/*#__PURE__*/_jsx("img",{src:imageSrc,alt:"",style:{width:"100%",height:"100%",objectFit:objectFit,display:"block"}})});}return /*#__PURE__*/_jsxs("div",{ref:hostRef,style:{width:"100%",height:"100%",position:"relative",overflow:"visible"},children:[/*#__PURE__*/_jsx("img",{src:imageSrc,alt:"",style:{display:"block",maxWidth:"100%",height:"auto",visibility:"hidden"}}),loadError?/*#__PURE__*/_jsx("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontFamily:"monospace",color:"rgba(255,255,255,0.8)",background:"rgba(0,0,0,0.35)",padding:12,textAlign:"center"},children:`Fluid Image: ${loadError}`}):null]});}FluidImage.displayName = "Fluid Image";
