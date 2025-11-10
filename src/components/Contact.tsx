import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section
      id='contact'
      className='py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden'
    >
      {/* Background gradients */}
      <div className='absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl -z-0' />
      <div className='absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-100/30 to-transparent rounded-full blur-3xl -z-0' />

      <div className='max-w-7xl mx-auto relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>
            Let's Work Together
          </h2>
          <p className='text-base sm:text-lg text-gray-600 mb-12 sm:mb-16 max-w-2xl'>
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision. Feel free to reach out.
          </p>
        </motion.div>

        <div className='grid gap-8 sm:gap-12 md:grid-cols-2'>
          <motion.div
            className='space-y-6 sm:space-y-8'
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              {
                icon: Mail,
                title: 'Email',
                content: 'mdridoyhasankamrul@gmail.com',
                href: 'mailto:mdridoyhasankamrul@gmail.com',
              },
              {
                icon: Phone,
                title: 'Phone',
                content: '+880 1680 092066',
                href: 'tel:+8801680092066',
              },
              { icon: MapPin, title: 'Location', content: 'Dhaka, Bangladesh' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className='flex items-start gap-3 sm:gap-4 group'
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className='bg-gradient-to-br from-gray-100 to-gray-50 group-hover:from-blue-50 group-hover:to-purple-50 p-2.5 sm:p-3 mt-1 transition-all duration-300'
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <item.icon
                    className='h-5 w-5 sm:h-6 sm:w-6 text-gray-700 group-hover:text-blue-600 transition-colors'
                    aria-hidden='true'
                  />
                </motion.div>
                <div>
                  <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2'>
                    {item.title}
                  </h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      className='cursor-target text-sm sm:text-base text-blue-600 hover:text-blue-700 transition-colors break-all'
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className='text-sm sm:text-base text-gray-700'>
                      {item.content}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className='space-y-6 sm:space-y-8'
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h3 className='text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6'>
                Connect With Me
              </h3>
              <div className='flex gap-3 sm:gap-4'>
                <motion.a
                  href='https://github.com/Md-Ridoy-Hasan-Kamrul'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='cursor-target flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 text-white rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl'
                  aria-label='Visit my GitHub profile'
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0 }}
                  whileHover={{ y: -5, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github
                    className='h-5 w-5 sm:h-6 sm:w-6'
                    aria-hidden='true'
                  />
                </motion.a>
                <motion.a
                  href='https://www.linkedin.com/in/md-ridoy-hasan-kamrul'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='cursor-target flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl'
                  aria-label='Visit my LinkedIn profile'
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -5, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin
                    className='h-5 w-5 sm:h-6 sm:w-6'
                    aria-hidden='true'
                  />
                </motion.a>
              </div>
            </div>

            <motion.div
              className='bg-gradient-to-br from-blue-50 to-purple-50 p-6 sm:p-8 border-l-4 border-blue-600 shadow-md'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3'>
                Available for Freelance
              </h3>
              <p className='text-sm sm:text-base text-gray-700 leading-relaxed'>
                I'm currently available for freelance work and open to
                discussing new opportunities. Whether you have a project in mind
                or just want to connect, I'd love to hear from you.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
