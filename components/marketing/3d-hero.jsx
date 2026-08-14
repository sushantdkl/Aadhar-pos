"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function Hero3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x0f172a, 1)
    containerRef.current.appendChild(renderer.domElement)

    camera.position.z = 3

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x00d9ff, 1)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xff1493, 0.8)
    pointLight2.position.set(-5, -5, 5)
    scene.add(pointLight2)

    // Create POS Terminal 3D Model
    const group = new THREE.Group()

    // Main terminal body - sleek box
    const bodyGeometry = new THREE.BoxGeometry(1.2, 1.6, 0.3)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1f3a,
      metalness: 0.6,
      roughness: 0.2,
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    group.add(body)

    // Screen
    const screenGeometry = new THREE.PlaneGeometry(1, 1.2)
    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      metalness: 0.3,
      roughness: 0.1,
      emissive: 0x00a8cc,
      emissiveIntensity: 0.4,
    })
    const screen = new THREE.Mesh(screenGeometry, screenMaterial)
    screen.position.z = 0.16
    group.add(screen)

    // Top accent bar
    const accentGeometry = new THREE.BoxGeometry(1.2, 0.15, 0.3)
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xff1493,
      metalness: 0.8,
      roughness: 0.1,
      emissive: 0xff1493,
      emissiveIntensity: 0.3,
    })
    const accent = new THREE.Mesh(accentGeometry, accentMaterial)
    accent.position.z = 0.16
    accent.position.y = 0.75
    group.add(accent)

    // Side glow effects
    const glowGeometry = new THREE.PlaneGeometry(1.3, 1.7)
    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      metalness: 0,
      roughness: 1,
      transparent: true,
      opacity: 0.1,
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    glow.position.z = -0.2
    group.add(glow)

    scene.add(group)

    // Floating particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particleCount = 50
    const posArray = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 6
      posArray[i + 1] = (Math.random() - 0.5) * 6
      posArray[i + 2] = (Math.random() - 0.5) * 6
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00d9ff,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(particlesGeometry, particleMaterial)
    scene.add(particles)

    // Animation loop
    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      group.rotation.x += 0.003
      group.rotation.y += 0.005
      group.position.y = Math.sin(Date.now() * 0.0005) * 0.3

      particles.rotation.x += 0.0002
      particles.rotation.y += 0.0003

      pointLight1.position.x = Math.sin(Date.now() * 0.0005) * 8
      pointLight2.position.y = Math.cos(Date.now() * 0.0005) * 8

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="w-full h-screen absolute inset-0" />
}
