const wisdom={};
wisdom: {
  const trigs=[];
  wisdom.addEventListener=(key, hndl)=>{
    trigs.push({ key, hndl, });
  };
  const fire=(key, opt)=>{
    trigs.forEach(trig =>{
      if( !(trig.key == key) ){
        return;
      }
      const { hndl, }=trig;
      hndl(opt);
    });
  };

  wisdom.render=(cmd='write', slot_id, temp_id, vals=[], update_id)=>{
    if(cmd === 'remove'){
      const remove_id=slot_id;
      const elem=document.getElementById(remove_id);
      elem.remove();
      fire('change', { element: elem, });
      return;
    }
    const slot=document.getElementById(slot_id);

    if(cmd === 'clear'){
      slot.innerHTML='';
      fire('change', { element: slot, slot, });
      return;
    }
    if(cmd === 'html'){
      const html=temp_id;
      slot.innerHTML=html;
      fire('change', { element: slot, slot, });
      return;
    }
    if(cmd === 'text'){
      const text=temp_id;
      slot.textContent=text;
      fire('change', { element: slot, slot, });
      return;
    }
    const temp=document.getElementById(temp_id);
    const node=temp.content.cloneNode(true);

    vals.forEach((val, idx)=>{
      const key='render' + (idx + 1);
      const elems=node.querySelectorAll('[data-' + key + ']');

      ([ ...elems, ]).forEach(elem =>{
        const prop=elem.dataset[key];

        if(typeof elem[prop] === 'undefined'){
          elem.setAttribute(prop, val);
          return;
        }
        elem[prop]=val;
      });
    });

    if(update_id){
      const same=document.getElementById(update_id);

      if(same){
        slot.replaceChild(node, same);
        fire('change', { element: slot, slot, temp });
        return;
      }
    }

    if(cmd === 'write'){
      slot.replaceChildren(node);
    }else
    if(cmd === 'append'){
      slot.append(node);
    }else
    if(cmd === 'prepend'){
      slot.prepend(node);
    }
    fire('change', { element: slot, slot, temp, });
  };
  wisdom.clear=(  ...args)=> wisdom.render('clear',   ...args);
  wisdom.remove=( ...args)=> wisdom.render('remove',  ...args);
  wisdom.write=(  ...args)=> wisdom.render('write',   ...args);
  wisdom.prepend=(...args)=> wisdom.render('prepend', ...args);
  wisdom.append=( ...args)=> wisdom.render('append',  ...args);
  wisdom.text=(   ...args)=> wisdom.render('text',    ...args);
  wisdom.html=(   ...args)=> wisdom.render('html',    ...args);
}
