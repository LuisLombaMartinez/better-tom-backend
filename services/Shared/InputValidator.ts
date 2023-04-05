import { Entry } from "./Model";


export class MissingFieldError extends Error {}

export class InvalidFieldError extends Error {}

export function validateEntry(arg: any) {
    if ((arg as Entry).player === undefined) {
        throw new MissingFieldError('player');
    }
    if ((arg as Entry).team === undefined) {
        throw new MissingFieldError('team');
    }
    if (typeof (arg as Entry).player !== 'string') {
        throw new InvalidFieldError('player');
    }
    if (typeof (arg as Entry).team !== 'string') {
        throw new InvalidFieldError('team');
    }
}