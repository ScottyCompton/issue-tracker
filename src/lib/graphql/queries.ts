import { gql } from '@apollo/client'

export const GET_ABOUT = gql`
    query GetAbout {
        about {
            id
            name
            title
            bio
            avatar
            location
            email
            phone
            website
        }
    }
`

export const GET_PROJECTS = gql`
    query GetProjects {
        projects {
            id
            title
            description
            image
            technologies
            githubUrl
            liveUrl
            featured
            createdAt
        }
    }
`

export const GET_FEATURED_PROJECTS = gql`
    query GetFeaturedProjects {
        featuredProjects {
            id
            title
            description
            image
            technologies
            githubUrl
            liveUrl
            featured
            createdAt
        }
    }
`

export const GET_PROJECT = gql`
    query GetProject($id: ID!) {
        project(id: $id) {
            id
            title
            description
            image
            technologies
            githubUrl
            liveUrl
            featured
            createdAt
        }
    }
`

export const GET_SKILLS = gql`
    query GetSkills {
        skills {
            id
            name
            category
            proficiency
            icon
        }
    }
`

export const GET_SKILLS_BY_CATEGORY = gql`
    query GetSkillsByCategory($category: SkillCategory!) {
        skillsByCategory(category: $category) {
            id
            name
            category
            proficiency
            icon
        }
    }
`

export const GET_EXPERIENCE = gql`
    query GetExperience {
        experience {
            id
            title
            company
            location
            startDate
            endDate
            current
            description
            technologies
        }
    }
`

export const GET_CURRENT_EXPERIENCE = gql`
    query GetCurrentExperience {
        currentExperience {
            id
            title
            company
            location
            startDate
            endDate
            current
            description
            technologies
        }
    }
`

export const GET_EDUCATION = gql`
    query GetEducation {
        education {
            id
            degree
            institution
            location
            startDate
            endDate
            current
            description
            gpa
        }
    }
`

export const GET_CONTACT = gql`
    query GetContact {
        contact {
            id
            type
            value
            icon
        }
    }
`
