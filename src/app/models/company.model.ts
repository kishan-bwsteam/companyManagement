export interface Company {
    companyId?: number;
    loginUserID?: number;
    userID?: number;
    companyGuid?: string;
    franchiseID?: number; // Nullable in C#
    companyName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    stateId: number;
    state?: string;
    countryId: number;
    country?: string;
    zipCode: string;
    gstin: string;
    cin: string;
}
