export function convertHours(hoursStart: string) {
    const [hours, minutes] = hoursStart.split(':').map(Number)

    const minutesAmount = (hours * 60) + minutes;

    return minutesAmount;
}