import { main, } from '../bronze/debug/index.mjs';
import { html, } from '../bronze/templ/html/index.mjs';


const handle=await main(()=>{
console.log( html.join([
html`sandbox: {
  const render=(templ, ctxt)=>{
    const sigs=[ '{{', '}}', ];

    let cnt=0;
    let src=templ;
    let dst='';
    while(true){
console.log('src,dst:');
console.log(src);
console.log(dst);

      if(!src) break;
      const idx=cnt;
      cnt++;

      const sig=sigs[idx];
      const strs=src.split(sig);
      src=strs.slice(1).join(sig);

      let str=strs[0];
      if(idx % 2){
        const evaluate=new Function('ctxt',
          'with(ctxt){'
        + '  return (' + str + ');'
        + '}'
        );

        try {
          let val=evaluate(ctxt);
console.log('val:', val);

          if(val === 'object'){
            val=val.text;
          }
          if(val === undefined){
            throw new Error('evaluate to undefined');
          }
          str=val;
        }catch(err){
          str='{{' + str + '}}'
        }
      }
      dst+=str;
    }
    return dst;
  };
  const render2=(templ, ctxt)=>{
    const prox=new Proxy(ctxt, {
      has(){ return true; },
      get(targ, key){
        const val=targ[key];

        if(val === undefined){
          return '\${' + String(key) + '}';
        }
        return Reflect.get(...arguments);
      },
    });

    const func=new Function('ctxt', ([
      'with(ctxt){',
      '  const t=(strs, ...vals)=> strs.map((str, i)=>[',
      '    str, (typeof vals[i] === "object" && vals[i].text || vals[i] || ""),',
      '  ]).flat(1).join("");',
      '  return (t\`' + templ + '\`);',
      '}', ]).join('\\n')
    );
    return func(prox);
  };

  window.addEventListener("message", ev => {
    console.log('sandbox.message:', ev);
    const { msgid, cmd, } = ev.data;
    try {
      let result=null;

      if(cmd === 'render'){
        const { templ, ctxt, }=ev.data;
        result=render(templ, ctxt);
      }else{
        throw new Error('command not found');
      }
      ev.source.postMessage({ msgid, result, }, '*');
    }catch(err){
      ev.source.postMessage({ msgid, err, }, '*');
    }
  });
  console.log('sandbox: init');
}`,
], '\n').toString() );
}, import.meta.filename);



