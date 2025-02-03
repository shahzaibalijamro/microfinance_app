import Link from "next/link"

export default function Component() {
    return (
        <div className="flex items-center min-h-[85vh] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="mx-auto space-y-6 text-center">
                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tighter text-[#1e40af] sm:text-5xl transition-transform hover:scale-110">404</h1>
                    <p className="text-gray-500">Looks like you've ventured into the unknown digital realm.</p>
                </div>
                <Link
                    href="/"
                    className="inline-flex h-10 items-center rounded-md bg-[#1e40af] px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-[#3252bb] focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    prefetch={false}
                >
                    Return to website
                </Link>
            </div>
        </div>
    )
}