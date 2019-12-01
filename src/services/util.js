export const parseNumberToMoney = (number) => {
    if (!number) return 0
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
export const openInNewTab = (url) => {
    var win = window.open(`https://${url}`, '_blank');
    win.focus();
}