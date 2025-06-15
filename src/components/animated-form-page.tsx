import { motion, type Variants } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedFormPageProps {
  children: ReactNode
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20
    }
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20
    }
  }
}

export function AnimatedFormPage({ children }: AnimatedFormPageProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-zinc-950"
    >
      {children}
    </motion.div>
  )
}

export function AnimatedFormSection({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={itemVariants}
      className="space-y-6"
    >
      {children}
    </motion.div>
  )
}

export function AnimatedCard({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedFormContainer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-zinc-900 rounded-lg border border-zinc-800 divide-y divide-zinc-800"
    >
      {children}
    </motion.div>
  )
}

export function AnimatedPreview({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={itemVariants}
      className="hidden lg:block"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ 
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        delay: 0.3 
      }}
    >
      {children}
    </motion.div>
  )
} 