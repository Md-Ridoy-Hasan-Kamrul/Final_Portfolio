export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gray-900 dark:bg-gray-950 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col gap-4 sm:gap-6 md:flex-row md:justify-between md:items-center'>
          <div className='text-center md:text-left'>
            <p className='text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-white dark:text-gray-100'>
              Md. Ridoy Hasan Kamrul
            </p>
            <p className='text-gray-400 dark:text-gray-500 text-xs sm:text-sm'>
              Front-End Developer specializing in MERN Stack
            </p>
          </div>

          <div className='flex flex-col items-center gap-2 sm:gap-4 md:items-end'>
            <p className='text-gray-400 dark:text-gray-500 text-xs sm:text-sm'>
              &copy; {currentYear} All rights reserved.
            </p>
            <p className='text-gray-500 dark:text-gray-600 text-[10px] sm:text-xs'>
              Built with React, TypeScript & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
