export const changeNewTagsByEdit = (tagsBase: string[], tags: string[]): string[] => {
    tags.forEach(tag => {
        const index = tagsBase.indexOf(tag)
        if(index !== -1) {
            tagsBase.splice(index, 1)
        }
    })
    return tagsBase
}
