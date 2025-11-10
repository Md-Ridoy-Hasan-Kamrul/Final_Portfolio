import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import TrueFocus from './TrueFocus';

export default function Hero() {
  return (
    <section
      id='home'
      className='min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden'
    >
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <motion.div
          className='absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl'
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl'
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className='max-w-7xl w-full mx-auto relative z-10'>
        <div className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
          {/* Text Content */}
          <motion.div
            className='space-y-6 sm:space-y-8 order-2 lg:order-1'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className='space-y-3 sm:space-y-4'>
              <motion.h2
                className='text-sm sm:text-base lg:text-lg font-medium text-gray-600 tracking-wide'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Hello, I'm
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  type: 'spring',
                  stiffness: 100,
                }}
              >
                <TrueFocus
                  sentence='Md. Ridoy Hasan Kamrul'
                  manualMode={false}
                  blurAmount={3}
                  borderColor='#3B82F6'
                  glowColor='rgba(59, 130, 246, 0.6)'
                  animationDuration={1.5}
                  pauseBetweenAnimations={0.8}
                />
              </motion.div>
              <motion.p
                className='text-xl sm:text-2xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold mt-4'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Front-End Developer
              </motion.p>
            </div>

            <motion.p
              className='text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl leading-relaxed'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Computer Science graduate specializing in MERN stack with a strong
              focus on frontend development. Building responsive, user-friendly
              web applications with React, Next.js, and modern web technologies.
            </motion.p>

            <motion.div
              className='flex flex-col sm:flex-row gap-4 pt-2 sm:pt-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.a
                href='#projects'
                className='cursor-target group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                aria-label='View my projects'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
                <ArrowRight
                  className='ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform'
                  aria-hidden='true'
                />
              </motion.a>
              <motion.a
                href='#contact'
                className='cursor-target inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium text-gray-900 bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg'
                aria-label='Get in touch'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.a>
            </motion.div>

            <motion.div
              className='flex gap-4 sm:gap-6 pt-4 sm:pt-8'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {[
                {
                  href: 'https://github.com/Md-Ridoy-Hasan-Kamrul',
                  icon: Github,
                  label: 'GitHub',
                },
                {
                  href: 'https://www.linkedin.com/in/md-ridoy-hasan-kamrul',
                  icon: Linkedin,
                  label: 'LinkedIn',
                },
                {
                  href: 'mailto:mdridoyhasankamrul@gmail.com',
                  icon: Mail,
                  label: 'Email',
                },
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.label !== 'Email' ? '_blank' : undefined}
                  rel={
                    social.label !== 'Email' ? 'noopener noreferrer' : undefined
                  }
                  className='cursor-target text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110'
                  aria-label={`Visit my ${social.label} profile`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                >
                  <social.icon
                    className='h-5 w-5 sm:h-6 sm:w-6'
                    aria-hidden='true'
                  />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Animated Profile Image */}
          <motion.div
            className='order-1 lg:order-2 flex justify-center lg:justify-end'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <motion.div
              className='relative'
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Gradient border wrapper */}
              <div className='relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96'>
                {/* Animated gradient border */}
                <motion.div
                  className='absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 blur-xl opacity-75'
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Inner gradient border */}
                <div className='absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1'>
                  {/* Image container */}
                  <div className='w-full h-full rounded-full overflow-hidden bg-white'>
                    {/* Placeholder for profile image */}
                    <div className='w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center'>
                      <motion.div
                        className='text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        RH
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Floating particles */}
                <motion.div
                  className='absolute -top-4 -right-4 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl'
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className='absolute -bottom-4 -left-4 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl'
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
