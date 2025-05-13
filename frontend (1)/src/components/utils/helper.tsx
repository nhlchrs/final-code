export const getImageForExtension = (ext: string): string => {
    if (ext === '.csv') return '/images/csv.png';
    if (ext === '.xls' || ext === '.xlsx') return '/images/xls.png';
    return '/images/file.png';
  };
  
export const getIcon = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'csv') return '/images/csv.png';
  if (ext === 'xls' || ext === 'xlsx') return '/images/xls.png';
  return '/images/file.png';
};
