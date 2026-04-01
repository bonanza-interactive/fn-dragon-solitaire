const BUNDLE = [];
const LOADED = new Set();
const elem = document.createElement('div');
const button = document.createElement('button');
const clipboardCpy = document.createElement('button');
const grid = document.createElement('div');
let visibility = true;

function isOwned(resMap, id) {
  return (resMap.find(id)?.owners?.size ?? 0) > 0;
}

// Iterate through all ResouceMaps in Gfx and mark filenames which are in use
function pollResources() {
  const gfx = window.Core?.gfx;

  if (gfx && BUNDLE.length > 0) {
    for (const as of BUNDLE) {
      switch(as.type) {
        case 'Texture': {
          if (isOwned(gfx.textures, as.id)) LOADED.add(as.src);
        }
        break;
        case 'Program': {
          if (isOwned(gfx.programs, as.id)) {
            LOADED.add(as.fs);
            LOADED.add(as.vs);
          }
        }
        break;
        case 'SpineSkeleton': {
          if (isOwned(gfx.spineSkeletons, as.id)) LOADED.add(as.src);
        }
        break;
        case 'SpineAtlas': {
          if (isOwned(gfx.spineAtlases, as.id)) LOADED.add(as.src);
        }
        break;
        case 'BitmapFont': {
          if (isOwned(gfx.bmFonts, as.id)) LOADED.add(as.id);
        }
        break;
      }
    }
  }

  requestAnimationFrame(pollResources);
}

// Callback for WebSocket messages
function handleMessage(msg) {
  BUNDLE.length = 0;
  BUNDLE.push(...msg);
}

// Remove filenames found in LOADED from BUNDLE and return resulting set
function calcSetDifference() {
  const allFiles = new Set(BUNDLE.map(e => {
    switch (e.type) {
      case 'Program':
        return [e.vs, e.fs];
      case 'BitmapFont':
        return [e.id];
      case 'Sound': return [];
      default:
        return [e.src];
    }
  }).flat().filter(Boolean));

  return Array.from(allFiles.values())
    .filter(e => !LOADED.has(e))
    .sort();
}

function renderSetDifference() {
  if (BUNDLE.length > 0) {
    if (window.Core?.gfx) {
      const unused = calcSetDifference();
      grid.innerHTML = unused.map(e => `<div>${e}</div>`).join('\n');
      button.innerText = `Unused assets (${unused.length})`;

      clipboardCpy.style.visibility = unused.length > 0 ? 'visible' : 'hidden';
    } else {
      grid.innerHTML =
        `<div style="color: salmon"><code style="font-family: revert">Core</code> was not present in global window object. Execute <code style="font-family: revert">expose('Core', CORE)</code> in main.ts to fix.</div>`
    }
  }
}

function applyButtonStyle(btn) {
  btn.style.float = 'right';
  btn.style.backgroundColor = '#394b59';
  btn.style.color = '#f5f8fa';
  btn.style.backgroundImage = 'linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))';
  btn.style.borderRadius = '3px';
  btn.style.borderWidth = '1px';
  btn.style.borderColor = '#202B33';
  btn.style.padding = '5px 10px';
}

// Style CSS grid
elem.style.position = 'fixed';
elem.style.top = '2rem';
elem.style.right = '0px';
elem.style.zIndex = 10000;
grid.style.display = 'grid';
grid.style.backgroundColor = 'rgba(0.2,0.2,0.2,0.4)';
grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(160px, 1fr))';
grid.style.maxHeight = '50vh';
grid.style.maxWidth = '60vh';
grid.style.overflowY = 'auto';
grid.style.clear = 'both';
grid.style.columnGap = '1em';
grid.style.backdropFilter = "blur(4px)";
grid.style.fontSize = '.9rem';

// Style visibility button
applyButtonStyle(button);
button.innerText = '...';
button.addEventListener('click', () => {
  visibility = !visibility;
  grid.style.display = visibility ? 'grid' : 'none';
  clipboardCpy.style.display = visibility ? 'block' : 'none';
});

// Style clipboard button
applyButtonStyle(clipboardCpy);
clipboardCpy.innerText = 'Copy to clipboard';
clipboardCpy.style.visibility = 'hidden';
clipboardCpy.addEventListener('click', () => {
  navigator.clipboard.writeText(calcSetDifference().join('\n'));
});

// Insert UI components into HTML page
elem.appendChild(button);
elem.appendChild(clipboardCpy)
elem.appendChild(grid);
document.body.appendChild(elem);

// Register UI update callbacks
requestAnimationFrame(pollResources);
setInterval(renderSetDifference, 2000);

// Connect to dev-server to receive bundle contents
const sock = new WebSocket(`ws://${new URL(location.origin).host}/__tracker`);
sock.addEventListener('open', () => sock.send(JSON.stringify('bundle')));
sock.addEventListener('message', e => handleMessage(JSON.parse(e.data)));
