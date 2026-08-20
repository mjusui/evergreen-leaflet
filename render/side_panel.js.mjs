import { main, } from '../bronze/debug/index.mjs';
import { html, } from '../bronze/templ/html/index.mjs';
import { script, } from '../bronze/templ/html/script/index.mjs';


const handle=await main(()=>{
console.log( html.join([
html`${script.wisdom}`,
html`${script.starray}`,
html`page: {
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
  });
}`,
], '\n').toString() );
}, import.meta.filename);
