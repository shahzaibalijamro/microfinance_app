import React from 'react'
import { Progress } from './ui/progress'

const Loader = ({ loadingVal }: { loadingVal: number }) => {
    return (
        <div className="max-w-[200px] w-full px-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Progress value={loadingVal} />
        </div>
    )
}

export default Loader