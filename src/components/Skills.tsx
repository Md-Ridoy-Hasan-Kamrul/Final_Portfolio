import ToonHubSkills from './ToonHubSkills';
import type { SkillCategory } from './ToonHubSkills';

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: [
      'React.js',
      'Next.js',
      'TypeScript',
      'JavaScript (ES6+)',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'Redux',
      'React Router',
    ],
  },
  {
    title: 'APIs & Integration',
    skills: ['REST APIs', 'Axios', 'Postman'],
  },
  {
    title: 'Performance & Quality',
    skills: [
      'Lighthouse',
      'Web Performance Optimization',
      'Accessibility',
      'SEO',
      'Cross-Browser Compatibility',
      'Jest',
    ],
  },
  {
    title: 'Tools & Deployment',
    skills: [
      'Git',
      'GitHub',
      'Vite',
      'Webpack',
      'Figma',
      'Vercel',
      'Coolify',
      'Railway',
      'CI/CD',
    ],
  },
  {
    title: 'Methodologies',
    skills: [
      'Agile',
      'Component-Based Architecture',
      'Responsive Design',
      'Client Requirement Analysis',
    ],
  },
];

export default function Skills() {
  return <ToonHubSkills categories={skillCategories} />;
}
