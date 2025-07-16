'use client'

// import Image from 'next/image'


export default function Home() {
  // const session = await getServerSession(authOptions)

  const handleClick = async () => {
    const _ = (await import('lodash')).default
    const users = [
      {name: 'John', age: 20},
      {name: 'Fred', age: 21},
      {name: 'Angus', age: 22},
      {name: 'Marie', age: 23},
      {name: 'Dexter', age: 24},
      {name: 'Spock', age: 25},
      {name: 'Cammie', age: 26},
      {name: 'Diana', age: 27},
      {name: 'Ethan', age: 28},
      {name: 'Fiona', age: 29},
      {name: 'George', age: 30},
      {name: 'Hannah', age: 31},
      {name: 'Ian', age: 32},
    ]

    const sortedUsers = _.sortBy(users, 'name')
    console.log(sortedUsers)
  }

  return (
    <main>
      {/* <h1 className="text-4xl font-bold text-blue-600 mb-4">Hello {session && <span>{session.user!.name}</span>}</h1>
      <Link href="/users" className="btn btn-primary">Users</Link>
      <div className="divider"></div>
      <ProductCard /> */}
      {/* <Image src="https://cardosystems.com/cdn/shop/articles/Custom-Bobber-Motorbike.jpg?v=1704207864" fill style={{ objectFit: 'contain' }} alt="2012 Road Glide" /> */}
      <button onClick={handleClick}>Show</button>
    </main>
  )
}
