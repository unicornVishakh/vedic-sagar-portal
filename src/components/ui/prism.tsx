import { useEffect, useRef } from "react";
import { Renderer, Triangle, Program, Mesh } from "ogl";

// Define the props for the Prism component
interface PrismProps {
  height?: number;
  baseWidth?: number;
  animationType?: "rotate" | "hover" | "3drotate" | "wobble"; // Added wobble as an option
  glow?: number;
  offset?: { x?: number; y?: number };
  noise?: number;
  transparent?: boolean;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  hoverStrength?: number;
  inertia?: number;
  bloom?: number;
  suspendWhenOffscreen?: boolean;
  timeScale?: number;
}

const Prism: React.FC<PrismProps> = ({
  height = 3.5,
  baseWidth = 5.5,
  animationType = "rotate",
  glow = 1,
  offset = { x: 0, y: 0 },
  noise = 0.5,
  transparent = true,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  hoverStrength = 2,
  inertia = 0.05,
  bloom = 1,
  suspendWhenOffscreen = false,
  timeScale = 0.5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Define constants based on props, ensuring minimum values
    const H = Math.max(0.001, height);
    const BW = Math.max(0.001, baseWidth);
    const BASE_HALF = BW * 0.5;
    const GLOW = Math.max(0.0, glow);
    const NOISE = Math.max(0.0, noise);
    const offX = offset?.x ?? 0;
    const offY = offset?.y ?? 0;
    const SAT = transparent ? 1.5 : 1;
    const SCALE = Math.max(0.001, scale);
    const HUE = hueShift || 0;
    const CFREQ = Math.max(0.0, colorFrequency || 1);
    const BLOOM = Math.max(0.0, bloom || 1);
    const RSX = 1; // Rotation scale factors (can be props if needed)
    const RSY = 1;
    const RSZ = 1;
    const TS = Math.max(0, timeScale || 1);
    const HOVSTR = Math.max(0, hoverStrength || 1);
    const INERT = Math.max(0, Math.min(1, inertia || 0.12));

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const renderer = new Renderer({
      dpr,
      alpha: transparent,
      antialias: false, // Antialiasing might impact performance
    });
    const gl = renderer.gl;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND); // Disable blend unless specifically needed

    // Style and append the canvas
    Object.assign(gl.canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
    });
    container.appendChild(gl.canvas);

    // Simple vertex shader
    const vertex = /* glsl */ `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader for rendering the prism effect
    const fragment = /* glsl */ `
      precision highp float;

      uniform vec2  iResolution;
      uniform float iTime;

      // Uniforms passed from the component props
      uniform float uHeight;
      uniform float uBaseHalf;
      uniform mat3  uRot;
      uniform int   uUseBaseWobble; // Use int for boolean-like flag
      uniform float uGlow;
      uniform vec2  uOffsetPx;
      uniform float uNoise;
      uniform float uSaturation;
      uniform float uScale;
      uniform float uHueShift;
      uniform float uColorFreq;
      uniform float uBloom;
      uniform float uCenterShift;
      uniform float uInvBaseHalf;
      uniform float uInvHeight;
      uniform float uMinAxis;
      uniform float uPxScale;
      uniform float uTimeScale;

      // Helper functions
      vec4 tanh4(vec4 x){
        vec4 e2x = exp(2.0*x);
        return (e2x - 1.0) / (e2x + 1.0);
      }

      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      // Signed distance function for an anisotropic octahedron (used for pyramid shape)
      float sdOctaAnisoInv(vec3 p){
        vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
        float m = q.x + q.y + q.z - 1.0;
        return m * uMinAxis * 0.5773502691896258; // 1/sqrt(3)
      }

      // Signed distance function for an upward-pointing pyramid
      float sdPyramidUpInv(vec3 p){
        float oct = sdOctaAnisoInv(p);
        float halfSpace = -p.y; // Cut off the bottom half of the octahedron
        return max(oct, halfSpace);
      }

      // Matrix for hue rotation
      mat3 hueRotation(float a){
        float c = cos(a), s = sin(a);
        mat3 W = mat3(
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114
        );
        mat3 U = mat3(
           0.701, -0.587, -0.114,
          -0.299,  0.413, -0.114,
          -0.300, -0.588,  0.886
        );
        mat3 V = mat3(
           0.168, -0.331,  0.500,
           0.328,  0.035, -0.500,
          -0.497,  0.296,  0.201
        );
        return W + U * c + V * s;
      }

      // Main shader logic
      void main(){
        vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

        float z = 5.0; // Initial z distance for ray marching
        float d = 0.0; // Distance to surface

        vec3 p; // Ray position
        vec4 o = vec4(0.0); // Output color accumulator

        float centerShift = uCenterShift; // Vertical shift for the pyramid
        float cf = uColorFreq; // Color frequency

        mat2 wob = mat2(1.0); // Base wobble matrix
        if (uUseBaseWobble == 1) {
          float t = iTime * uTimeScale;
          float c0 = cos(t + 0.0);
          float c1 = cos(t + 33.0); // Different phase for variation
          float c2 = cos(t + 11.0);
          wob = mat2(c0, c1, c2, c0); // Simple wobble effect on xz plane
        }

        // Ray marching loop
        const int STEPS = 100; // Number of steps (adjust for quality/performance)
        for (int i = 0; i < STEPS; i++) {
          p = vec3(f, z); // Current point along the ray
          p.xz = p.xz * wob; // Apply base wobble
          p = uRot * p; // Apply rotation

          vec3 q = p;
          q.y += centerShift; // Apply vertical shift before distance calculation

          // Calculate distance to the pyramid surface
          // The distance calculation adds a bias (0.1) and scales the SDF result (0.2 * abs(...))
          // This creates a glowing/volumetric effect rather than a hard surface
          d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));

          z -= d; // March the ray forward

          // Accumulate color based on position and distance
          // Uses sine waves for color variation along y and z axes
          o += (sin((p.y + z) * cf + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
        }

        // Apply glow, bloom, and tanh saturation
        o = tanh4(o * o * (uGlow * uBloom) / 1e5); // Squaring 'o' enhances contrast

        vec3 col = o.rgb;

        // Apply noise
        float n = rand(gl_FragCoord.xy + vec2(iTime));
        col += (n - 0.5) * uNoise;
        col = clamp(col, 0.0, 1.0);

        // Apply saturation adjustment
        float L = dot(col, vec3(0.2126, 0.7152, 0.0722)); // Luminance
        col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);

        // Apply hue shift
        if(abs(uHueShift) > 0.0001){
          col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
        }

        // Output final color
        gl_FragColor = vec4(col, o.a);
      }
    `;

    // Setup geometry (a simple triangle covering the screen)
    const geometry = new Triangle(gl);
    const iResBuf = new Float32Array(2); // Buffer for resolution uniform
    const offsetPxBuf = new Float32Array(2); // Buffer for offset uniform

    // Create the shader program
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: iResBuf },
        iTime: { value: 0 },
        uHeight: { value: H },
        uBaseHalf: { value: BASE_HALF },
        uUseBaseWobble: { value: animationType === "wobble" ? 1 : 0 }, // Set based on animation type
        uRot: { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) }, // Initial rotation matrix
        uGlow: { value: GLOW },
        uOffsetPx: { value: offsetPxBuf },
        uNoise: { value: NOISE },
        uSaturation: { value: SAT },
        uScale: { value: SCALE },
        uHueShift: { value: HUE },
        uColorFreq: { value: CFREQ },
        uBloom: { value: BLOOM },
        uCenterShift: { value: H * 0.25 }, // Center shift based on height
        uInvBaseHalf: { value: 1 / BASE_HALF }, // Precompute inverse for SDF
        uInvHeight: { value: 1 / H },
        uMinAxis: { value: Math.min(BASE_HALF, H) }, // Minimum of half-base and height
        uPxScale: { // Scale based on resolution and component scale prop
          value: 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE),
        },
        uTimeScale: { value: TS },
      },
    });

    // Create the mesh
    const mesh = new Mesh(gl, { geometry, program });

    // Resize handler
    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      iResBuf[0] = gl.drawingBufferWidth;
      iResBuf[1] = gl.drawingBufferHeight;
      offsetPxBuf[0] = offX * dpr;
      offsetPxBuf[1] = offY * dpr * -1; // Invert Y for WebGL coordinates
      program.uniforms.uPxScale.value =
        1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE);
    };

    // Use ResizeObserver for efficient resizing
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize(); // Initial resize

    // Rotation matrix buffer and calculation function
    const rotBuf = new Float32Array(9);
    const setMat3FromEuler = (yawY: number, pitchX: number, rollZ: number, out: Float32Array) => {
      const cy = Math.cos(yawY), sy = Math.sin(yawY);
      const cx = Math.cos(pitchX), sx = Math.sin(pitchX);
      const cz = Math.cos(rollZ), sz = Math.sin(rollZ);

      // Rotation matrix calculation (column-major order for WebGL)
      out[0] = cy * cz + sy * sx * sz;   out[3] = -cy * sz + sy * sx * cz;  out[6] = sy * cx;
      out[1] = cx * sz;                 out[4] = cx * cz;                  out[7] = -sx;
      out[2] = -sy * cz + cy * sx * sz;  out[5] = sy * sz + cy * sx * cz;   out[8] = cy * cx;
      return out;
    };


    const NOISE_IS_ZERO = NOISE < 1e-6;
    let raf = 0;
    const t0 = performance.now();

    // Animation frame management
    const startRAF = () => {
      if (raf) return;
      raf = requestAnimationFrame(render);
    };
    const stopRAF = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // Rotation parameters for 'rotate' and '3drotate'
    const rnd = () => Math.random();
    const wX = (0.3 + rnd() * 0.6) * RSX; // Random frequencies for rotation axes
    const wY = (0.2 + rnd() * 0.7) * RSY;
    const wZ = (0.1 + rnd() * 0.5) * RSZ;
    const phX = rnd() * Math.PI * 2; // Random phases
    const phZ = rnd() * Math.PI * 2;

    // State variables for hover animation
    let yaw = 0, pitch = 0, roll = 0;
    let targetYaw = 0, targetPitch = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Pointer tracking for 'hover' animation
    const pointer = { x: 0, y: 0, inside: false }; // Start outside
    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const viewWidth = rect.width;
      const viewHeight = rect.height;
      const viewCX = rect.left + viewWidth * 0.5;
      const viewCY = rect.top + viewHeight * 0.5;

      const nx = (e.clientX - viewCX) / (viewWidth * 0.5);
      const ny = (e.clientY - viewCY) / (viewHeight * 0.5);
      pointer.x = Math.max(-1, Math.min(1, nx));
      pointer.y = Math.max(-1, Math.min(1, ny));
    };
    const onEnter = (e: PointerEvent) => {
        pointer.inside = true;
        onMove(e); // Update position immediately on enter
        startRAF(); // Ensure animation runs when pointer enters
    }
    const onLeave = () => {
      pointer.inside = false;
    };
     const onBlur = () => { // Handle window blur
        pointer.inside = false;
    };


    // Event listeners based on animation type
    let cleanupListeners = () => {};
    if (animationType === "hover") {
      const handlePointerMove = (e: PointerEvent) => { onMove(e); startRAF(); };
      container.addEventListener("pointerenter", onEnter);
      container.addEventListener("pointerleave", onLeave);
      container.addEventListener("pointermove", handlePointerMove, { passive: true });
       window.addEventListener('blur', onBlur); // Add blur listener

      program.uniforms.uUseBaseWobble.value = 0; // Disable wobble for hover

      cleanupListeners = () => {
          container.removeEventListener("pointerenter", onEnter);
         container.removeEventListener("pointerleave", onLeave);
        container.removeEventListener("pointermove", handlePointerMove);
         window.removeEventListener('blur', onBlur);
      };
    } else if (animationType === "3drotate" || animationType === "rotate") {
        // 'rotate' is treated like '3drotate' but with specific axes locked later
      program.uniforms.uUseBaseWobble.value = 0; // Disable wobble
    } else { // 'wobble' animation
      program.uniforms.uUseBaseWobble.value = 1;
    }


    // Render loop
    const render = (t: number) => {
      const time = (t - t0) * 0.001;
      program.uniforms.iTime.value = time;

      let continueRAF = true; // Flag to determine if RAF should continue

      // Update rotation based on animation type
      if (animationType === "hover") {
        const maxPitch = 0.6 * HOVSTR;
        const maxYaw = 0.6 * HOVSTR;
        targetYaw = (pointer.inside ? -pointer.x : 0) * maxYaw;
        targetPitch = (pointer.inside ? pointer.y : 0) * maxPitch;

        const prevYaw = yaw;
        const prevPitch = pitch;
        const prevRoll = roll;

        // Apply inertia (lerp towards target)
        yaw = lerp(prevYaw, targetYaw, INERT);
        pitch = lerp(prevPitch, targetPitch, INERT);
        roll = lerp(prevRoll, 0, 0.1); // Dampen roll quickly

        program.uniforms.uRot.value = setMat3FromEuler(yaw, pitch, roll, rotBuf);

        // Optimization: Stop RAF if animation is settled and noise is off
        if (NOISE_IS_ZERO && !pointer.inside) {
          const settled = Math.abs(yaw - targetYaw) < 1e-4 &&
                          Math.abs(pitch - targetPitch) < 1e-4 &&
                          Math.abs(roll) < 1e-4;
          if (settled) continueRAF = false;
        }

      } else if (animationType === "3drotate" || animationType === "rotate") {
          const tScaled = time * TS;
          if (animationType === "rotate") {
              // Simple rotation around Y-axis
              yaw = tScaled * wY;
              pitch = 0; // Lock pitch
              roll = 0; // Lock roll
          } else {
             // 3D rotation using sin waves
            yaw = tScaled * wY;
            pitch = Math.sin(tScaled * wX + phX) * 0.6; // Oscillate pitch
            roll = Math.sin(tScaled * wZ + phZ) * 0.5; // Oscillate roll
          }

          program.uniforms.uRot.value = setMat3FromEuler(yaw, pitch, roll, rotBuf);

         if (TS < 1e-6 && NOISE_IS_ZERO) continueRAF = false; // Stop if timeScale is effectively zero

      } else { // 'wobble' animation or default
        // Use identity matrix (no rotation), wobble is handled in shader
        rotBuf.set([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        program.uniforms.uRot.value = rotBuf;

        if (TS < 1e-6 && NOISE_IS_ZERO) continueRAF = false; // Stop if timeScale is zero
      }

      // Render the scene
      renderer.render({ scene: mesh });

      // Continue or stop the animation loop
      if (continueRAF) {
        raf = requestAnimationFrame(render);
      } else {
        raf = 0; // Set raf to 0 to indicate it's stopped
      }
    };

    // Intersection Observer for suspending animation when offscreen
    let io: IntersectionObserver | null = null;
    if (suspendWhenOffscreen) {
      io = new IntersectionObserver((entries) => {
        const vis = entries.some((e) => e.isIntersecting);
        if (vis) startRAF();
        else stopRAF();
      });
      io.observe(container);
    }

    // Start the animation initially
    startRAF();

    // Cleanup function
    return () => {
      stopRAF();
      ro.disconnect();
      cleanupListeners(); // Clean up event listeners
      if (io) io.disconnect(); // Disconnect IntersectionObserver

       // Check if canvas exists and is a child before removing
      if (gl.canvas && gl.canvas.parentElement === container) {
        container.removeChild(gl.canvas);
      }
      // OGL doesn't have an explicit dispose method for Renderer/Program/Mesh in v0.0.x
      // Rely on garbage collection
    };
  }, [ // Dependency array for useEffect
    height, baseWidth, animationType, glow, noise, offset?.x, offset?.y, scale,
    transparent, hueShift, colorFrequency, timeScale, hoverStrength, inertia,
    bloom, suspendWhenOffscreen
  ]);

   // Render the container div
  return <div className="prism-container w-full h-full relative" ref={containerRef} />;
};

export default Prism;
