import firstPeriods from "./firstPeriods";
export default function calculatePeriodPass(period: number, difference_in_minutes: number, ease: number) {
    if (period < 1440) {
        //missing schema
        return firstPeriods(period) as number;
    }

    return difference_in_minutes * ease;

}