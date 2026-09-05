sandbox: {
  const render=(templ, ctxt)=>{
    const prox=new Proxy(ctxt, {
      get(targ, key){
        const val=targ[key];

        if(val === undefined){
          return '${key}';
        }
        return Reflect.get(...arguments);
      },
    });

    const func=new Function('ctxt', 'with(ctxt){ return (`' + templ + '`); }' );
    return func(prox);
  };

  window.addEventListener("message", ev => {
    console.log('sandbox.message:', ev);
  try {
    const { cmd, } = ev.data;
    let result=null;

    if(cmd === 'render'){
      const { templ, ctxt, }=ev.data;
      result=render(templ, ctxt);
    }else{
      throw new Error('command not found');
    }
    ev.source.postMessage({ result, }, '*');
  }catch(err){
    ev.source.postMessage({ err, }, '*');
  } });
  console.log('sandbox: init');
}
