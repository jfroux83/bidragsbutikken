import React, {useState} from 'react';
// import {getCurrentVersion, getVersionString, getVersionHistory} from "@/Config/version";

const VendorFooter = () => {
    // const [showHistory, setShowHistory] = useState(false);
    // const currentVersion = getCurrentVersion();
    // const allVersions = getVersionHistory();

    return (
        <footer className="bg-white border-t border-gray-200 py-4">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Bidragsbutikken. All rights reserved.
                    </div>

                    <div className="relative">
                        {/*<button*/}
                        {/*    onClick={() => setShowHistory(!showHistory)}*/}
                        {/*    className="text-sm text-gray-500 hover:text-gray-700"*/}
                        {/*>*/}
                        {/*    Version {getVersionString()}*/}
                        {/*</button>*/}

                        {/* Version History Popup */}
                        {/*{showHistory && (*/}
                        {/*    <div className="absolute bottom-8 right-0 w-96 bg-white rounded-lg shadow-lg border p-4">*/}
                        {/*        <h3 className="font-medium text-lg mb-4">Version History</h3>*/}
                        {/*        <div className="space-y-4 max-h-96 overflow-y-auto">*/}
                        {/*            {allVersions.slice().reverse().map((version, index) => (*/}
                        {/*                <div*/}
                        {/*                    key={index}*/}
                        {/*                    className={`p-3 rounded-md ${*/}
                        {/*                        version === currentVersion*/}
                        {/*                            ? 'bg-blue-50 border border-blue-100'*/}
                        {/*                            : 'bg-gray-50'*/}
                        {/*                    }`}*/}
                        {/*                >*/}
                        {/*                    <div className="flex justify-between items-center mb-2">*/}
                        {/*                        <span className="font-medium">*/}
                        {/*                            {version.major}.{version.minor}.{version.patch}*/}
                        {/*                        </span>*/}
                        {/*                        <span className="text-sm text-gray-500">*/}
                        {/*                            {version.releaseDate}*/}
                        {/*                        </span>*/}
                        {/*                    </div>*/}
                        {/*                    <ul className="text-sm space-y-1">*/}
                        {/*                        {version.notes.map((note, noteIndex) => (*/}
                        {/*                            <li key={noteIndex} className="text-gray-600">*/}
                        {/*                                • {note}*/}
                        {/*                            </li>*/}
                        {/*                        ))}*/}
                        {/*                    </ul>*/}
                        {/*                </div>*/}
                        {/*            ))}*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default VendorFooter;
