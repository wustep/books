// Original vector art: a family of open gestures, like a baton moving through air.
export function gesture({ compact = false, id = 'gesture' } = {}) {
  const paths = Array.from({ length: 24 }, (_, i) => {
    const inset = i * 6.1;
    const d = `M ${82 + inset * .28} ${397 - inset * .27} C ${-40 + inset} ${240 - inset * .25}, ${134 + inset * .1} ${-37 + inset * .83}, ${338 - inset * .33} ${85 + inset * .5} C ${528 - inset * .9} ${205 - inset * .12}, ${459 - inset * .25} ${485 - inset * .65}, ${259 - inset * .38} ${397 - inset * .34} C ${119 - inset * .05} ${335 - inset * .18}, ${167 + inset * .35} ${173 + inset * .3}, ${346 + inset * .3} ${222 + inset * .54}`;
    return `<path d="${d}" stroke="url(#${id}-color)" stroke-width="${i % 6 === 0 ? 3 : 1.5}"/>`;
  }).join('');
  return `<svg class="gesture ${compact ? 'gesture-compact' : ''}" viewBox="0 0 520 500" fill="none" aria-hidden="true" focusable="false">
    <defs><linearGradient id="${id}-color" x1="72" y1="400" x2="425" y2="80" gradientUnits="userSpaceOnUse"><stop stop-color="oklch(57% .2 32)"/><stop offset=".45" stop-color="oklch(74% .16 62)"/><stop offset="1" stop-color="oklch(86% .16 82)"/></linearGradient></defs>
    <g class="gesture-lines">${paths}</g>
    <g class="baton"><path d="M256 290 439 121" stroke="oklch(24% .02 45)" stroke-width="3" stroke-linecap="round"/><path d="m256 290 30-28" stroke="oklch(24% .02 45)" stroke-width="9" stroke-linecap="round"/></g>
    <circle cx="439" cy="121" r="6" fill="oklch(57% .2 32)"/>
  </svg>`;
}

export const mark = `<svg viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false"><path d="M7 30C-1 14 17 0 30 10S36 39 21 32 13 16 32 20M12 29C6 17 19 7 27 14S30 32 22 27M18 28 36 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`;
export const arrow = `<span aria-hidden="true">↗</span>`;
