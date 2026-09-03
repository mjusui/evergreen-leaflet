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
const Starray=class Starray {
  static insts={};
  static getInst(key){
    const inst=this.insts[key] || new this(key);
    this.insts[key]=inst;
    return inst;
  }
  constructor(key){
    const items=null;
    this.param={ key, items, };
  }
  list(){
    const { key, items, }=this.param;
    if(!items){
      const json=localStorage.getItem(key);
      this.param.items=JSON.parse(json) || [];
    }
    return this.param.items;
  }
  save(){
    const { key, }=this.param;
    const items=this.list();
    const json=JSON.stringify(items);
    localStorage.setItem(key, json);
  }
  mutate(hndl){
    const ret=hndl(this.list() );
    this.save();
    return ret;
  }
  replace(hndl){
    const items=hndl(this.list() );
    this.param.items=items;
    this.save();
    return items;
  }
  push(...args){
    return this.mutate(items => items.push(...args) );
  }
  unshift(...args){
    return this.mutate(items => items.unshift(...args) );
  }
  flatMap(...args){
    return this.replace(items => items.flatMap(...args) );
  }
}
page: {
  const page={};

  
  const gen={};
  gen.id=()=>{
    const time=new Date().getTime();
    const rand=Math.floor(Math.random() * 10**8);
    return (time + '-' + rand);
  };

  const loadGuides=()=>{
    ([ ...document.getElementsByClassName('load-item-guides'), ]).forEach(elem =>{
      console.log('load-item-guides:', elem);
      const star=Starray.getInst('store-guide');
      const items=star.list();

      if(items.length < 1){
        wisdom.text(elem.id, 'ガイドがありません');
        return;
      }
      wisdom.clear(elem.id);

      items.forEach(item =>{
        const { id, title, desc, }=item;
        wisdom.append(elem.id, 'template-item-guide', [ id, title, desc, ]);
      });
    });
  };
  const loadSteps=()=>{
    ([ ...document.getElementsByClassName('load-item-steps'), ]).forEach(elem =>{
      console.log('load-item-steps:', elem);
      const { guideid, }=elem.closest('[data-guideid]').dataset;
      const star=Starray.getInst('store-step-' + guideid);
      const items=star.list();

      if(items.length < 1){
        wisdom.text(elem.id, '手順がありません');
        return;
      }
      // wisdom.clear(elem.id);
      wisdom.write(elem.id, 'template-item-step-top', [ guideid, ]);

      items.forEach(item =>{
        const { id='', url='', keys='', inst='', }=item;
        wisdom.append(elem.id, 'template-item-step',
          [ guideid, id, url, keys, inst, ]);
      });
    });
  };
  const loadRuns=()=>{
    ([ ...document.getElementsByClassName('load-item-runs'), ]).forEach(elem =>{
      const { guideid, }=elem.dataset;

      const guide=Starray.getInst('store-guide');
      const { title , desc, }=guide.list().find(a => a.id === guideid);

      const step=Starray.getInst('store-step-' + guideid);
      const items=step.list();

      const stepid=(elem.dataset.stepid || items[0].id);

      wisdom.clear(elem.id);

      items.forEach((item, idx)=>{
        const { id, url, keys, inst, }=item;

        const nextidx=(idx + 1) % items.length;
        const { id: nextid, }=items[nextidx];
        const reset=!nextidx;
        const done=0 < nextidx
          ? '次へ' : '完了' ;

        const style=id === stepid
          ? '--opacity: 1.0' : '--opacity: 0.6' ;
        const disabled=id === stepid
          ? '' : 'disabled' ;

        wisdom.append(elem.id, 'template-item-run', [
          guideid, id, nextid, title, desc,
          (idx + 1), items.length, reset, done, style,
          disabled, url, keys, inst, ]);
      });
    });
  };

  page.open=(...args)=>{
    wisdom.write(...args);
    loadGuides();
    loadSteps();
    loadRuns();
  };
  page.open('display', 'template-guides');

  page.clear=(...args)=>{
    wisdom.clear(...args);
  };


  document.addEventListener('submit', ev =>{
    ev.preventDefault();
    console.log('submit:', ev.target);
    const { target, }=ev;
    const { onsubmit, }=target.dataset;

    if(onsubmit === 'upsert-item-guide'){
      const [ id, title, desc ]=([ 'id', 'title', 'desc', ]).map(
        key => target[key].value
      );
      const star=Starray.getInst('store-guide');

      let updated=0;
      star.flatMap(a =>{
        if(a.id === id){
          updated++;
          return Object.assign(a, { title, desc, });
        }
        return a;
      });

      if(updated < 1){
        star.push({ id, title, desc, });
        page.open('display', 'template-steps', [ id, title, desc, ]);
        loadSteps();
      }else{
        loadGuides();
      }
      page.clear('modal');
    }
    if(onsubmit === 'upsert-item-step'){
      console.log(onsubmit, target);
      const [ guideid, id, previd, url, keys, inst, ]=([
        'guideid', 'id', 'previd', 'url', 'keys', 'inst', ]).map(
        key => target[key].value
      );
      const star=Starray.getInst('store-step-' + guideid);

      let updated=0;
      star.flatMap(a =>{
        if(a.id === previd){
          updated++;
          return [ a, { id, url, keys, inst, }, ];
        }
        if(a.id === id){
          updated++;
          return Object.assign(a, { url, keys, inst, });
        }
        return a;
      });

      if(updated < 1){
        star.unshift({ id, url, keys, inst, });
      }
      loadSteps();
      page.clear('modal');
    }
  });
  const body=document.getElementsByTagName('body')[0];

  body.addEventListener('click', ev =>{
    console.log('click:', ev.target);
    const { target, }=ev;
    const { onclick, }=target.dataset;

    if(onclick === 'hide-modal'){
      page.clear('modal');
    }
    if(onclick === 'open-guides'){
      page.open('display', 'template-guides');
    }
    if(onclick === 'open-modal-item-guide'){
      let { id=gen.id(), title='', desc='', }=target.dataset;
      page.open('modal', 'template-modal-item-guide', [ id, title, desc, ]);
    }
    if(onclick === 'open-steps'){
      const { guideid, }=target.closest('[data-guideid]').dataset;
      const star=Starray.getInst('store-guide');
      const { title, desc, }=star.list().find(a => a.id === guideid);
      page.open('display', 'template-steps', [ guideid, title, desc, ]);
    }
    if(onclick === 'open-modal-item-step'){
      const { guideid, id='', previd='', }=target.closest('[data-guideid]').dataset;
      const vals=[];

      if(id){
        const star=Starray.getInst('store-step-' + guideid);
        const { url, keys, inst, }=star.list().find(a => a.id === id);
        vals.push(guideid, id, previd, url, keys, inst);
      }else{
        vals.push(guideid, gen.id(), previd, '', '', '');
      }
      page.open('modal', 'template-modal-item-step', vals);
    }
    if(onclick === 'open-runs'){
      const { guideid, stepid='', }=target.closest('[data-stepid]').dataset;
      const reset=(target.dataset.reset === 'true');

      const guide=Starray.getInst('store-guide');
      const { title , desc, }=guide.list().find(a => a.id === guideid);

      if(reset){
        const run=Starray.getInst('store-run-' + guideid)
        const init={
          inputs: {},
          outputs: [],
        };
        run.unshift(init);
        run.flatMap((item, idx)=> 0 < idx ? [] : item);
      }

      page.open('display', 'template-runs',
        [ guideid, stepid, title, desc, ]);
    }
  });

  body.addEventListener('change', ev =>{
    const { target, }=ev;
    const { onchange, }=target.dataset;

    if(onchange === 'set-args-placeholder'){
      const option=target.selectedOptions[0];
      const { placeholder='', args=false, }=option.dataset;

      const form=target.parentNode;
      form.args.placeholder=placeholder;
      form.args.required=args;
    }
  });
}
