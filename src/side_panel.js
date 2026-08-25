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
    const param={ key, items, };
    this.param=param;
  }
  list(){
    const { key, items, }=this.param;
    if(!items){
      const json=localStorage.getItem(key);
      this.param.items=JSON.parse(json) || [];
    }
    return this.param.items;
  }
  push(...args){
    const items=this.list();
    const ret=items.push(...args);
    this.save();
    return ret;
  }
  map(...args){
    const items=this.list();
    this.param.items=items.map(...args);
    this.save();
    return this.param.items;
  }
  filter(...args){
    const items=this.list();
    this.param.items=items.filter(...args);
    this.save();
    return this.param.items;
  }
  save(){
    const { key, }=this.param;
    const items=this.list();
    const json=JSON.stringify(items);
    localStorage.setItem(key, json);
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
      wisdom.clear(elem.id);

      items.forEach(item =>{
        const { id='', cmd='', args='', inst='', }=item;
        wisdom.append(elem.id, 'template-item-step',
          [ guideid, id, cmd, args, inst, ]);
      });
    });
  };

  page.open=(...args)=>{
    wisdom.write(...args);
    loadGuides();
    loadSteps();
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
      star.map(a =>{
        if(a.id === id){
          update++;
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
      const [ guideid, id, cmd, args, inst, ]=([ 'guideid', 'id', 'cmd', 'args', 'inst', ]).map(
        key => target[key].value
      );
      const star=Starray.getInst('store-step-' + guideid);

      let updated=0;
      star.map(a =>{
        if(a.id === id){
          updated++;
          return Object.assign(a, { cmd, args, inst, });
        }
        return a;
      });

      if(!updated){
        star.push({ id, cmd, args, inst, });
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
      const { id, }=target.closest('[data-id]').dataset;
      const star=Starray.getInst('store-guide');
      const { title, desc, }=star.list().find(a => a.id === id);
      page.open('display', 'template-steps', [ id, title, desc, ]);
    }
    if(onclick === 'open-modal-item-step'){
      const { guideid, id='', previd='', }=target.closest('[data-guideid]').dataset;
      const vals=[ guideid, id, ];

      if(id){
        const star=Starray.getInst('store-step-' + guideid);
        const { cmd, args, inst, }=star.list().find(a => a.id === id);
        vals.push(cmd, args, inst);
      }
      vals.push('', '', '');
      page.open('modal', 'template-modal-item-step', vals);
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
