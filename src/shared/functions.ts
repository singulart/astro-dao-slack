import logger from './Logger';

export const pErr = (err: Error) => {
    if (err) {
        logger.err(err);
    }
};

export const getRandomInt = () => {
    return Math.floor(Math.random() * 1_000_000_000_000);
};

export const intervalToSeconds = (intervalsNumber: number, interval: string): string => {
    if(interval.endsWith('days')) {
        return (intervalsNumber * 60 * 60 * 24 * 10**9).toString()
    } else if(interval.endsWith('weeks')) {
        return (intervalsNumber * 7 * 60 * 60 * 24 * 10**9).toString()
    } else if(interval.endsWith('months')) {
        return (intervalsNumber * 30 * 60 * 60 * 24 * 10**9).toString()
    } else {
        return '';
    }
};