// Add to the top of your CHANGELOG.md
// Add a new version object to the versions array

// Define what our version object looks like
interface Version {
    major: number;    // For big changes (e.g., 2.0.0)
    minor: number;    // For new features (e.g., 1.1.0)
    patch: number;    // For bug fixes (e.g., 1.0.1)
    releaseDate: string;
    notes: string[];  // What changed in this version
}

export const versions: Version[] = [
    {
        major: 1,
        minor: 0,
        patch: 0,
        releaseDate: '2025-02-17',
        notes: [
            'Initial project setup',
            'Feature: Organization',
            'Feature: Organization/Users',
            'Feature: Postal Codes'
        ]
    },
];

// Helper functions
export const getCurrentVersion = (): Version => {
    return versions[versions.length - 1];
};

export const getVersionString = (): string => {
    const current = getCurrentVersion();
    return `${current.major}.${current.minor}.${current.patch}`;
};

export const getVersionHistory = () => versions;

// Get specific version
export const getVersion = (major: number, minor: number, patch: number): Version | undefined => {
    return versions.find(v =>
        v.major === major &&
        v.minor === minor &&
        v.patch === patch
    );
};
