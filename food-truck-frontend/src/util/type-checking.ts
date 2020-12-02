import {fold} from 'fp-ts/lib/Either';
import {pipe} from 'fp-ts/lib/function';
import {Errors, Type} from 'io-ts';
import {PathReporter} from 'io-ts/PathReporter'

export function parse<A, O, I>(metaClass: Type<A, O, I>, obj: any): A | null {
  let result: A | null = null;
  const decodeResult = metaClass.decode(obj);

  const onFail = (errors: Errors) => {
    console.log(PathReporter.report(decodeResult))
    throw ("Invalid " + metaClass.name + ": " + JSON.stringify(obj));
    result = null;
  }
  const onSuccess = (t: A) => {
    result = t;
  }

  pipe(metaClass.decode(obj), fold(onFail, onSuccess))
  return result;
}