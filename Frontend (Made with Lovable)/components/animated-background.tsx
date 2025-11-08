"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      hue: number
      opacity: number
      shape: "circle" | "triangle" | "square"
      rotationSpeed: number
      rotation: number
      pulsePhase: number
      trail: Array<{ x: number; y: number; opacity: number }>
    }> = []

    // Create enhanced particles
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 80 + 30,
        speedX: (Math.random() - 0.5) * 1.2,
        speedY: (Math.random() - 0.5) * 1.2,
        hue: Math.random() * 360,
        opacity: Math.random() * 0.4 + 0.2,
        shape: ["circle", "triangle", "square"][Math.floor(Math.random() * 3)] as "circle" | "triangle" | "square",
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        rotation: 0,
        pulsePhase: Math.random() * Math.PI * 2,
        trail: [],
      })
    }

    let animationTime = 0

    const animate = () => {
      animationTime += 0.016 // ~60fps

      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      bgGradient.addColorStop(0, "rgba(15, 23, 42, 0.8)")
      bgGradient.addColorStop(0.5, "rgba(30, 41, 59, 0.9)")
      bgGradient.addColorStop(1, "rgba(15, 23, 42, 0.8)")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        const waveInfluence = Math.sin(animationTime * 0.5 + index) * 0.3
        particle.x += particle.speedX + waveInfluence
        particle.y += particle.speedY + Math.cos(animationTime * 0.3 + index) * 0.2

        // Enhanced edge bouncing with smooth transitions
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size

        particle.rotation += particle.rotationSpeed
        particle.pulsePhase += 0.05
        const pulseScale = 1 + Math.sin(particle.pulsePhase) * 0.3

        particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity })
        if (particle.trail.length > 8) particle.trail.shift()

        // Draw trail
        particle.trail.forEach((trailPoint, trailIndex) => {
          const trailOpacity = (trailPoint.opacity * trailIndex) / particle.trail.length
          const trailSize = (particle.size * trailIndex * pulseScale) / particle.trail.length

          const trailGradient = ctx.createRadialGradient(
            trailPoint.x,
            trailPoint.y,
            0,
            trailPoint.x,
            trailPoint.y,
            trailSize,
          )
          trailGradient.addColorStop(0, `hsla(${particle.hue}, 80%, 70%, ${trailOpacity * 0.3})`)
          trailGradient.addColorStop(1, `hsla(${particle.hue + 30}, 80%, 70%, 0)`)

          ctx.fillStyle = trailGradient
          ctx.filter = "blur(15px)"
          ctx.beginPath()
          ctx.arc(trailPoint.x, trailPoint.y, trailSize, 0, Math.PI * 2)
          ctx.fill()
        })

        particle.hue += 0.8

        const mainGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * pulseScale,
        )
        mainGradient.addColorStop(0, `hsla(${particle.hue}, 85%, 65%, ${particle.opacity * 0.4})`)
        mainGradient.addColorStop(0.4, `hsla(${particle.hue + 60}, 75%, 60%, ${particle.opacity * 0.3})`)
        mainGradient.addColorStop(1, `hsla(${particle.hue + 120}, 70%, 55%, 0)`)

        ctx.fillStyle = mainGradient
        ctx.filter = "blur(25px)"

        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation)
        ctx.scale(pulseScale, pulseScale)

        ctx.beginPath()
        switch (particle.shape) {
          case "circle":
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
            break
          case "triangle":
            ctx.moveTo(0, -particle.size)
            ctx.lineTo(-particle.size, particle.size)
            ctx.lineTo(particle.size, particle.size)
            ctx.closePath()
            break
          case "square":
            ctx.rect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
            break
        }
        ctx.fill()
        ctx.restore()

        const glowGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * pulseScale * 1.5,
        )
        glowGradient.addColorStop(0, `hsla(${particle.hue}, 90%, 80%, ${particle.opacity * 0.15})`)
        glowGradient.addColorStop(1, "transparent")

        ctx.fillStyle = glowGradient
        ctx.filter = "blur(40px)"
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * pulseScale * 1.2, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 moving-mesh-bg" />

      <div className="floating-particles">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>

      <motion.div
        className="video-bg-overlay"
        animate={{
          background: [
            "radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse at top right, rgba(168, 85, 247, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(236, 72, 153, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(6, 182, 212, 0.08) 0%, transparent 50%)",
            "radial-gradient(ellipse at top left, rgba(168, 85, 247, 0.1) 0%, transparent 50%), radial-gradient(ellipse at top right, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(ellipse at top left, rgba(236, 72, 153, 0.09) 0%, transparent 50%), radial-gradient(ellipse at top right, rgba(6, 182, 212, 0.09) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(59, 130, 246, 0.09) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(168, 85, 247, 0.09) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Enhanced canvas with better performance */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 mix-blend-screen opacity-30"
        style={{ background: "transparent" }}
      />
    </div>
  )
}
