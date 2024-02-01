// globals.d.ts
// declare namespace globalThis {
//     // eslint-disable-next-line no-var, vars-on-top
//     var app: any;
// } // declare function require( name: string );
declare module 'pg';
declare module 'hpp';
declare module 'xss-clean';
declare module 'dotenv-defaults';

declare module '*.pug' {
  const value: any;
  export = value;
}

declare module '*.html' {
  const value: any;
  export = value;
}
declare module '*.txt' {
  const value: any;
  export = value;
}
declare module '*.scss' {
  const value: any;
  export = value;
}
declare module '*.css' {
  const value: any;
  export = value;
}
declare module '*.svg' {
  const value: any;
  export = value;
}
declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.jpeg' {
  const value: any;
  export = value;
}

declare module '*.gif' {
  const value: any;
  export = value;
}

declare module '*.jpg' {
  const value: any;
  export = value;
}

declare module '*.json' {
  const value: any;
  export = value;
}

declare module '*.jpg';
declare module '*.json';
declare module '*.png';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
