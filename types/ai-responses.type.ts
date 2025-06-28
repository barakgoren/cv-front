export type ApplicantStructure = {
    personalInfo: {
        fullName: string;
        email?: string;
        phone?: string;
        currentCompany?: string;
        location?: string;
        experience?: string;
        skills?: string[];
        salaryExpectation?: string;
    };
    matchPrecentage: number;
    matchPercentageReason: string;
    matchLabel: string;
}

export type ApplicantsCompareResponse = {
    applicants: ApplicantStructure[];
}