export const getInputName = (
  categoryName: string,
  serviceName: string,
  comment?: boolean
) => `${categoryName}-${serviceName}${comment ? '-comment' : ''}`
