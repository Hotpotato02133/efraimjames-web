import service1c from '../assets/service-1c.jpg';
import service2b from '../assets/service-2b.png';
import service1b from '../assets/service-1b.jpg';
import service2a from '../assets/service-2a.png';
import service1a from '../assets/service-1a.jpg';
import service2c from '../assets/service-2c.png';
import service3a from '../assets/service-3a.jpg';
import service4a from '../assets/service-4a.jpg';
import service3b from '../assets/service-3b.jpg';
import service4b from '../assets/service-4b.jpg';
import service4d from '../assets/service-4d.jpg';
import broadheaderProject from '../assets/Broadheader.jpg';
import facundoProject from '../assets/Facundo-cover.png';
import leaflyProject from '../assets/Leafly-cover.png';

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  category: string;
  link: string;
  year: string;
  client: string;
  role: string;
}

export const projects: Project[] = [
  {
    id: 'facundo',
    title: 'Facundo Booking',
    description: 'A focused booking reservation web app designed for Mr. Facundo, a well-known business owner in the Philippines.',
    fullDescription: 'Facundo is a specialized booking reservation web application tailored specifically for Mr. Facundo, a prominent business owner in the Philippines. The platform features an exclusive and premium design that reflects the high standards of his services, providing a seamless and user-friendly experience for his loyal clients to book appointments with ease.',
    image: facundoProject,
    tags: ['Web App', 'UI/UX Design', 'Booking System', 'Premium Design'],
    category: 'UI/UX Design',
    link: '#',
    year: '2024',
    client: 'Mr. Facundo',
    role: 'UI/UX Designer'
  },
  {
    id: 'leafly',
    title: 'Leafly',
    description: 'A comprehensive booking platform where businesses can list their services for users to book salon, spa, and barber appointments.',
    fullDescription: 'Leafly is an all-in-one booking reservation platform designed to connect users with various local wellness and beauty businesses. Salons, spas, and barbershops can easily list their services on the platform, allowing users to browse, compare, and instantly book the services they desire. The project focused on creating an intuitive multi-tenant structure with a clean, inviting aesthetic.',
    image: leaflyProject,
    tags: ['Multitenant', 'UI/UX Design', 'Booking Platform', 'Web App'],
    category: 'UI/UX Design',
    link: '#',
    year: '2024',
    client: 'Leafly Business Module',
    role: 'UI/UX Designer'
  },
  {
    id: 'broadheader',
    title: 'Broadheader',
    description: 'A comprehensive website builder platform with intuitive drag-and-drop functionality, designed to empower businesses to create professional websites seamlessly.',
    fullDescription: 'Broadheader is a powerful website builder platform that empowers businesses to create professional websites without coding knowledge. As the lead UI/UX Designer, I crafted an intuitive drag-and-drop interface and an extensive library of customizable templates and components. The design process heavily focused on creating a frictionless user experience, ensuring that complex website building tasks become accessible and visually cohesive for end-users.',
    image: broadheaderProject,
    tags: ['UI/UX Design', 'Product Design', 'Figma', 'Prototyping', 'User Research'],
    category: 'UI/UX Design',
    link: 'https://www.broadheader.com/',
    year: '2024',
    client: 'Broadheader Technologies',
    role: 'UI/UX Designer'
  },
  {
    id: 'veloura',
    title: 'Veloura',
    description: 'A modern e-commerce platform with elegant design and seamless user experience for online shopping.',
    fullDescription: 'Veloura is a premium e-commerce platform designed with elegance and user experience at its core. The design features clean aesthetics, intuitive navigation, and a streamlined checkout process. Every element was carefully crafted to enhance the shopping experience and increase conversion rates while maintaining a sophisticated visual identity.',
    image: service1c,
    tags: ['Web Design', 'E-commerce', 'Figma', 'UI/UX'],
    category: 'Web Design',
    link: 'https://www.behance.net/gallery/212698409/Veloura-Web-Design-Figma',
    year: '2024',
    client: 'Veloura Fashion',
    role: 'Web Designer'
  },
  {
    id: 'oro-dashboard',
    title: 'ORO Dashboard',
    description: 'An intelligent dashboard featuring AI integration for enhanced data visualization and user interaction.',
    fullDescription: 'ORO Dashboard is an intelligent analytics platform that leverages AI integration to provide enhanced data visualization and user interaction. Built with React and TypeScript, the dashboard offers real-time insights, customizable widgets, and predictive analytics. The interface was designed to present complex data in an accessible and actionable format.',
    image: service2b,
    tags: ['React', 'AI Integration', 'Dashboard', 'TypeScript'],
    category: 'Frontend',
    link: 'https://orowonder.vercel.app/',
    year: '2024',
    client: 'ORO Analytics',
    role: 'Frontend Developer'
  },
  {
    id: 'buenas-coffee',
    title: 'Buenas Coffee',
    description: 'A warm and inviting landing page design for a coffee shop with rich visuals and modern aesthetics.',
    fullDescription: 'Buenas Coffee is a beautifully crafted landing page design that captures the warmth and inviting atmosphere of a premium coffee shop. The design features rich visuals, modern aesthetics, and carefully selected typography that evokes the sensory experience of enjoying quality coffee. The project focused on creating an emotional connection with visitors.',
    image: service1b,
    tags: ['Landing Page', 'Web Design', 'Branding', 'UI/UX'],
    category: 'Web Design',
    link: 'https://www.behance.net/gallery/183390349/Buenas-Coffee-II-Landing-Page',
    year: '2023',
    client: 'Buenas Coffee Co.',
    role: 'Web Designer'
  },
  {
    id: 'car-rental-ph',
    title: 'Car Rental PH',
    description: 'A comprehensive car rental platform with booking system and vehicle management features.',
    fullDescription: 'Car Rental PH is a full-featured car rental platform built for the Philippine market. The application includes a comprehensive booking system, vehicle management features, and user authentication. Built with React and modern JavaScript, the platform offers a responsive design that works seamlessly across all devices.',
    image: service2a,
    tags: ['React', 'Booking System', 'Responsive', 'JavaScript'],
    category: 'Frontend',
    link: 'https://car-rental-alpha-bice.vercel.app/',
    year: '2023',
    client: 'Car Rental PH',
    role: 'Frontend Developer'
  },
  {
    id: 'hyde-learning',
    title: 'Hyde Learning',
    description: 'An innovative online learning platform interface with clean design and intuitive user experience.',
    fullDescription: 'Hyde Learning is an innovative online learning platform designed to make education accessible and engaging. The interface features clean design principles, intuitive navigation, and thoughtful user experience patterns. The project focused on creating an environment that promotes focused learning while maintaining visual appeal.',
    image: service1a,
    tags: ['UI Design', 'Education', 'Landing Page', 'UX'],
    category: 'Web Design',
    link: 'https://www.behance.net/gallery/186754327/Hyde-Online-Learning-Platform-UI-Design',
    year: '2023',
    client: 'Hyde Education',
    role: 'UI Designer'
  },
  {
    id: 'oro-landing',
    title: 'ORO Landing',
    description: 'A sleek and modern landing page with compelling design elements and clear call-to-actions.',
    fullDescription: 'ORO Landing is a sleek and modern landing page designed to convert visitors into customers. The design features compelling visual elements, clear call-to-actions, and a responsive layout that adapts to any device. Built with React, the page offers smooth animations and optimized performance.',
    image: service2c,
    tags: ['React', 'Landing Page', 'Modern Design', 'Responsive'],
    category: 'Frontend',
    link: 'https://react-landing-page-or-ov2.vercel.app/',
    year: '2023',
    client: 'ORO Technologies',
    role: 'Frontend Developer'
  },
  {
    id: 'ofbank-mobile',
    title: 'OFBank Mobile',
    description: 'A comprehensive mobile banking app redesign focusing on user experience and financial accessibility.',
    fullDescription: 'OFBank Mobile is a comprehensive redesign of a mobile banking application with a focus on user experience and financial accessibility. The project involved reimagining the entire user journey, from onboarding to daily transactions. The new design emphasizes security, ease of use, and accessibility for users of all technical backgrounds.',
    image: service3a,
    tags: ['Mobile App', 'Banking', 'UI/UX', 'Redesign'],
    category: 'UI/UX Design',
    link: 'https://www.behance.net/gallery/180193513/OFBank-Mobile-App-Redesign',
    year: '2023',
    client: 'OFBank',
    role: 'UI/UX Designer'
  },
  {
    id: 'logo-design',
    title: 'Logo Design',
    description: 'Professional brand identity and logo design services with creative and memorable visual solutions.',
    fullDescription: 'This logo design project showcases professional brand identity work with creative and memorable visual solutions. The project involved creating distinctive logos that capture the essence of each brand, ensuring they work across various applications and scales. Each design balances creativity with practicality.',
    image: service4a,
    tags: ['Branding', 'Logo Design', 'Identity', 'Creative'],
    category: 'Graphic Design',
    link: 'https://www.behance.net/gallery/181927731/Team-LAU-Logo-Design-Team-T-shirt-Design',
    year: '2023',
    client: 'Various Clients',
    role: 'Graphic Designer'
  },
  {
    id: 'travelista',
    title: 'Travelista',
    description: 'A travel platform UI design with immersive visuals and user-friendly navigation for travel enthusiasts.',
    fullDescription: 'Travelista is a travel platform UI design that brings wanderlust to life through immersive visuals and user-friendly navigation. The design captures the excitement of travel while providing practical functionality for booking and planning trips. Every element was designed to inspire and facilitate the travel planning process.',
    image: service3b,
    tags: ['Travel', 'UI Design', 'Web Design', 'UX'],
    category: 'UI/UX Design',
    link: 'https://www.behance.net/gallery/181942299/Travelista-UI-Design-Web-Design',
    year: '2023',
    client: 'Travelista',
    role: 'UI Designer'
  },
  {
    id: 'poster-design',
    title: 'Poster Design',
    description: 'Eye-catching poster designs for various campaigns and events with strong visual impact.',
    fullDescription: 'This poster design collection features eye-catching designs created for various campaigns and events. Each poster was crafted to deliver strong visual impact and effectively communicate the intended message. The designs balance artistic expression with clear communication objectives.',
    image: service4b,
    tags: ['Poster', 'Print Design', 'Marketing', 'Visual Design'],
    category: 'Graphic Design',
    link: 'https://www.behance.net/gallery/185524145/Hiring-Poster-Design',
    year: '2023',
    client: 'Various Clients',
    role: 'Graphic Designer'
  },
  {
    id: 'banner-design',
    title: 'Banner Design',
    description: 'Professional banner designs for digital marketing campaigns with compelling visual elements.',
    fullDescription: 'This banner design project includes professional designs for digital marketing campaigns. Each banner was created with compelling visual elements that capture attention and drive engagement. The designs are optimized for various platforms and sizes while maintaining brand consistency.',
    image: service4d,
    tags: ['Banner', 'Digital Marketing', 'Advertising', 'Design'],
    category: 'Graphic Design',
    link: 'https://www.behance.net/gallery/211765299/Sample-Banner-Design',
    year: '2024',
    client: 'Various Clients',
    role: 'Graphic Designer'
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getRelatedProjects = (currentId: string, category: string, limit: number = 3): Project[] => {
  return projects
    .filter(project => project.id !== currentId && project.category === category)
    .slice(0, limit);
};
