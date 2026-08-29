'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

// usePathname change de valeur à chaque navigation : on l'utilise comme
// clé du motion.div pour que Framer Motion détecte un "nouvel élément"
// et déclenche l'animation de sortie de l'ancienne page + entrée de la nouvelle.
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    // mode="wait" : attend la fin de l'animation de sortie avant de démarrer
    // celle d'entrée, pour éviter que les deux pages se chevauchent à l'écran.
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
