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
    {
        major: 1,
        minor: 1,
        patch: 0,
        releaseDate: '2025-03-03',
        notes: [
            'Feature: Admin -> Audit Logs',
            'Feature: Admin -> Vendors & Vendor user registration',
            'Feature: Admin -> Organization vendors',
            'Feature: Organization -> Customer registration',
            'Feature: Vendor -> Customer registration',
            'Change: Admin -> Postal codes',
            'Change: Admin -> Authentication logic'
        ]
    },
    {
        major: 1,
        minor: 2,
        patch: 0,
        releaseDate: '2025-04-29',
        notes: [
            'Feature: Vendor -> Product Categories',
            'Feature: Vendor -> Product Tags',
            'Feature: Vendor -> Product Attributes',
            'Feature: Vendor -> Products',
            'Feature: Vendor -> Product Variations',
            'Feature: Admin -> Product Categories (global view)',
            'Feature: Admin -> Product Tags (global view)',
            'Change: Add unique email check when registering users (admin, organization, vendor, customer)',
            'Change: Add email sync to default user when changing email address (organization, vendor, customer)'
        ]
    },
    {
        major: 1,
        minor: 3,
        patch: 0,
        releaseDate: '2025-05-19',
        notes: [
            'Feature: Vendor -> Product Catalogs',
            'Change: Vendors - data structure',
            'Change: Vendors - Products data structure',
            'Change: Admin -> Organizations & Organization -> products',
            'Feature: Customer -> Dashboard -> Products'
        ]
    }
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
