export const change_IdById = <T>(user: T): Omit<T, '_id'> & { id: string } | null => {
    if (user) {
        const { _id, password, ...otherInformation } = JSON.parse(JSON.stringify(user))
        return { id: _id, ...otherInformation }
    } else return null
}
