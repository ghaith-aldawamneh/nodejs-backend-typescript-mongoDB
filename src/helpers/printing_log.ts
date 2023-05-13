import { number } from "joi"
import { DebugLogger } from "util";

export const enum pr_methods {
  normal = 0,
  info = 1,
  debug = 2,
}


interface p_methods {
 normal:number ;
 info:number ;
 debug:number;
}
export default (string_g:string, print_method:pr_methods=pr_methods.normal)=>{
 if (print_method===pr_methods.normal){
  console.log(string_g)}
}