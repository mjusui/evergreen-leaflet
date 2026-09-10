sandbox: {
  const t=(strs, ...vals)=>(
    strs.map( (str, i)=> [
      str, (typeof vals[i] === 'object' ? vals[i].text : vals[i]) || '',
    ]).flat(1).join('')
  );
  const render=(templ, ctxt)=>{
    const prox=new Proxy(ctxt, {
      has(){ return true; },
      get(targ, key){
        const val=targ[key];

        if(val === undefined){
          return '${' + String(key) + '}';
        }
        return Reflect.get(...arguments);
      },
    });

    const func=new Function('ctxt', 't', 'with(ctxt){ return (t`' + templ + '`); }' );
    return func(prox, t);
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
}
