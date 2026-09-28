import { motion, useReducedMotion } from 'motion/react'

const LETTERS = ['ق', 'ط', 'ب', 'ج', 'د']
const CYCLE = 1.6

/** Each qalqalah letter "bounces" in turn and sends out echo rings. */
export function QalqalahBounce() {
  const reduce = useReducedMotion()

  return (
    <svg viewBox="0 0 500 160" aria-hidden="true" className="anim-svg">
      {LETTERS.map((letter, i) => {
        // Right-to-left, in reading order.
        const cx = 420 - i * 85
        const delay = i * CYCLE * 0.5
        return (
          <g key={letter}>
            {!reduce &&
              [0, 0.25].map((offset) => (
                <motion.circle
                  key={offset}
                  cx={cx}
                  cy={80}
                  fill="none"
                  stroke="var(--tj-qalqalah)"
                  strokeWidth={3}
                  // Keyframes start invisible: Motion shows the first keyframe during `delay`, so a
                  // visible first frame would draw every ring at once until its turn.
                  initial={{ r: 20, opacity: 0 }}
                  animate={{ r: [20, 20, 55], opacity: [0, 0.9, 0] }}
                  transition={{
                    duration: 0.8,
                    times: [0, 0.05, 1],
                    delay: delay + offset,
                    repeat: Infinity,
                    repeatDelay: LETTERS.length * CYCLE * 0.5 - 0.8,
                  }}
                />
              ))}
            <motion.text
              x={cx}
              y={80}
              textAnchor="middle"
              dominantBaseline="central"
              className="anim-letter"
              fill="var(--tj-qalqalah)"
              animate={reduce ? undefined : { y: [0, -14, 4, 0] }}
              transition={{
                duration: 0.5,
                delay,
                repeat: Infinity,
                repeatDelay: LETTERS.length * CYCLE * 0.5 - 0.5,
                ease: 'easeOut',
              }}
            >
              {letter}
            </motion.text>
          </g>
        )
      })}
    </svg>
  )
}
