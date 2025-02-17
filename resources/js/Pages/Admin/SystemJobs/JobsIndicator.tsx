import {useEffect, useState} from "react";
import {Link, usePage} from "@inertiajs/react";
import {Activity} from "lucide-react";

interface Props {
    initialCount: number;
}

const POLLING_INTERVAL = 3000;

const JobsIndicator = ({ initialCount }: Props) => {

    const [count, setCount] = useState(initialCount)
    const { flash } = usePage().props

    useEffect(() => {
        const checkCount = async () => {

            try {
                const response = await fetch('/admin/system-jobs/active-count')
                const data = await response.json()

                setCount(data.count)

            } catch (error) {
                console.error('Failed to fetch jobs count:', error)
            }
        }

        const interval = window.setInterval(checkCount, POLLING_INTERVAL)

        return () => {
            window.clearInterval(interval)
        }
    }, [])

    return (
        <Link
            href="/admin/system-jobs"
            className="relative inline-flex items-center hover:text-blue-600"
        >
            <Activity
                className={`h-5 w-5 ${count > 0 ? 'text-blue-600' : 'text-gray-400'}`}
            />
            {count > 0 && (
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs
                      rounded-full h-5 w-5 flex items-center justify-center">
                    {count}
                </div>
            )}
        </Link>
    )
};

export default JobsIndicator;
