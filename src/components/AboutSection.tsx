'use client'

import { GET_ABOUT } from '@/lib/graphql/queries'
import { useQuery } from '@apollo/client'

export function AboutSection() {
    const { loading, error, data } = useQuery(GET_ABOUT)

    if (loading) return <div className="p-4">Loading...</div>
    if (error)
        return <div className="p-4 text-red-500">Error: {error.message}</div>

    const about = data?.about

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4">{about.name}</h1>
            <h2 className="text-2xl text-gray-600 mb-4">{about.title}</h2>
            <p className="text-lg mb-6">{about.bio}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Contact</h3>
                    <p>Email: {about.email}</p>
                    {about.phone && <p>Phone: {about.phone}</p>}
                    {about.website && <p>Website: {about.website}</p>}
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Location</h3>
                    <p>{about.location}</p>
                </div>
            </div>
        </div>
    )
}
