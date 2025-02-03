import React from 'react'
import { Progress } from './ui/progress'

const Loader = ({ loadingVal }: { loadingVal: number }) => {
    return (
        <div className="max-w-[200px] h-[80vh] mx-auto px-4 justify-center items-center mt-4 flex">
            <Progress value={loadingVal} />
        </div>
    )
}

export default Loader