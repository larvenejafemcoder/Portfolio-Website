// ═══════════════════════════════════════════════════════
// LOADING SCREEN
// ═══════════════════════════════════════════════════════
(function initLoaderGame() {
  var container = document.getElementById("loaderGameIn");
  for (var i = 0; i < 27; i++) {
    var div = document.createElement("div");
    div.className = "loaderGame-line";
    container.appendChild(div);
  }
})();

var loadingWrap = document.getElementById("loadingWrap");
var loadingButton = document.getElementById("loadingButton");
var loadPercent = document.getElementById("loadPercent");

var loadState = { percent: 0 };
var interval = setInterval(function () {
  if (loadState.percent <= 50) {
    loadState.percent += Math.round(Math.random() * 5);
  } else {
    clearInterval(interval);
    interval = setInterval(function () {
      loadState.percent += Math.round(Math.random());
      if (loadState.percent > 91) {
        clearInterval(interval);
      }
    }, 2000);
  }
}, 100);

function finishLoading() {
  return new Promise(function (resolve) {
    clearInterval(interval);
    var fastInterval = setInterval(function () {
      if (loadState.percent < 100) {
        loadState.percent++;
      } else {
        clearInterval(fastInterval);
        resolve();
      }
    }, 2);
  });
}

var loadingClicked = false;

loadingButton.addEventListener("click", async function () {
  if (loadingClicked) return;
  loadingClicked = true;
  loadingButton.classList.add("loading-complete");
  await finishLoading();
  loadingWrap.classList.add("loading-clicked");
  document.getElementById("loaderGame").classList.add("loader-out");

  setTimeout(function () {
    document.getElementById("loading-screen").style.display = "none";
    document.body.style.overflowY = "auto";
    document.getElementById("mainBody").classList.add("main-active");

    gsap.to("body", { backgroundColor: "#0b080c", duration: 0.5, delay: 1 });

    initLandingAnimations();
    initScrollAnimations();
  }, 900);
});

loadingWrap.addEventListener("mousemove", function (e) {
  var rect = loadingWrap.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  loadingWrap.style.setProperty("--mouse-x", x + "px");
  loadingWrap.style.setProperty("--mouse-y", y + "px");
});

// ═══════════════════════════════════════════════════════
// GSAP SETUP
// ═══════════════════════════════════════════════════════
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.querySelectorAll(".header ul a").forEach(function (elem) {
  elem.addEventListener("click", function (e) {
    e.preventDefault();
    var section = elem.getAttribute("data-href");
    gsap.to(window, { scrollTo: section, duration: 1.5, ease: "power3.inOut" });
  });
});

// ═══════════════════════════════════════════════════════
// THREE.JS AMBIENT SCENE
// ═══════════════════════════════════════════════════════
(function initAmbientScene() {
  var container = document.getElementById("ambient-scene");
  if (!container) return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 8;

  var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  var COLORS = {
    violet: new THREE.Color("#6C47FF"),
    cyan: new THREE.Color("#00C9FF"),
  };

  // Particles
  var PARTICLE_COUNT = 300;
  var particleGeo = new THREE.BufferGeometry();
  var positions = new Float32Array(PARTICLE_COUNT * 3);
  var colors = new Float32Array(PARTICLE_COUNT * 3);
  var sizes = new Float32Array(PARTICLE_COUNT);

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    var i3 = i * 3;
    var radius = 5 + Math.random() * 15;
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(2 * Math.random() - 1);
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
    var color = Math.random() > 0.5 ? COLORS.violet : COLORS.cyan;
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
    sizes[i] = 1 + Math.random() * 3;
  }

  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  var particleMat = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  var particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Primitives
  var primitives = new THREE.Group();
  var geos = [
    new THREE.IcosahedronGeometry(0.6, 0),
    new THREE.OctahedronGeometry(0.5, 0),
    new THREE.TorusKnotGeometry(0.4, 0.15, 64, 8),
  ];

  geos.forEach(function (geo, i) {
    var angle = (i / 3) * Math.PI * 2;
    var radius = 2.5 + Math.random() * 1.5;
    var color = i % 2 === 0 ? COLORS.violet : COLORS.cyan;
    var mat = new THREE.MeshPhysicalMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.15,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: 0.3,
      wireframe: i === 2,
    });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 4,
      Math.sin(angle) * radius - 3
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.userData = {
      speed: 0.2 + Math.random() * 0.3,
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      ),
      floatOffset: Math.random() * Math.PI * 2,
      floatSpeed: 0.3 + Math.random() * 0.3,
      floatAmp: 0.3 + Math.random() * 0.3,
      baseY: mesh.position.y,
    };
    primitives.add(mesh);
  });

  scene.add(primitives);

  var isMobile = window.innerWidth < 768;
  if (isMobile) {
    particleMat.opacity = 0.15;
    primitives.children.forEach(function (child) {
      child.material.opacity = 0.1;
    });
  }

  var mouse = { x: 0, y: 0 };
  var target = { x: 0, y: 0 };
  var scrollProgress = 0;

  document.addEventListener("mousemove", function (e) {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener("scroll", function () {
    scrollProgress =
      window.scrollY /
      (document.body.scrollHeight - window.innerHeight);
  });

  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var elapsed = clock.getElapsedTime();

    target.x += (mouse.x * 0.3 - target.x) * 0.02;
    target.y += (-mouse.y * 0.2 - target.y) * 0.02;

    particles.rotation.x = target.y * 0.3 + scrollProgress * 0.5;
    particles.rotation.y = target.x * 0.3 + scrollProgress * 0.5;

    primitives.position.x = target.x * 0.2;
    primitives.position.y = target.y * 0.2;

    primitives.children.forEach(function (child) {
      var data = child.userData;
      child.rotation.x += data.rotSpeed.x;
      child.rotation.y += data.rotSpeed.y;
      child.rotation.z += data.rotSpeed.z;
      child.position.y =
        data.baseY +
        Math.sin(elapsed * data.floatSpeed + data.floatOffset) * data.floatAmp;
    });

    var opacity = 0.2 + scrollProgress * 0.3;
    particleMat.opacity = isMobile
      ? 0.15
      : Math.min(opacity, 0.5);

    renderer.render(scene, camera);
  }

  animate();
})();

// ═══════════════════════════════════════════════════════
// THREE.JS TECH STACK (Floating Spheres)
// ═══════════════════════════════════════════════════════
(function initTechStack() {
  var canvasContainer = document.getElementById("techCanvas");
  if (!canvasContainer) return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    32.5,
    canvasContainer.clientWidth / canvasContainer.clientHeight || 1,
    1,
    100
  );
  camera.position.set(0, 0, 20);

  var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMappingExposure = 1.5;
  canvasContainer.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x6c47ff, 1));

  var spotLight = new THREE.SpotLight(0x6c47ff, 1);
  spotLight.position.set(20, 20, 25);
  spotLight.angle = 0.2;
  spotLight.penumbra = 1;
  scene.add(spotLight);

  var dirLight = new THREE.DirectionalLight(0x00c9ff, 2);
  dirLight.position.set(0, 5, -4);
  scene.add(dirLight);

  var textureLoader = new THREE.TextureLoader();
  var imageUrls = [
    "/images/react2.webp",
    "/images/next2.webp",
    "/images/node2.webp",
    "/images/typescript.webp",
    "/images/javascript.webp",
  ];

  var sphereGeo = new THREE.SphereGeometry(1, 28, 28);
  var spheres = [];
  var sphereGroup = new THREE.Group();
  scene.add(sphereGroup);

  var active = false;

  var workSection = document.getElementById("work");
  function checkActive() {
    if (!workSection) return;
    var rect = workSection.getBoundingClientRect();
    active = rect.top < window.innerHeight;
  }

  checkActive();
  window.addEventListener("scroll", checkActive);

  var texCount = imageUrls.length;
  for (var i = 0; i < 20; i++) {
    (function (idx) {
      var scale = [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)];
      var texIdx = Math.floor(Math.random() * texCount);
      var texture = textureLoader.load(imageUrls[texIdx]);
      var mat = new THREE.MeshPhysicalMaterial({
        map: texture,
        emissive: "#ffffff",
        emissiveMap: texture,
        emissiveIntensity: 0.3,
        metalness: 0.5,
        roughness: 1,
        clearcoat: 0.1,
      });
      var mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.scale.setScalar(scale);
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40 - 25,
        (Math.random() - 0.5) * 40 - 10
      );
      mesh.rotation.set(0.3, 1, 1);
      mesh.userData = {
        scale: scale,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        ),
        basePos: mesh.position.clone(),
      };
      sphereGroup.add(mesh);
      spheres.push(mesh);
    })(i);
  }

  var mouseVec = new THREE.Vector2(100, 100);
  var pointerTarget = new THREE.Vector3();

  document.addEventListener("mousemove", function (e) {
    mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  var clock2 = new THREE.Clock();

  function animateTech() {
    requestAnimationFrame(animateTech);
    var delta = Math.min(clock2.getDelta(), 0.1);

    if (active) {
      pointerTarget.x = (mouseVec.x * 10 + pointerTarget.x * 9) / 10;
      pointerTarget.y = (mouseVec.y * 10 + pointerTarget.y * 9) / 10;

      spheres.forEach(function (sphere) {
        var pos = sphere.position;
        var dir = new THREE.Vector3()
          .copy(pos)
          .normalize()
          .multiplyScalar(-50 * delta * sphere.userData.scale);

        var force = new THREE.Vector3(
          (pointerTarget.x - pos.x) * 0.001,
          (pointerTarget.y - pos.y) * 0.001,
          -pos.z * 0.001
        );

        sphere.userData.velocity.add(force);
        sphere.userData.velocity.multiplyScalar(0.95);
        pos.add(sphere.userData.velocity);
      });

      sphereGroup.rotation.y += delta * 0.1;
    }

    renderer.render(scene, camera);
  }

  animateTech();

  window.addEventListener("resize", function () {
    camera.aspect =
      canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
  });
})();

// ═══════════════════════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════════════════════
(function initCursor() {
  var cursor = document.getElementById("cursorMain");
  var mousePos = { x: 0, y: 0 };
  var cursorPos = { x: 0, y: 0 };
  var hover = false;

  document.addEventListener("mousemove", function (e) {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  });

  function loop() {
    requestAnimationFrame(loop);
    if (!hover) {
      var delay = 6;
      cursorPos.x += (mousePos.x - cursorPos.x) / delay;
      cursorPos.y += (mousePos.y - cursorPos.y) / delay;
      gsap.to(cursor, { x: cursorPos.x, y: cursorPos.y, duration: 0.1 });
    }
  }
  loop();

  document.querySelectorAll("[data-cursor]").forEach(function (item) {
    item.addEventListener("mouseover", function (e) {
      var target = e.currentTarget;
      var rect = target.getBoundingClientRect();

      if (target.dataset.cursor === "icons") {
        cursor.classList.add("cursor-icons");
        gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1 });
        cursor.style.setProperty("--cursorH", rect.height + "px");
        hover = true;
      }
      if (target.dataset.cursor === "disable") {
        cursor.classList.add("cursor-disable");
      }
    });
    item.addEventListener("mouseout", function () {
      cursor.classList.remove("cursor-disable", "cursor-icons");
      hover = false;
    });
  });
})();

// ═══════════════════════════════════════════════════════
// SOCIAL ICONS HOVER
// ═══════════════════════════════════════════════════════
(function initSocialIcons() {
  var social = document.getElementById("social");
  if (!social) return;

  social.querySelectorAll("span").forEach(function (item) {
    var link = item.querySelector("a");
    if (!link) return;

    var rect = item.getBoundingClientRect();
    var mouseX = rect.width / 2;
    var mouseY = rect.height / 2;
    var currentX = 0;
    var currentY = 0;

    function updatePosition() {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      link.style.setProperty("--siLeft", currentX + "px");
      link.style.setProperty("--siTop", currentY + "px");
      requestAnimationFrame(updatePosition);
    }

    document.addEventListener("mousemove", function (e) {
      var r = item.getBoundingClientRect();
      var x = e.clientX - r.left;
      var y = e.clientY - r.top;
      if (x < 40 && x > 10 && y < 40 && y > 5) {
        mouseX = x;
        mouseY = y;
      } else {
        mouseX = rect.width / 2;
        mouseY = rect.height / 2;
      }
    });

    updatePosition();
  });
})();

// ═══════════════════════════════════════════════════════
// WHAT I DO - TOGGLE ON TOUCH
// ═══════════════════════════════════════════════════════
(function initWhatIDo() {
  var contents = document.querySelectorAll(".what-noTouch");
  if (ScrollTrigger && ScrollTrigger.isTouch) {
    contents.forEach(function (container) {
      container.classList.remove("what-noTouch");
      container.addEventListener("click", function () {
        container.classList.toggle("what-content-active");
        container.classList.remove("what-sibling");
        if (container.parentElement) {
          var siblings = Array.from(container.parentElement.children);
          siblings.forEach(function (sibling) {
            if (sibling !== container) {
              sibling.classList.remove("what-content-active");
              sibling.classList.toggle("what-sibling");
            }
          });
        }
      });
    });
  }
})();

// ═══════════════════════════════════════════════════════
// LANDING ANIMATIONS (after loader)
// ═══════════════════════════════════════════════════════
function initLandingAnimations() {
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    { opacity: 1, duration: 1.2, ease: "power1.inOut", delay: 0.1 }
  );

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.2, ease: "power1.inOut", delay: 0.8 }
  );

  function splitText(selector) {
    var chars = [];
    document.querySelectorAll(selector).forEach(function (el) {
      var text = el.textContent;
      el.textContent = "";
      for (var c = 0; c < text.length; c++) {
        var span = document.createElement("span");
        span.textContent = text[c] === " " ? "\u00A0" : text[c];
        span.style.display = "inline-block";
        el.appendChild(span);
        chars.push(span);
      }
    });
    return chars;
  }

  var landingChars1 = splitText(".landing-info h3");
  var landingChars2 = splitText(".landing-intro h2");
  var landingChars3 = splitText(".landing-intro h1");
  var allLandingChars = landingChars1.concat(landingChars2, landingChars3);

  gsap.fromTo(
    allLandingChars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.2,
      ease: "power3.inOut",
      stagger: 0.025,
      delay: 0.3,
    }
  );

  // Loop text animation for Designer/Developer
  var text1Chars = splitText(".landing-h2-info");
  var text2Chars = splitText(".landing-h2-info-1");
  var text3Chars = splitText(".landing-h2-1");
  var text4Chars = splitText(".landing-h2-2");

  function loopText(upChars, downChars) {
    var tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    var delay = 4;
    var delay2 = delay * 2 + 1;

    tl.fromTo(
      downChars,
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.inOut", stagger: 0.1, delay: delay },
      0
    )
      .fromTo(
        upChars,
        { y: 80 },
        { y: 0, duration: 1.2, ease: "power3.inOut", stagger: 0.1, delay: delay2 },
        1
      )
      .fromTo(
        upChars,
        { y: 0 },
        { y: -80, duration: 1.2, ease: "power3.inOut", stagger: 0.1, delay: delay },
        0
      )
      .to(
        downChars,
        { y: -80, duration: 1.2, ease: "power3.inOut", stagger: 0.1, delay: delay2 },
        1
      );
  }

  loopText(text1Chars, text2Chars);
  loopText(text3Chars, text4Chars);
}

// ═══════════════════════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════════
function initScrollAnimations() {
  // Work horizontal scroll
  var workTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".work-section",
      start: "top top",
      end: function () {
        var translateX = 0;
        var boxes = document.getElementsByClassName("work-box");
        if (boxes.length) {
          var rectLeft = document
            .querySelector(".work-container")
            .getBoundingClientRect().left;
          var rect = boxes[0].getBoundingClientRect();
          var parentWidth = boxes[0].parentElement.getBoundingClientRect()
            .width;
          var padding =
            parseInt(window.getComputedStyle(boxes[0]).padding) / 2;
          translateX =
            rect.width * boxes.length - (rectLeft + parentWidth) + padding;
        }
        return "+=" + translateX;
      },
      scrub: true,
      pin: true,
      id: "work",
    },
  });

  workTimeline.to(".work-flex", { x: function () {
    var translateX = 0;
    var boxes = document.getElementsByClassName("work-box");
    if (boxes.length) {
      var rectLeft = document
        .querySelector(".work-container")
        .getBoundingClientRect().left;
      var rect = boxes[0].getBoundingClientRect();
      var parentWidth = boxes[0].parentElement.getBoundingClientRect().width;
      var padding =
        parseInt(window.getComputedStyle(boxes[0]).padding) / 2;
      translateX =
        rect.width * boxes.length - (rectLeft + parentWidth) + padding;
    }
    return -translateX;
  }, ease: "none" });

  // Career timeline
  var careerTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 30%",
      end: "100% center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  careerTl
    .fromTo(".career-timeline", { maxHeight: "10%" }, { maxHeight: "100%", duration: 0.5 }, 0)
    .fromTo(".career-timeline", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0)
    .fromTo(".career-info-box", { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.5 }, 0)
    .fromTo(".career-dot", { animationIterationCount: "infinite" }, { animationIterationCount: "1", delay: 0.3, duration: 0.1 }, 0);

  if (window.innerWidth > 1024) {
    careerTl.fromTo(".career-section", { y: 0 }, { y: "20%", duration: 0.5, delay: 0.2 }, 0);
  }

  // Section reveals
  var sectionReveals = [
    { el: ".career-section h2", trigger: ".career-section", start: "top 75%" },
    { el: ".work-section h2", trigger: ".work-section", start: "top 75%" },
    { el: ".contact-section h3", trigger: ".contact-section", start: "top 75%" },
  ];

  sectionReveals.forEach(function (item) {
    var el = document.querySelector(item.el);
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 40, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item.trigger,
          start: item.start,
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Career boxes stagger
  var careerBoxes = document.querySelectorAll(".career-info-box");
  if (careerBoxes.length) {
    gsap.fromTo(
      careerBoxes,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "back.out(0.8)",
        scrollTrigger: {
          trigger: ".career-info",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  // Work boxes stagger
  var workBoxes = document.querySelectorAll(".work-box");
  if (workBoxes.length) {
    gsap.fromTo(
      workBoxes,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".work-flex",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  // Contact boxes stagger
  var contactBoxes = document.querySelectorAll(".contact-box");
  if (contactBoxes.length) {
    gsap.fromTo(
      contactBoxes,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".contact-flex",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  // What I do box reveal
  if (window.innerWidth <= 1024) {
    gsap.to(".what-box-in", {
      display: "flex",
      duration: 0.1,
      scrollTrigger: {
        trigger: ".what-box-in",
        start: "top 70%",
        end: "bottom top",
      },
    });
  }

  // Tags stagger
  var tags = document.querySelectorAll(".what-tags");
  if (tags.length) {
    gsap.fromTo(
      tags,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        stagger: 0.02,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".what-content-flex",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  // Split text on paragraphs and titles
  if (window.innerWidth >= 900) {
    document.querySelectorAll(".para").forEach(function (para) {
      var text = para.textContent;
      para.textContent = "";
      var words = text.split(" ");
      var wordSpans = [];
      words.forEach(function (word) {
        var span = document.createElement("span");
        span.textContent = word + " ";
        span.style.display = "inline-block";
        para.appendChild(span);
        wordSpans.push(span);
      });

      gsap.fromTo(
        wordSpans,
        { autoAlpha: 0, y: 80 },
        {
          autoAlpha: 1,
          scrollTrigger: {
            trigger: para.parentElement,
            toggleActions: "play pause resume reverse",
            start: "20% 60%",
          },
          duration: 1,
          ease: "power3.out",
          y: 0,
          stagger: 0.02,
        }
      );
    });

    document.querySelectorAll(".title").forEach(function (title) {
      var text = title.textContent;
      title.textContent = "";
      var chars = [];
      for (var c = 0; c < text.length; c++) {
        var span = document.createElement("span");
        span.textContent = text[c] === " " ? "\u00A0" : text[c];
        span.style.display = "inline-block";
        title.appendChild(span);
        chars.push(span);
      }

      gsap.fromTo(
        chars,
        { autoAlpha: 0, y: 80, rotate: 10 },
        {
          autoAlpha: 1,
          scrollTrigger: {
            trigger: title.parentElement,
            toggleActions: "play pause resume reverse",
            start: "20% 60%",
          },
          duration: 0.8,
          ease: "power2.inOut",
          y: 0,
          rotate: 0,
          stagger: 0.03,
        }
      );
    });
  }
}

// ═══════════════════════════════════════════════════════
// SCROLLTRIGGER REFRESH ON RESIZE
// ═══════════════════════════════════════════════════════
window.addEventListener("resize", function () {
  ScrollTrigger.refresh();
});
