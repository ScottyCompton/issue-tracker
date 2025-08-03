'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface Project {
    id: string
    name: string
    description?: string
    createdAt: string
    updatedAt: string
}

interface ProjectContextType {
    selectedProjectId: string | null
    setSelectedProjectId: (projectId: string | null) => void
    selectedProject: Project | null
    setSelectedProject: (project: Project | null) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        null
    )
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    useEffect(() => {
        // Load selected project from localStorage on mount
        const savedProjectId = localStorage.getItem('selectedProjectId')
        if (savedProjectId) {
            setSelectedProjectId(savedProjectId)
        }
    }, [])

    useEffect(() => {
        // Save selected project to localStorage
        if (selectedProjectId) {
            localStorage.setItem('selectedProjectId', selectedProjectId)
        } else {
            localStorage.removeItem('selectedProjectId')
        }
    }, [selectedProjectId])

    return (
        <ProjectContext.Provider
            value={{
                selectedProjectId,
                setSelectedProjectId,
                selectedProject,
                setSelectedProject,
            }}
        >
            {children}
        </ProjectContext.Provider>
    )
}

export function useProject() {
    const context = useContext(ProjectContext)
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider')
    }
    return context
}
