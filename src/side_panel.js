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
  constructor(key){
    const items=null;
    const param={ key, items, };
    this.param=param;
  }
  list(){
    const { key, items, }=this.param;
    if(!items){
      const json=localStorage.getItem(key);
      this.items=JSON.parse(json);
    }
    return this.items;
  }
  push(...args){
    const { items, }=this.param;
    const ret=items.push(...args);
    this.save();
    return ret;
  }
  filter(...args){
    const { items, }=this.param;
    this.items=items.filter(...args);
    this.save();
    return this.items;
  }
  save(){
    const { key, items, }=this;
    const json=JSON.stringify(items);
    localStorage.setItem(key, json);
  }
}
page: {
  const page={};

  const store={};
  store.guide=new Starray('store-guides');

  const loadGuides=()=>{
    ([ ...document.getElementsByClassName('load-item-guides'), ]).forEach(elem =>{
      console.log('load-item-guides:', elem);
      const items=store.guide.list();

      if(items.length < 1){
        wisdom.text(elem.id, 'ガイドがありません');
        return;
      }
      items.forEach(item =>{
        const { title, desc, }=item;
        wisdom.append(elem.id, 'template-item-guide', [ title, desc, ]);
      });
    });
  };

  page.open=(suffix, target='display')=>{
    wisdom.write(target, 'template-' + suffix);
    loadGuides();
  };
  page.open('top');

  page.clear=(target='display')=>{
    wisdom.clear(target);
  };


  const body=document.getElementsByTagName('body')[0];
  body.addEventListener('submit', ev =>{
    ev.preventDefault();
  });
  body.addEventListener('click', ev =>{
    const { target, }=ev;

    if(target.classList.contains('modal') ){
      page.clear('modal');
    }
    if(target.classList.contains('open-modal-add-item-guide') ){
      page.open('modal-add-item-guide', 'modal');
    }
    if(target.classList.contains('add-item-guide') ){
      const form=target.parentNode;
      const title=form.title.value;
      const desc=form.desc.value || '';
      store.guide.push({ title, desc, });
      loadGuides();
    }
  });


}
