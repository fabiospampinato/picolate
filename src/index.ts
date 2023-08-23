
/* IMPORT */

import compile from './compile';
import parse from './parse';
import render from './render';
import validate from './validate';
import type {Options} from './types';

/* MAIN */

const Picolate = {
  compile,
  parse,
  render,
  validate
};

/* EXPORT */

export default Picolate;
export type {Options};
