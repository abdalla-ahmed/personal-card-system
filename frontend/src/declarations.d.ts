// This file is used to declare types for non-typescript files
// In this case, we are declaring that any file with a .json extension will be treated as a module
// This allows us to import the file in our code and use it as a module.
// This is useful for importing configuration files or data files.
//
// You can also enable it by adding the following to your tsconfig.json file:
// "resolveJsonModule": true
// This will allow you to import json files without the need for the declaration file.

declare module '*.json' {
  const value: any;
  export default value;
}



