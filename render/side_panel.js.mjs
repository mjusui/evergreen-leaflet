import { main, } from '../bronze/debug/index.mjs';
import { html, } from '../bronze/templ/html/index.mjs';
import { script, } from '../bronze/templ/html/script/index.mjs';


const handle=await main(()=>{
console.log( html.join([
  html`${script.wisdom}`,
  html`wisdom.write('template-top', 'display');`
], '').toString() );
}, import.meta.filename);
