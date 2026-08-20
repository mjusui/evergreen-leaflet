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

  page.open=(...args)=>{
    wisdom.write(...args);
    loadGuides();
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

    if(onsubmit === 'add-item-guide'){
      const id=target.id.value;
      const title=target.title.value;
      const desc=target.desc.value || '';
      const star=Starray.getInst('store-guide');
      star.push({ id, title, desc, });
      loadGuides();
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
    if(onclick === 'open-modal-add-item-guide'){
      const time=new Date().getTime();
      const rand=Math.floor(Math.random() * 10**8);
      const id=(time + '-' + rand);
      page.open('modal', 'template-modal-add-item-guide', [ id, ]);
    }
    if(onclick === 'open-steps'){
      const { id, }=target.closest('[data-id]').dataset;
      const star=Starray.getInst('store-guide');
      const { title, desc, }=star.list().find(a => a.id === id);
      page.open('display', 'template-steps', [ id, title, desc, ]);
    }
    if(onclick === 'open-guides'){
      page.open('display', 'template-guides');
    }
  });
}
