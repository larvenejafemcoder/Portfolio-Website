"Portfolio-Website" — Gia Khang's Digital Presence: A Detailed Analysis
1. Executive Summary
This is a personal portfolio website for Gia Khang, a self-taught software engineer and systems architect with a stated focus on C, C++, Linux internals, embedded systems, and cybersecurity. The site serves as both a professional showcase of his work and identity, and as a technical artifact in itself — demonstrating advanced front-end engineering, 3D graphics, animation systems, and a deeply considered user experience philosophy.
The project is a single-page application (SPA) built with vanilla HTML, CSS, and JavaScript, leveraging CDN-loaded libraries: Tailwind CSS (utility-first CSS framework), Three.js (WebGL 3D rendering), and GSAP (GreenSock Animation Platform with ScrollTrigger and ScrollToPlugin). There is no build tool, bundler, or package manager — no package.json, no webpack, no Vite. All dependencies are loaded via <script> tags from CDNs (tailwindcss.com, cdnjs.cloudflare.com, unpkg.com). This is a deliberate choice, prioritizing simplicity and zero-config deployment over modern toolchain complexity.
The site has explicit Japanese-language (日本語) elements throughout the loading screen, vertical text, and typography, suggesting an interest in Japanese aesthetics, technology culture, or bilingual identity.
2. Project Structure
The file tree reveals 24 files across the root and three subdirectories:
Portfolio-Website/
├── .git/
├── app.js                    # 909 lines — Main application logic
├── index.html                # 605 lines — HTML structure + inline Three.js globe
├── style.css                 # 1843 lines — Complete stylesheet
├── draco/
│   ├── draco_decoder.js      # Draco 3D model decompression library
│   └── draco_decoder.wasm    # WebAssembly binary for Draco decoding
├── images/
│   ├── express.webp
│   ├── javascript.webp
│   ├── mongo.webp
│   ├── mysql.webp
│   ├── next.webp, next1.webp, next2.webp, nextBL.webp
│   ├── node.webp, node2.webp
│   ├── placeholder.webp
│   ├── react.webp, react2.webp
│   └── typescript.webp
├── models/
│   ├── .gitattributes        # Git LFS config for .glb files
│   ├── char_enviorment.hdr   # HDR environment map for 3D lighting
│   ├── character.enc         # AES-256 encrypted 3D character model
│   ├── character.glb         # Raw 3D GLTF Binary model (likely gitignored/LFS)
│   └── encrypt.cjs           # Encryption script for the 3D model
File-by-file breakdown:
index.html — The entire HTML document. Contains the DOM structure for all sections (loading screen, header, landing hero, about, "what I do", career timeline, work showcase, tech stack, contact), plus an inline ES Module script block (~300 lines) that renders the Three.js 3D globe with bloom post-processing, stars, clouds, atmosphere shader, orbital rings, ambient lighting, and mouse/scroll parallax. This is unusual — most of the 3D globe logic lives directly in the HTML rather than in app.js, suggesting it was added as a self-contained module.
style.css — A monolithic 1843-line stylesheet with no CSS preprocessor (no Sass, Less, PostCSS). Uses CSS custom properties extensively (--accentColor: #7C5CFF, --backgroundColor: #0A0B10, etc.). Implements responsive design through 15+ media query breakpoints (400px, 500px, 550px, 600px, 768px, 900px, 1024px, 1025px, 1300px, 1400px, 1600px, 1950px). Contains complex animation keyframes for loading animations, corner-border reveals, and timeline effects. Has special handling for prefers-reduced-motion and touch devices.
app.js — 909 lines of vanilla JavaScript organized into IIFEs (Immediately Invoked Function Expressions) for each subsystem:
 1. Performance/accessibility utilities (touch detection, reduced motion)
 2. Loading screen system (fake progress bar, animated "loader game", click-to-enter)
 3. GSAP setup (navigation scroll-to)
 4. Three.js ambient scene (floating particles, rotating geometric primitives)
 5. Three.js tech stack visualization (floating spheres with logo textures)
 6. Custom cursor (difference-blend cursor with hover states)
 7. Social icons hover tracking (magnetic icon effect)
 8. "What I Do" touch toggle
 9. Landing page character-split animations (GSAP)
10. Scroll-triggered animations (horizontal work section, career timeline, section reveals, word/character splits)
models/encrypt.cjs — A Node.js CommonJS script that encrypts character.glb into character.enc using AES-256-CBC with the password "Character3D#@". This indicates the 3D character model is intentionally obfuscated, likely to prevent casual extraction while still being decodable at runtime.
models/.gitattributes — Configures Git LFS (Large File Storage) for .glb files, indicating the binary model file is large enough to warrant LFS tracking.
draco/ — Contains Google's Draco 3D geometry compression library files (draco_decoder.js + draco_decoder.wasm). Draco is a library for compressing and decompressing 3D geometric meshes and point clouds, developed by Google. Its presence here suggests the site may load compressed 3D models (potentially the encrypted character.glb) and decompress them client-side via WebAssembly.
images/ — Contains technology logo images in WebP format for the tech stack visualization, plus a placeholder image. WebP is a modern image format offering superior compression.
3. Architectural & Design Philosophy
3.1. Zero-Dependency Build — "The Machine Beneath the Machine"
The complete absence of a build system is philosophically consistent with Gia Khang's identity as someone who "rebuilds from the ground up" and "understands the machine beneath the machine." Instead of abstracting away tooling, the site loads libraries directly from CDNs. This means:
- No transpilation (vanilla JS, no TypeScript)
- No CSS preprocessing
- No module bundling (ES Modules used only for the Three.js globe)
- Immediate editing and deployment
This is both a constraint and a statement — it shows mastery of the fundamentals rather than reliance on tooling abstractions.
3.2. Dark Ambient Aesthetic
The visual design is unapologetically dark, cinematic, and atmospheric:
- Color palette: Deep near-black background (#0A0B10), purple accent (#7C5CFF — a violet), cyan secondary (#5FA8FF), white text with opacity variations.
- Lighting model: Radial gradient overlays, subtle glow effects, bloom post-processing on the 3D globe, and directional 3D lighting with warm key light, cool rim light, and purple fill light.
- Texture overlays: A cinematic grain overlay (SVG-based fractal noise, mix-blend-mode: overlay at 3.5% opacity) and a vignette effect (radial gradient from transparent to black at edges). These create a filmic, gritty texture over the entire page.
- Typography: Mix of Geist (headings), Inter (body), JetBrains Mono (code/monospace), and Noto Sans JP (Japanese text). Google Fonts loaded via @import in CSS and a <link> tag in HTML for redundancy.
3.3. Japanese Language Integration
The loading screen is distinctly Japanese-themed:
- 「読み込み中...」 (yomikomichu — "Loading...")
- 「システムを起動する」 (shisutemu o kidou suru — "Starting the system")
- 「機・械・の・下・の・機・械」 (kikai no shita no kikai — "The machine beneath the machine") — This is a direct thematic callback to the tagline "Exploring the machine beneath the machine."
- 「ようこそ」 (youkoso — "Welcome") on the enter button after loading
- Japanese font stack prioritizing "Noto Sans JP", "Zen Kaku Gothic New", "BIZ UDGothic", etc.
This bilingual design suggests either cultural heritage, aesthetic appreciation for Japanese design language, or a deliberate cyberpunk/techno-orientalist aesthetic choice aligning with the systems/low-level theme.
4. Section-by-Section Walkthrough
4.1. Loading Screen (#loading-screen)
The loading screen is a complex, two-panel split design:
Left panel (loading-left): A blank transparent area intended to show the Three.js globe through it (the globe is rendered as a fixed background element with z-index: 1).
Right panel (loading-right): Dark gradient background containing:
- A "loader game" visualization — an animated bar of vertical lines with a bouncing ball (reminiscent of the classic Windows 95 "Minesweeper" or a retro arcade game visualization)
- Japanese text with fade-in animations (jpFadeInUp)
- An animated progress bar with purple-to-cyan gradient fill
- Percentage counter in JetBrains Mono
The button (loading-button): A pill-shaped button centered on screen with:
- A glowing hover effect (blur filter on mouse position)
- A blinking cursor box
- "Loading XX%" text that transitions into "ようこそ" (Youkoso)
- On click: plays a completion animation where the button expands to cover the entire screen (scales up massively with min-width: calc(100vw + 5000px)), then fades out to reveal the site
The progress is fake — it increments via setInterval with randomized steps, capped at ~91%, then finishes rapidly on click. This is a classic UX pattern: the loading screen exists for dramatic effect and asset preloading time, not actual progress tracking.
4.2. Navigation Header (#header)
A fixed-position glass-morphism navbar with:
- Left: "Gia Khang" title with underline hover animation
- Center (desktop): Email link hello@giakhang.dev
- Right: Navigation links (ABOUT, WORK, CONTACT) with GSAP scroll-to functionality
- Glass effect: backdrop-filter: blur(16px) saturate(1.4) with subtle border
- Fades in after loading screen dismisses
4.3. Landing Hero (#landingDiv)
A full-viewport hero section with:
Left content:
- "Hello, I'm" greeting in purple (#7C5CFF)
- "GIA KHANG" in massive bold Geist typeface (clamp 48px to 90px)
- Role display: "Software Engineer" / "Systems Engineer" that alternates — the text swaps between two phrases in a looping GSAP animation, with character-level split animations that fade out one phrase and fade in the other
- Tagline: "Building foundations. Architecting systems. Exploring the machine beneath the machine."
Visual effects:
- Two fixed-position blurred circles (purple and cyan) that slowly rotate
- Radial gradient overlays
- Character-by-character GSAP animation on load with blur and y-offset
- landing-info-h2 has a CSS gradient overlay that creates a "fade at bottom" effect (background-image: linear-gradient(0deg, var(--backgroundColor) 40%, rgba(0,0,0,0) 110%))
4.4. Social Icons (#iconsSection)
Fixed-position sidebar at bottom-left of the viewport with:
- GitHub, LinkedIn, X (Twitter), Instagram SVG icons
- "Magnetic" hover effect: the icon follows the mouse cursor within its bounding box using a lerp-based requestAnimationFrame loop
- "Resume" button rotated -90 degrees (desktop) that straightens on larger screens
4.5. Custom Cursor (#cursorMain)
A mix-blend-mode: difference circle that follows the mouse with a slight delay (lerp factor of 8). It:
- Appears on first mouse movement
- Disappears on mouseleave
- Changes behavior via data-cursor attributes: disable hides it, icons expands it to match the icon row height
- Hidden entirely on touch devices
4.6. About Section (#about)
Minimalist single-card layout:
- "ABOUT ME" heading in uppercase with wide letter-spacing
- A single dense paragraph: "Self-taught software engineer rebuilding foundations through C, C++, Linux, embedded systems, and cybersecurity. I don't just learn tools — I build a worldview around technology itself, treating every language and system like unlocking hidden firmware layers of culture and computation."
On desktop, words are split into individual <span> elements and GSAP-animated into view with y-offset and opacity on scroll.
4.7. "What I Do" Section (#whatIDO)
A two-column layout with:
- Left column: The title "WHAT I DO" with stylized italics and purple accent on "DO"
- Right column: Two expandable cards — "DEVELOP: Systems & Infrastructure" and "ARCHITECT: Systems Design & Automation"
Each card has:
- A border-reveal animation on load (SVG dashed lines that animate from 0 to full width/height)
- Corner brackets (terminal-like aesthetic)
- A flicker-in animation for content (simulating CRT monitor flicker)
- Tags/skills as pill-shaped badges
- An arrow icon that rotates on hover
- On hover, the card expands and the sibling shrinks (CSS sibling selector ~)
- On touch devices (detected via ScrollTrigger.isTouch), hover is replaced by click toggle with JavaScript class management
This section has extensive responsive breakpoints, changing from side-by-side to stacked, adjusting card sizes, and hiding/showing skill tags.
4.8. Career Timeline (#career)
A vertical timeline with:
- A gradient-filled line that animates from bottom-up on scroll via GSAP ScrollTrigger
- A glowing dot at the bottom with pulsing box-shadow animation (CSS @keyframes timeline with multiple shadow values)
- Three entries:
1. 2023 — "Self-Taught Engineer / Foundations Phase" — Rebuilding from C, C++, Linux
2. 2024 — "Open Source & Infra / Personal Labs" — Arch Linux, dotfiles, Zsh ecosystem
3. NOW — "Systems Engineer / Evolving" — Embedded systems, cybersecurity
- Responsive: on mobile, the timeline shifts to the left edge and cards stack vertically
4.9. Work Showcase (#work)
The most technically ambitious section — a horizontal scrolling portfolio:
- Triggered by GSAP ScrollTrigger, pinned for the duration of the scroll
- Six project cards in a flex row that scroll horizontally as the user scrolls vertically
- Projects shown:
1. Arch Dotfiles (C, Zsh, Python, Bash, GNU Stow)
2. Zsh Ecosystem (Zsh, Bash, Python, Tmux)
3. Portfolio Site (HTML, CSS, JS, Three.js, GSAP)
4. VM Testing Lab (Arch Linux, QEMU, KVM, Ansible)
5. Cyber UI Concepts (Astro, CSS, Three.js, Neon Aesthetic)
6. Security Tools (C, Python, Bash, Wireshark, Nmap)
Each card has:
- A number (01-06)
- Title and category
- Tech stack description
- An image (currently all use /images/placeholder.webp)
- An external link button (SVG arrow icon) that appears on hover
- Alternating layout: odd cards have image below info, even cards have image above
- Hover glow effect (purple border/shadow)
The horizontal scroll calculation is dynamic — it measures card widths and container dimensions to compute the exact scroll distance, accounting for padding. This is recalculated via a function-based end callback in ScrollTrigger.
4.10. Tech Stack (#techstack)
A full-viewport visualization section where tech logos float in 3D space:
- Uses a separate Three.js scene with its own renderer, camera, and lighting
- 12 spheres with randomly-assigned textures from the images folder (React, Next.js, Node.js, TypeScript, JavaScript logos)
- Spheres have:
- Random scales (0.7, 0.9, 0.8)
- Random positions in a 3D volume (±15 in X/Y, -8 to +22 in Z)
- Velocity-based physics with damping (0.97 multiplier)
- A repulsive force from the mouse cursor (creating a "push away" interaction)
- A subtle group rotation (0.06 rad/s)
- Spot lighting from above with purple/cyan directional lights
- Ambient light with #6c47ff
- The section is activated only when the work section is in view (performance optimization)
- Responsive resize handler recalculates aspect ratio
4.11. Contact Section (#contact)
Footer with:
- "CONNECT" heading with purple gradient text
- Email (hello@giakhang.dev) and Signal ("Available on request")
- Social links: GitHub (@Larvene), LinkedIn (@giakhang), X/Twitter (@kernelghost), Website (giakhang.dev)
- Each social link has an underline animation on hover
- Signature: "Built from source by Gia Khang" with © 2024
5. Three.js Systems (Three Independent Scenes)
This project contains three separate Three.js renderers running simultaneously:
5.1. The Globe (Inline Module in index.html)
Purpose: Background atmosphere for the landing page.
Technical details:
- Earth texture mapped on a sphere with MeshPhysicalMaterial
- Cloud layer (slightly larger, transparent, additive blending)
- Atmosphere glow (custom ShaderMaterial with Fresnel/rim effect — pow(1.0 - dot(viewDir, normal), 3.0))
- 800 randomly-distributed star particles (Points with PointsMaterial)
- Two orbital rings (purple and cyan) at different angles
- 5-point lighting system: ambient, key light (warm), two rim lights (purple + cyan), fill light
- UnrealBloomPass post-processing for subtle bloom (strength 0.15)
- ACESFilmicToneMapping for cinematic color grading
- FogExp2 for depth fog
- Parallax: Mouse position affects rotation (lerp 0.02 factor)
- Scroll: Scroll progress rotates the globe (full rotation over scroll distance)
- Fades out when reaching the work section, fades back in at contact section
- Fully responsive: recalculates geometry (radius, position, camera distance) on resize
- Proper GPU memory management: disposes old geometries on resize
5.2. Ambient Scene (in app.js)
Purpose: Ongoing atmospheric particle system throughout the page.
Technical details:
- 150 particles in a spherical distribution with random colors (purple/cyan)
- Two floating geometric primitives (icosahedron and octahedron) with emissive materials
- Primitives have individual rotation speeds, floating animations (sine-based Y oscillation)
- Particles respond to mouse movement and scroll progress
- Opacity increases with scroll (0.15 to 0.35)
- Mobile reduces opacity significantly (performance optimization)
5.3. Tech Stack Scene (in app.js)
Purpose: Interactive 3D tech logo showcase.
Technical details:
- 12 spheres with texture maps from images/
- Physics simulation: spheres have velocity, damping, and mouse-repulsion forces
- Active only when work section is in view
- Slow group rotation (0.06 rad/s)
- Separate lighting: ambient + spot + directional
6. Animation Detail
6.1. GSAP Usage
GSAP is used extensively throughout app.js:
Timelines:
- Career timeline: synchronizes timeline bar fill, box reveal, and dot animation
- Work horizontal scroll: single timeline pinning the section and translating .work-flex
Individual tweens:
- Loading screen: body background color transition
- Header/icons/nav-fade opacity on load
- Landing text character-by-character animation with blur and stagger
- Looping text swap (Engineer/Systems)
- Section reveals: headings animate in with blur, y-offset
- Career/work/contact boxes stagger in
- Tags staggered scale-in
- Word-split animation for about paragraph
- Character-split animation for section titles
ScrollTrigger:
- Pinning for the work section
- Scrub for career timeline, work horizontal scroll, globe opacity
- Toggle actions for section reveals (play forward, reverse on scroll back)
- Invalidation on refresh for responsive calculation
6.2. CSS Animations
15+ @keyframes blocks:
- loadingCircle / loadingCircle2: Slow rotation of blurred background orbs
- jpFadeInUp: Japanese text entrance
- whatFlicker: CRT-style flicker for "What I Do" cards
- whatCorners: Corner bracket reveal
- whatBorders: Dashed border line growth
- timeline: Glowing dot pulse with multiple box-shadow values
- blink / blinkDone: Loading cursor blink
- loaderGame: Horizontal bar scrolling
- ball25: Bouncing ball in loader game
- fadeIn: Main body entrance
7. Performance & Accessibility
7.1. Performance Optimizations
- will-change: transform on work section
- translateZ(0) GPU acceleration on text elements
- powerPreference: "high-performance" on WebGL renderer
- setPixelRatio(Math.min(window.devicePixelRatio, 2)) to cap resolution
- Mobile optimizations: Reduced particle opacity, hidden 3D elements, mobile-specific Three.js geometry sizes
- Conditional rendering: Tech stack scene only renders when work section is visible
- Disposal: Old geometries are properly disposed on resize to prevent memory leaks
7.2. Accessibility
- prefers-reduced-motion: Detected and respected. Removes animations, disables grain overlay, sets all durations to 0.01ms
- Touch device detection: Hides custom cursor, adds touch-device class, replaces hover with click for "What I Do" cards
- user-select: none: Disables text selection across the site (debatable for a11y)
- No ARIA attributes: Missing semantic accessibility features
- No keyboard navigation support: Custom cursor and hover effects require mouse
8. Security & Encryption
The models/encrypt.cjs script encrypts the 3D character model using AES-256-CBC with a hardcoded password "Character3D#@". This is:
- CommonJS module (uses require()) — needs Node.js to run
- Uses a SHA-256 hash of the password as the AES key
- Generates a random 16-byte IV
- Writes IV + encrypted data to .enc file
- The decryption key (password) is embedded in the encryption script
This suggests the .glb model (a 3D character) is shipped encrypted and would be decrypted client-side before rendering. However, the decryption logic is not present in app.js or index.html, so this may be unused currently or decryption happens through the Draco decoder.
The .gitattributes file configures Git LFS for .glb files since 3D models are typically large binary files.
9. Git History & Context (via commit messages)
The commit history reveals an evolving project with some personality:
6113b6a new:
a6b9518 SOULJA IS FROZEN
e272d74 SOULJA BOY I TELL THEM NGA
5dcb544 Update README.md
520a326 Update LICENSE
be3da25 Update Contact.tsx
de3cd65 fixed the scrollTrigger animation of work section (#4)
b913e15 Updated GSAP with trial plugins
The early commits reference "SOULJA" — likely a reference to Soulja Boy, which could be inside-joke, placeholder, or a reference to a past iteration. The commit be3da25 references "Contact.tsx", suggesting the project may have had a TypeScript/React iteration earlier before being rewritten in vanilla JS. The GSAP commit mentions "trial plugins" — GSAP's ScrollTrigger and ScrollToPlugin require a paid "GreenSock Club" membership, suggesting these were trial versions.
10. Philosophical & Thematic Analysis
The site is more than a resume — it's a manifesto rendered in code. Key themes:
1. "The machine beneath the machine": A recurring phrase that appears in the tagline, the Japanese loading screen text, and the about paragraph. It expresses a philosophy of understanding foundational layers rather than just surface-level tools.
2. Systems thinking: The entire site is structured around systems — "Systems Architect", "Systems Design", "rebuilding from the ground up." The emphasis on Arch Linux, C/C++, and embedded systems reinforces a bottom-up worldview.
3. Cyberpunk/techno-orientalist aesthetic: The purple/cyan color scheme, CRT flicker effects, Japanese text, vertical writing mode, terminal-style corner brackets, and film grain overlay evoke a cyberpunk sensibility. The use of Japanese without explicit cultural connection reads as aesthetic appreciation.
4. Minimalism with maximalist animation: The content is sparse (one paragraph about, 6 brief project descriptions), but the presentation is elaborately animated. This is a portfolio that shows what the creator can do through the medium itself rather than through verbose content.
5. Self-taught identity: The emphasis on being "self-taught" and "rebuilding foundations" is a core part of the personal narrative. The choice of vanilla JS without frameworks, custom Three.js scenes, and raw CSS demonstrates technical depth that a framework-based approach would obscure.
11. Technical Assessment
Strengths
- Deep Three.js knowledge: Multiple independent scenes, shader materials, post-processing, mouse interaction, scroll-driven animation, responsive geometry
- GSAP mastery: Timelines, ScrollTrigger pinning/scrubbing, character-level text animation, dynamic end calculations
- CSS sophistication: Custom properties, complex animations, responsive design across 15+ breakpoints, glassmorphism, blend modes
- Performance awareness: Pixel ratio capping, GPU acceleration, mobile detection, conditional rendering
- Security consideration: Model encryption shows awareness of asset protection
Areas for Improvement
- Code organization: Monolithic files (1843-line CSS, 909-line JS); no modularization
- No build system: While philosophically consistent, this means no minification, no tree-shaking, no modern JS features (classes, imports/exports beyond the globe module)
- Accessibility: Missing ARIA labels, no keyboard navigation, user-select disabled, no focus management
- Error handling: No try/catch blocks, no fallbacks if CDNs fail
- Hardcoded encryption key: The AES password in encrypt.cjs is security-by-obscurity
- Empty image sources: All work cards use placeholder.webp — actual project images are not yet linked
- Social links: Point to generic URLs (github.com, linkedin.com) rather than specific profiles in the header icons, though the contact section has specific handles
12. Summary
This portfolio website for Gia Khang is a technically accomplished, visually arresting single-page application that serves as both a professional showcase and a demonstration of front-end engineering capability. Built with vanilla HTML/CSS/JS and CDN-loaded Three.js and GSAP, it features three independent 3D WebGL scenes (an interactive globe, an ambient particle system, and a tech-logo sphere field), elaborate scroll-triggered animations, custom cursor tracking, a cinematic loading sequence with Japanese typography, and a dark cyberpunk aesthetic.
The project telegraphs its creator's identity as a self-taught systems-level engineer who values understanding foundational layers — choosing raw web fundamentals over abstractions, building custom 3D rendering rather than using templates, and encrypting 3D assets rather than leaving them exposed. It is simultaneously a portfolio, a design artifact, and a technical statement.
