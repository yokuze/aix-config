## Layout Thrashing

Common causes:

- Reading a layout property forces a synchronous layout. offsetWidth, offsetHeight,
  offsetTop, clientWidth, scrollTop, scrollHeight, getBoundingClientRect(),
  getComputedStyle(), innerText, and focus(), and others.
- Alternating reads and writes in a loop is one case. For example, el.style.width =
  el.offsetWidth + 10 + 'px' inside a forEach runs one layout per item.
- A Vue watch or onUpdated that measures the DOM, writes, and then triggers another
  update.
- Measuring each row in a list component
- Calling a third-party positioning library on every frame

How to avoid it

- Do all reads first, then do all writes.
- Put DOM writes in requestAnimationFrame, and do reads before the frame or right after a
  write batch
- Cache measured values. Do not measure the same element again in the same frame.
- Use ResizeObserver and IntersectionObserver instead of measuring in scroll or resize
  handlers. In Vue, use useResizeObserver, useElementSize, and useIntersectionObserver. Or
  better yet, find a solution that does not require JavaScript. Consider progressive
  enhancement for non-essential features that involve CSS features outside of our
  browerserslist range and that would degrade gracefully.
- Animate transform and opacity only. Do not animate top, left, width, height, or margin,
  because those trigger layout on every frame.
- Change one class instead of setting several style properties one at a time.
- Build large DOM changes off-document, for example in a DocumentFragment, then insert
  them once.
- Use contain: layout or content-visibility: auto to limit how far a layout change
  spreads.
- Mark scroll and touch listeners { passive: true }, and throttle them to one run per
  frame.

How to find it

- In the Chrome DevTools Performance panel, look for purple "Layout" blocks with a "Forced
  reflow" warning, or the "Recalculate Style" then "Layout" pattern repeated inside one
  task.
