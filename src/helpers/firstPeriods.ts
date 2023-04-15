// Period lower than a day (1440)
const POSSIBLE_PERIODS: number[] = [2, 10, 30, 150, 640, 1280, 1440]
export default function firstPeriods(period: number) {
    for (const p of POSSIBLE_PERIODS) {
        if (period < p) {
            return p;
        }
    }
    return period;
}