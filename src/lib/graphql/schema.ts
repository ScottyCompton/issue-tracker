import { gql } from 'graphql-tag'

export const typeDefs = gql`
    type Project {
        id: ID!
        title: String!
        description: String!
        image: String
        technologies: [String!]!
        githubUrl: String
        liveUrl: String
        featured: Boolean!
        createdAt: String!
    }

    type Skill {
        id: ID!
        name: String!
        category: SkillCategory!
        proficiency: Proficiency!
        icon: String
    }

    type Experience {
        id: ID!
        title: String!
        company: String!
        location: String
        startDate: String!
        endDate: String
        current: Boolean!
        description: String!
        technologies: [String!]!
    }

    type Education {
        id: ID!
        degree: String!
        institution: String!
        location: String
        startDate: String!
        endDate: String
        current: Boolean!
        description: String
        gpa: Float
    }

    type Contact {
        id: ID!
        type: ContactType!
        value: String!
        icon: String
    }

    type About {
        id: ID!
        name: String!
        title: String!
        bio: String!
        avatar: String
        location: String
        email: String!
        phone: String
        website: String
    }

    enum SkillCategory {
        FRONTEND
        BACKEND
        DATABASE
        DEVOPS
        TOOLS
        LANGUAGES
    }

    enum Proficiency {
        BEGINNER
        INTERMEDIATE
        ADVANCED
        EXPERT
    }

    enum ContactType {
        EMAIL
        PHONE
        WEBSITE
        GITHUB
        LINKEDIN
        TWITTER
    }

    type Query {
        # Portfolio data
        about: About!
        projects: [Project!]!
        featuredProjects: [Project!]!
        project(id: ID!): Project

        # Skills
        skills: [Skill!]!
        skillsByCategory(category: SkillCategory!): [Skill!]!

        # Experience
        experience: [Experience!]!
        currentExperience: [Experience!]!

        # Education
        education: [Education!]!

        # Contact
        contact: [Contact!]!
    }

    type Mutation {
        # Contact form
        sendMessage(
            name: String!
            email: String!
            message: String!
        ): MessageResponse!
    }

    type MessageResponse {
        success: Boolean!
        message: String!
    }
`
