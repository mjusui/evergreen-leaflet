sandbox: {
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

    const func=new Function('ctxt', 'with(ctxt){ return (`' + templ + '`); }' );
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
}
