const { PrismaClient } = require('../app/generated/prisma')

const prisma = new PrismaClient()

const starterProjects = [
    {
        name: 'E-commerce Platform',
        description:
            'Online shopping platform with payment processing, inventory management, and user authentication. Features include product catalog, shopping cart, secure checkout, order tracking, and admin dashboard for inventory management.',
    },
    {
        name: 'Mobile App Development',
        description:
            'iOS and Android mobile application with push notifications, offline sync, and social features. Includes user authentication, real-time messaging, content sharing, and cross-platform compatibility.',
    },
    {
        name: 'Website Redesign',
        description:
            'Corporate website overhaul with new design system, content management, and SEO optimization. Features responsive design, improved navigation, content management system, and enhanced search engine visibility.',
    },
]

async function migrateProjects() {
    try {
        console.log('Starting project migration...')

        // Step 1: Create the three starter projects
        console.log('Creating starter projects...')
        const createdProjects = []

        for (const project of starterProjects) {
            const existingProject = await prisma.project.findFirst({
                where: { name: project.name },
            })

            if (existingProject) {
                console.log(
                    `Project "${project.name}" already exists, skipping...`
                )
                createdProjects.push(existingProject)
            } else {
                const newProject = await prisma.project.create({
                    data: {
                        name: project.name,
                        description: project.description,
                        updatedAt: new Date(),
                    },
                })
                console.log(
                    `Created project: ${newProject.name} (ID: ${newProject.id})`
                )
                createdProjects.push(newProject)
            }
        }

        if (createdProjects.length === 0) {
            console.log(
                'No projects were created. Migration may have already been run.'
            )
            return
        }

        // Step 2: Get all existing issues that don't have a project assigned
        console.log('Finding unassigned issues...')
        const unassignedIssues = await prisma.issue.findMany({
            where: {
                projectId: null,
            },
        })

        console.log(`Found ${unassignedIssues.length} unassigned issues`)

        if (unassignedIssues.length === 0) {
            console.log('All issues are already assigned to projects.')
            return
        }

        // Step 3: Randomly assign issues to projects
        console.log('Randomly assigning issues to projects...')
        let assignmentCount = 0

        for (const issue of unassignedIssues) {
            // Randomly select a project
            const randomProject =
                createdProjects[
                    Math.floor(Math.random() * createdProjects.length)
                ]

            await prisma.issue.update({
                where: { id: issue.id },
                data: { projectId: randomProject.id },
            })

            assignmentCount++
            console.log(
                `Assigned issue "${issue.title}" to project "${randomProject.name}"`
            )
        }

        // Step 4: Validate the distribution
        console.log('Validating data distribution...')
        const projectStats = await Promise.all(
            createdProjects.map(async (project) => {
                const issueCount = await prisma.issue.count({
                    where: { projectId: project.id },
                })
                return {
                    project: project.name,
                    issueCount,
                }
            })
        )

        console.log('\nProject Assignment Summary:')
        projectStats.forEach((stat) => {
            console.log(`- ${stat.project}: ${stat.issueCount} issues`)
        })

        const totalIssues = projectStats.reduce(
            (sum, stat) => sum + stat.issueCount,
            0
        )
        console.log(`\nTotal issues assigned: ${totalIssues}`)
        console.log(`Total issues processed: ${assignmentCount}`)

        if (totalIssues === assignmentCount) {
            console.log('✅ Migration completed successfully!')
        } else {
            console.log('⚠️  Warning: Issue count mismatch detected')
        }
    } catch (error) {
        console.error('Migration failed:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

// Run the migration if this script is executed directly
if (require.main === module) {
    migrateProjects()
        .then(() => {
            console.log('Migration script completed')
            process.exit(0)
        })
        .catch((error) => {
            console.error('Migration script failed:', error)
            process.exit(1)
        })
}

module.exports = { migrateProjects, starterProjects }
