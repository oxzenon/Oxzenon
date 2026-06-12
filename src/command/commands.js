// Command registry. Each command has a unique id, a label shown in the
// palette, a glyph (Font Awesome), and a `run` thunk that receives a
// context object so we can navigate / toggle UI state from one place.
export function buildCommands(ctx) {
  return [
    { id: 'goto:hero',     glyph: 'fas fa-house',         label: 'goto: /whoami',          hint: 'jump to hero',        run: () => ctx.scrollTo('hero')     },
    { id: 'goto:about',    glyph: 'fas fa-user-astronaut', label: 'goto: /about',           hint: 'who is oxzenon',      run: () => ctx.scrollTo('about')    },
    { id: 'goto:projects', glyph: 'fas fa-folder-tree',   label: 'goto: /ls projects',      hint: 'browse work',         run: () => ctx.scrollTo('projects') },
    { id: 'goto:stats',    glyph: 'fas fa-bolt',          label: 'goto: /stat sol',         hint: 'solana stats',        run: () => ctx.scrollTo('stats')    },
    { id: 'goto:game',     glyph: 'fas fa-gamepad',       label: 'goto: /game catch-sol',   hint: 'play the mini-game',  run: () => ctx.scrollTo('game')     },
    { id: 'goto:contact',  glyph: 'fas fa-paper-plane',   label: 'goto: /mail',             hint: 'send a message',      run: () => ctx.scrollTo('contact')  },

    { id: 'toggle:scan',   glyph: 'fas fa-tv',            label: 'toggle: scan-lines',      hint: 'CRT overlay on/off',  run: () => ctx.toggleScan()         },

    { id: 'open:github',   glyph: 'fab fa-github',        label: 'open: github.com/oxzenon', hint: 'external link',      run: () => window.open('https://github.com/oxzenon', '_blank') },
    { id: 'open:twitter',  glyph: 'fab fa-twitter',       label: 'open: x.com/Oxzenon001',   hint: 'external link',      run: () => window.open('https://x.com/Oxzenon001', '_blank') },

    { id: 'sys:replay-boot', glyph: 'fas fa-power-off',   label: 'sys: replay boot',         hint: 'force boot screen',  run: () => { localStorage.removeItem('oxzenonBooted'); location.search = '?boot=1'; } },
  ];
}
