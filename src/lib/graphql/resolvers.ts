import { GraphQLError } from 'graphql'

// Mock data - this will be replaced with your actual JSON data later
const mockData = {
    about: {
        id: '1',
        name: 'Your Name',
        title: 'Full Stack Developer',
        bio: 'Passionate developer with experience in modern web technologies. I love building scalable applications and learning new technologies.',
        avatar: '/images/avatar.jpg',
        location: 'Your City, Country',
        email: 'your.email@example.com',
        phone: '+1 (555) 123-4567',
        website: 'https://yourwebsite.com',
    },
    projects: [
        {
            id: '1',
            title: 'E-Commerce Platform',
            description:
                'A full-stack e-commerce platform built with Next.js, TypeScript, and Stripe integration.',
            image: '/images/projects/ecommerce.jpg',
            technologies: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS'],
            githubUrl: 'https://github.com/yourusername/ecommerce',
            liveUrl: 'https://ecommerce-demo.com',
            featured: true,
            createdAt: '2024-01-15',
        },
        {
            id: '2',
            title: 'Task Management App',
            description:
                'A collaborative task management application with real-time updates.',
            image: '/images/projects/task-app.jpg',
            technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
            githubUrl: 'https://github.com/yourusername/task-app',
            liveUrl: 'https://task-app-demo.com',
            featured: true,
            createdAt: '2023-11-20',
        },
    ],
    skills: [
        {
            id: '1',
            name: 'React',
            category: 'FRONTEND',
            proficiency: 'EXPERT',
            icon: 'react',
        },
        {
            id: '2',
            name: 'TypeScript',
            category: 'LANGUAGES',
            proficiency: 'ADVANCED',
            icon: 'typescript',
        },
        {
            id: '3',
            name: 'Node.js',
            category: 'BACKEND',
            proficiency: 'ADVANCED',
            icon: 'nodejs',
        },
        {
            id: '4',
            name: 'PostgreSQL',
            category: 'DATABASE',
            proficiency: 'INTERMEDIATE',
            icon: 'postgresql',
        },
    ],
    experience: [
        {
            id: '1',
            title: 'Senior Full Stack Developer',
            company: 'Tech Company Inc.',
            location: 'San Francisco, CA',
            startDate: '2022-01-01',
            endDate: null,
            current: true,
            description:
                'Leading development of web applications using React, Node.js, and cloud technologies.',
            technologies: ['React', 'Node.js', 'AWS', 'Docker'],
        },
        {
            id: '2',
            title: 'Frontend Developer',
            company: 'Startup XYZ',
            location: 'Remote',
            startDate: '2020-06-01',
            endDate: '2021-12-31',
            current: false,
            description:
                'Built responsive user interfaces and implemented modern frontend architectures.',
            technologies: ['React', 'TypeScript', 'Redux', 'Sass'],
        },
    ],
    education: [
        {
            id: '1',
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of Technology',
            location: 'Your City, Country',
            startDate: '2016-09-01',
            endDate: '2020-05-31',
            current: false,
            description: 'Focused on software engineering and web development.',
            gpa: 3.8,
        },
    ],
    contact: [
        {
            id: '1',
            type: 'EMAIL',
            value: 'your.email@example.com',
            icon: 'email',
        },
        {
            id: '2',
            type: 'GITHUB',
            value: 'https://github.com/yourusername',
            icon: 'github',
        },
        {
            id: '3',
            type: 'LINKEDIN',
            value: 'https://linkedin.com/in/yourusername',
            icon: 'linkedin',
        },
    ],
}

export const resolvers = {
    Query: {
        about: () => mockData.about,

        projects: () => mockData.projects,

        featuredProjects: () =>
            mockData.projects.filter((project) => project.featured),

        project: (_: any, { id }: { id: string }) => {
            const project = mockData.projects.find((p) => p.id === id)
            if (!project) {
                throw new GraphQLError('Project not found', {
                    extensions: { code: 'NOT_FOUND' },
                })
            }
            return project
        },

        skills: () => mockData.skills,

        skillsByCategory: (_: any, { category }: { category: string }) => {
            return mockData.skills.filter(
                (skill) => skill.category === category
            )
        },

        experience: () => mockData.experience,

        currentExperience: () =>
            mockData.experience.filter((exp) => exp.current),

        education: () => mockData.education,

        contact: () => mockData.contact,
    },

    Mutation: {
        sendMessage: async (
            _: any,
            {
                name,
                email,
                message,
            }: { name: string; email: string; message: string }
        ) => {
            try {
                // Here you would typically send the message via email or save to database
                // For now, we'll just return a success response
                console.log('Message received:', { name, email, message })

                return {
                    success: true,
                    message: 'Message sent successfully!',
                }
            } catch (error) {
                throw new GraphQLError('Failed to send message', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                })
            }
        },
    },
}
