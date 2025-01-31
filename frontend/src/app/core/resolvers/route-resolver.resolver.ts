import type { ResolveFn } from '@angular/router';

export const RouteResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
