import Link from 'next/link'
import React from 'react'

const PageNotFound = () => {
    return (
        <div className="flex items-center min-h-[85vh] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="mx-auto space-y-6 text-center">
                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tighter text-[#0673be] sm:text-5xl transition-transform hover:scale-110">
                        404
                    </h1>
                    <p className="text-gray-500">Category not found!</p>
                </div>
                <Link
                    href="/"
                    className="inline-flex h-10 items-center rounded-md bg-[#0673be] px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-[#0673be] focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    prefetch={false}
                >
                    Return to Home
                </Link>
            </div>
        </div>
    )
}

export default PageNotFound