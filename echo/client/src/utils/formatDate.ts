const formatDate = (isoString: string): string => {
    const date: Date = new Date(isoString);
    const day: string = String(date.getDate()).padStart(2, '0');
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    const year: number = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export default formatDate;