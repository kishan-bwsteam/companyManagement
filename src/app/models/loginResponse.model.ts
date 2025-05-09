export default interface LoginReponse {
    token: string,
    userDetails: {
        username: string,
        userId: number,
        userTypeId: number,
        userTypeName: string,
        passKey: string
        saltKey: string
        saltKeyIV: string
        firstName: string,
        lastName: string,
        fullName: string,
        status: number,
        message: string,
        password: string
    }
}