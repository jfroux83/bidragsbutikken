import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
    code: string | object;
    language?: string;
}

const CodeView = ({
    code,
    language = 'json'
}: Props) => {
    const [copied, setCopied] = useState(false);

    const formattedCode = typeof code === 'string'
        ? code
        : JSON.stringify(code, null, 2);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(formattedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative rounded-lg bg-gray-900 p-4">
            <div className="absolute right-2 top-2">
                <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white"
                >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
            </div>
            <pre className="text-sm text-gray-100 overflow-x-auto">
                <code>{formattedCode}</code>
            </pre>
        </div>
    );
}

export default CodeView;
