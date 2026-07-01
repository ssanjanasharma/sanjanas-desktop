document.addEventListener('DOMContentLoaded', () => {
  let highestZ = 100;

  // --- AUDIO ASSETS & UTILITY (iOS Sound Effects) ---
  const audioFolder = 'audio/';
  const sfx = {
    day: new Audio(audioFolder + 'day.mp3'),
    night: new Audio(audioFolder + 'night.mp3'),
    click: new Audio(audioFolder + 'clickk.mp3'),
    close: new Audio(audioFolder + 'close.mp3'),
    water: new Audio(audioFolder + 'water.mp3')
  };

  sfx.day.volume = 0.15;
  sfx.night.volume = 0.8;
  sfx.click.volume = 0.25;
  sfx.close.volume = 0.25;
  sfx.water.volume = 0.25;

  // Helper to play a sound file with a synthesized AudioContext fallback
  function playSound(name, fallbackFn) {
    const audio = sfx[name];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.warn(`Audio play failed for ${name}, playing synthesized fallback:`, err);
        if (fallbackFn) fallbackFn();
      });
    } else if (fallbackFn) {
      fallbackFn();
    }
  }

  // --- AUDIO SYNTHESIS UTILITY (iOS Sound Effects Fallbacks) ---
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playiOSChargingSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // First tone (E5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second tone (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.08, now + 0.17);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  }

  function playiOSFolderClickSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.06);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  function playiOSCountdownTick() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, now);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  function playiOSCameraShutter() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Noise buffer generation for shutter sound
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(3, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.12);

    // Triangle mechanical click layer
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

    oscGain.gain.setValueAtTime(0.12, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  function playiOSPicClick() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.05);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  function playWaterDropSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }


  // Selectors
  const windows = document.querySelectorAll('.mac-window');
  const folders = document.querySelectorAll('.mac-folder');
  const activeAppLabel = document.getElementById('active-app-name');
  const menuClock = document.getElementById('menu-clock');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIconLight = document.getElementById('theme-icon-light');
  const themeIconDark = document.getElementById('theme-icon-dark');

  // Camera shortcut button in welcome screen
  const launchCamBtn = document.getElementById('launch-cam-btn');

  // Photo Booth window elements
  const winPhotoBooth = document.getElementById('win-photobooth');
  const webcamVideo = document.getElementById('webcam-video');
  const photoCanvas = document.getElementById('photo-canvas');
  const webcamFallback = document.getElementById('webcam-fallback');
  const shutterBtn = document.getElementById('shutter-btn');
  const shutterFlash = document.getElementById('shutter-flash');
  const countdownOverlay = document.getElementById('countdown-overlay');
  const filmstrip = document.getElementById('filmstrip');
  const shareBtn = document.getElementById('share-btn');
  let webcamStream = null;

  // --- DARK/LIGHT iOS THEME TOGGLE ---
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

    if (isDark) {
      document.body.classList.add('dark-mode');
      if (themeIconLight) themeIconLight.style.display = 'inline-block';
      if (themeIconDark) themeIconDark.style.display = 'none';
    } else {
      document.body.classList.remove('dark-mode');
      if (themeIconLight) themeIconLight.style.display = 'none';
      if (themeIconDark) themeIconDark.style.display = 'inline-block';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');

      if (isDark) {
        playSound('night', playiOSChargingSound);
        if (themeIconLight) themeIconLight.style.display = 'inline-block';
        if (themeIconDark) themeIconDark.style.display = 'none';
      } else {
        playSound('day', playiOSChargingSound);
        if (themeIconLight) themeIconLight.style.display = 'none';
        if (themeIconDark) themeIconDark.style.display = 'inline-block';
      }
    });
  }
  initTheme();

  // --- MENU CLOCK ---
  function updateMenuClock() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const day = days[now.getDay()];
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // hour 0 becomes 12
    menuClock.textContent = `${day} ${hours}:${minutes} ${ampm}`;
  }
  updateMenuClock();
  setInterval(updateMenuClock, 5000);

  // --- WINDOW LAYER MANAGEMENT ---
  function focusWindow(win) {
    highestZ += 1;
    win.style.zIndex = highestZ;
    windows.forEach(w => w.classList.remove('active-window'));
    win.classList.add('active-window');

    // Update active app name on menu bar
    let appName = 'Finder';
    if (win.id === 'win-about') appName = 'about.txt';
    else if (win.id === 'win-projects') appName = 'Projects';
    else if (win.id === 'win-skills') appName = 'skills.exe';
    else if (win.id === 'win-faq') appName = 'FAQ.md';
    else if (win.id === 'win-contact') appName = 'Contact';
    else if (win.id === 'win-links') appName = 'links.html';
    else if (win.id === 'win-photobooth') appName = 'Photo Booth';
    else if (win.id === 'win-welcome') appName = 'Photo Booth';

    if (activeAppLabel) {
      activeAppLabel.textContent = appName;
    }
  }

  function openWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    if (win.style.display === 'none' || win.style.display === '') {
      win.style.display = 'flex';

      if (window.innerWidth <= 1370) {
        win.style.top = '50%';
        win.style.left = '50%';
        win.style.transform = 'translate(-50%, -50%)';
        win.classList.add('open-active');
      } else {
        // Position window with random minor offset to avoid absolute overlaps
        const count = document.querySelectorAll('.mac-window[style*="display: flex"]').length;
        win.style.top = `calc(15% + ${count * 20}px)`;
        win.style.left = `calc(20% + ${count * 20}px)`;
        win.style.transform = '';
        win.classList.remove('open-active');
      }

      if (windowId === 'win-photobooth') {
        startWebcam();
      }
    } else {
      if (window.innerWidth <= 1370 && !win.classList.contains('open-active')) {
        win.classList.add('open-active');
      }
    }

    focusWindow(win);
  }

  function closeWindow(win) {
    win.style.display = 'none';
    win.classList.remove('open-active');
    if (win.id === 'win-photobooth') stopWebcam();
  }

  // Bind controls (Close, Minimize)
  windows.forEach(win => {
    const header = win.querySelector('.window-header');

    win.addEventListener('mousedown', () => focusWindow(win));
    win.addEventListener('touchstart', () => focusWindow(win), { passive: true });

    const closeBtn = win.querySelector('.win-close');
    const minBtn = win.querySelector('.win-min');
    const maxBtn = win.querySelector('.win-max');

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSound('close', playiOSFolderClickSound);
        closeWindow(win);
      });
    }

    if (minBtn) {
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeWindow(win);
      });
    }

    if (maxBtn) {
      maxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (win.dataset.maximized === 'true') {
          win.style.top = win.dataset.prevTop || '15%';
          win.style.left = win.dataset.prevLeft || '20%';
          win.style.width = win.dataset.prevWidth || '500px';
          win.style.height = win.dataset.prevHeight || '380px';
          win.dataset.maximized = 'false';
          win.classList.remove('maximized');
        } else {
          win.dataset.prevTop = win.style.top;
          win.dataset.prevLeft = win.style.left;
          win.dataset.prevWidth = win.style.width;
          win.dataset.prevHeight = win.style.height;

          win.style.top = '24px';
          win.style.left = '0';
          win.style.width = '100%';
          win.style.height = 'calc(100vh - 24px)';
          win.dataset.maximized = 'true';
          win.classList.add('maximized');
        }
      });
    }

    // Drag systems
    let isDragging = false;
    let startX, startY;
    let initX, initY;

    function startDrag(clientX, clientY) {
      if (window.innerWidth <= 1370) return;
      if (win.dataset.maximized === 'true') return;
      isDragging = true;
      startX = clientX;
      startY = clientY;
      initX = parseInt(window.getComputedStyle(win).left, 10) || 0;
      initY = parseInt(window.getComputedStyle(win).top, 10) || 0;
      focusWindow(win);
    }

    function moveDrag(clientX, clientY) {
      if (!isDragging) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      win.style.left = `${initX + dx}px`;
      win.style.top = `${initY + dy}px`;
    }

    function endDrag() {
      isDragging = false;
    }

    if (header) {
      header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.control-dot')) return;
        startDrag(e.clientX, e.clientY);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      header.addEventListener('touchstart', (e) => {
        if (e.target.closest('.control-dot')) return;
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY);
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
      });

      // Collapse/close drawer when header is clicked on mobile
      header.addEventListener('click', (e) => {
        if (window.innerWidth <= 1370) {
          if (e.target.closest('.control-dot')) return;
          playSound('close', playiOSFolderClickSound);
          closeWindow(win);
        }
      });
    }

    function onMouseMove(e) { moveDrag(e.clientX, e.clientY); }
    function onMouseUp() { endDrag(); document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); }

    function onTouchMove(e) { if (isDragging) e.preventDefault(); const touch = e.touches[0]; moveDrag(touch.clientX, touch.clientY); }
    function onTouchEnd() { endDrag(); document.removeEventListener('touchmove', onTouchMove); document.removeEventListener('touchend', onTouchEnd); }
  });

  // Folder clicks
  folders.forEach(folder => {
    folder.addEventListener('click', () => {
      playSound('click', playiOSFolderClickSound);
      const windowId = folder.getAttribute('data-window');
      if (windowId) openWindow(windowId);
    });
  });

  // Profile avatar clicks
  const profileAvatar = document.querySelector('.profile-avatar');
  if (profileAvatar) {
    profileAvatar.addEventListener('click', () => {
      playSound('click', playiOSPicClick);
    });
  }

  // Project clicks (play click sound and handle booth redirect)
  const projectEntries = document.querySelectorAll('.project-entry-custom');
  projectEntries.forEach(entry => {
    entry.addEventListener('click', (e) => {
      playSound('click', playiOSFolderClickSound);

      if (entry.id === 'project-booth-trigger') {
        const winProjects = document.getElementById('win-projects');
        if (winProjects) closeWindow(winProjects);
        openWindow('win-photobooth');
      }
    });
  });

  // Launch camera button click in welcome screen
  if (launchCamBtn) {
    launchCamBtn.addEventListener('click', () => {
      openWindow('win-photobooth');
    });
  }

  const welcomeShutterBtn = document.getElementById('welcome-shutter-btn');
  if (welcomeShutterBtn) {
    welcomeShutterBtn.addEventListener('click', () => {
      openWindow('win-photobooth');
    });
  }

  // --- PHOTO BOOTH WEBCAM & CAPTURE ---
  let activeFilter = 'original';
  const filterPills = document.querySelectorAll('.filter-pill');

  if (filterPills) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        activeFilter = pill.getAttribute('data-filter');

        // Update video viewport class
        webcamVideo.className = 'hide'; // keep hide status system working, remove other filter classes
        if (activeFilter !== 'original') {
          webcamVideo.className = `filter-${activeFilter}`;
        } else {
          webcamVideo.className = '';
        }
      });
    });
  }

  async function startWebcam() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        webcamStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        webcamVideo.srcObject = webcamStream;
        webcamVideo.classList.remove('hide');

        // Reapply active filter class on stream start
        if (activeFilter !== 'original') {
          webcamVideo.className = `filter-${activeFilter}`;
        } else {
          webcamVideo.className = '';
        }

        webcamFallback.classList.add('hide');
        webcamVideo.play().catch(e => console.log("Video play error:", e));
      } else {
        throw new Error("getUserMedia not supported in this browser context");
      }
    } catch (err) {
      console.log("Webcam access blocked or unavailable: ", err);
      webcamVideo.className = 'hide';
      webcamFallback.classList.remove('hide');
    }
  }

  function stopWebcam() {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      webcamStream = null;
    }
    webcamVideo.srcObject = null;
  }

  shutterBtn.addEventListener('click', () => {
    let counter = 3;
    countdownOverlay.textContent = counter;
    countdownOverlay.style.display = 'flex';
    playiOSCountdownTick();

    const countInterval = setInterval(() => {
      counter -= 1;
      if (counter > 0) {
        countdownOverlay.textContent = counter;
        playiOSCountdownTick();
      } else {
        clearInterval(countInterval);
        countdownOverlay.style.display = 'none';

        // Camera Flash Screen
        shutterFlash.classList.add('flash-active');
        setTimeout(() => shutterFlash.classList.remove('flash-active'), 400);

        playiOSCameraShutter();
        captureSnapshot();
      }
    }, 1000);
  });

  function captureSnapshot() {
    let capturedImgSrc = null;

    if (webcamStream) {
      photoCanvas.width = webcamVideo.videoWidth || 640;
      photoCanvas.height = webcamVideo.videoHeight || 480;
      const ctx = photoCanvas.getContext('2d');

      // Apply filters to context
      if (activeFilter === 'sepia') {
        ctx.filter = 'sepia(0.8) contrast(1.1) brightness(0.95)';
      } else if (activeFilter === 'soft') {
        ctx.filter = 'contrast(0.85) brightness(1.05) saturate(0.9)';
      } else {
        ctx.filter = 'none';
      }

      ctx.drawImage(webcamVideo, 0, 0, photoCanvas.width, photoCanvas.height);
      capturedImgSrc = photoCanvas.toDataURL('image/png');
    } else {
      capturedImgSrc = generateMockAvatar();
    }

    addSnapshotToFilmstrip(capturedImgSrc);
  }

  function addSnapshotToFilmstrip(imgSrc) {
    const emptyThumb = filmstrip.querySelector('.empty-thumb');

    const thumb = document.createElement('div');
    thumb.className = 'filmstrip-thumb';

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = "Snapshot";

    const delBtn = document.createElement('button');
    delBtn.className = 'thumb-del-btn';
    delBtn.textContent = '×';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      thumb.remove();
      if (filmstrip.querySelectorAll('.filmstrip-thumb:not(.empty-thumb)').length === 0) {
        filmstrip.innerHTML = `
          <div class="filmstrip-thumb empty-thumb"><span>Slot 1</span></div>
          <div class="filmstrip-thumb empty-thumb"><span>Slot 2</span></div>
          <div class="filmstrip-thumb empty-thumb"><span>Slot 3</span></div>
          <div class="filmstrip-thumb empty-thumb"><span>Slot 4</span></div>
        `;
      }
    });

    thumb.appendChild(img);
    thumb.appendChild(delBtn);

    // Click to download taken snap
    thumb.addEventListener('click', () => {
      playSound('click', playiOSPicClick);
      const link = document.createElement('a');
      link.href = imgSrc;
      link.download = `sanjanas_snap_${Date.now()}.png`;
      link.click();
    });

    if (emptyThumb) {
      emptyThumb.replaceWith(thumb);
    } else {
      filmstrip.appendChild(thumb);
    }
  }

  // Generates a mock sunset picture vector fallback
  function generateMockAvatar() {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');

    // Apply active filter to the mock canvas context
    if (activeFilter === 'sepia') {
      ctx.filter = 'sepia(0.8) contrast(1.1) brightness(0.95)';
    } else if (activeFilter === 'soft') {
      ctx.filter = 'contrast(0.85) brightness(1.05) saturate(0.9)';
    } else {
      ctx.filter = 'none';
    }

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 160, 120);
    gradient.addColorStop(0, '#ff7e5f');
    gradient.addColorStop(1, '#feb47b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sun circle
    ctx.beginPath();
    ctx.arc(80, 80, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    return canvas.toDataURL('image/png');
  }

  shareBtn.addEventListener('click', () => {
    const images = Array.from(filmstrip.querySelectorAll('.filmstrip-thumb:not(.empty-thumb) img'));
    if (images.length === 0) {
      alert('Click the camera shutter button to capture a snapshot first!');
      return;
    }

    const imageSrcs = images.map(img => img.src);

    // Create the canvas for 4 pictures strip matching reference layout (3:4 portrait)
    const canvas = document.createElement('canvas');
    const imgWidth = 300;
    const imgHeight = 400;
    const borderSide = 4;
    const borderTopBottom = 6;
    const gap = 4;

    canvas.width = imgWidth + borderSide * 2; // 308px width
    canvas.height = (imgHeight * 4) + (gap * 3) + (borderTopBottom * 2); // 1624px height

    const ctx = canvas.getContext('2d');

    // Set strip background color to solid black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let loadedCount = 0;
    const imgElements = [];
    const targetCount = 4;

    for (let i = 0; i < targetCount; i++) {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        loadedCount++;
        if (loadedCount === targetCount) {
          drawAndDownload();
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === targetCount) {
          drawAndDownload();
        }
      };

      if (imageSrcs[i]) {
        img.src = imageSrcs[i];
      } else {
        // If we have fewer than 4 images, simulate load immediately
        setTimeout(() => {
          loadedCount++;
          if (loadedCount === targetCount) {
            drawAndDownload();
          }
        }, 0);
      }
      imgElements.push(img);
    }

    function drawAndDownload() {
      for (let j = 0; j < targetCount; j++) {
        const x = borderSide;
        const y = borderTopBottom + j * (imgHeight + gap);

        if (imgElements[j] && imgElements[j].src) {
          // Crop the landscape webcam snapshot (usually 4:3 or 16:9) to a 3:4 portrait crop centered
          const sWidth = imgElements[j].width;
          const sHeight = imgElements[j].height;
          const sAspectRatio = sWidth / sHeight;
          const tAspectRatio = imgWidth / imgHeight; // 0.75

          let sx, sy, cropWidth, cropHeight;
          if (sAspectRatio > tAspectRatio) {
            cropHeight = sHeight;
            cropWidth = sHeight * tAspectRatio;
            sx = (sWidth - cropWidth) / 2;
            sy = 0;
          } else {
            cropWidth = sWidth;
            cropHeight = cropWidth / tAspectRatio;
            sx = 0;
            sy = (sHeight - cropHeight) / 2;
          }

          ctx.drawImage(imgElements[j], sx, sy, cropWidth, cropHeight, x, y, imgWidth, imgHeight);
        } else {
          // Empty slot placeholder
          ctx.fillStyle = '#111115';
          ctx.fillRect(x, y, imgWidth, imgHeight);
          ctx.fillStyle = '#44444a';
          ctx.font = 'bold 18px "SF Pro Display", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`Empty Slot ${j + 1}`, canvas.width / 2, y + imgHeight / 2);
        }
      }

      // Download the strip
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `sanjanas_photo_strip_${Date.now()}.png`;
      link.click();
    }
  });

  // --- SKILLS TAG PILLS SOUNDS ---
  const skillPills = document.querySelectorAll('.skill-tag-pill');
  skillPills.forEach(pill => {
    // Play click sound on mouse down
    pill.addEventListener('mousedown', () => {
      playSound('click', playiOSFolderClickSound);
    });
  });

  // --- CONTACT BUTTONS SOUNDS ---
  const contactButtons = document.querySelectorAll('.contact-card-btn, .contact-card-link');
  contactButtons.forEach(btn => {
    btn.addEventListener('mousedown', () => {
      playSound('click', playiOSFolderClickSound);
    });
  });

  // --- LINK GRID ITEMS SOUNDS ---
  const linkGridItems = document.querySelectorAll('.link-grid-item');
  linkGridItems.forEach(item => {
    item.addEventListener('mousedown', () => {
      playSound('click', playiOSFolderClickSound);
    });
  });

  // --- FAQ ACCORDION INTERACTIVITY ---
  const faqItems = document.querySelectorAll('.faq-ios-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-ios-header');
    const content = item.querySelector('.faq-ios-content');

    header.addEventListener('click', () => {
      // Play a cute iOS tick/click sound
      playSound('click', playiOSFolderClickSound);

      const isOpen = item.classList.contains('open');

      // Close all other FAQ items for a clean accordion effect
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-ios-content').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        content.style.maxHeight = null;
      } else {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
  // --- MOBILE EXPERIENCE NOTICE DISMISSAL ---
  const mobileNotice = document.getElementById('mobile-notice');
  const closeNoticeBtn = document.getElementById('close-notice-btn');
  if (mobileNotice && closeNoticeBtn) {
    closeNoticeBtn.addEventListener('click', () => {
      playSound('click', playiOSFolderClickSound);
      mobileNotice.style.display = 'none';
    });
  }

});
