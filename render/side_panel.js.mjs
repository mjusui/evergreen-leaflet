import { main, } from '../bronze/debug/index.mjs';
import { html, } from '../bronze/templ/html/index.mjs';
import { script, } from '../bronze/templ/html/script/index.mjs';


const handle=await main(()=>{
console.log( html.join([
html`${script.wisdom}`,
html`${script.starray}`,
html`page: {
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
      wisdom.clear(elem.id);

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
  page.open('guides');

  page.clear=(target='display')=>{
    wisdom.clear(target);
  };


  document.addEventListener('submit', ev =>{
    ev.preventDefault();
    console.log('submit:', ev.target);
    const { target, }=ev;

    if(target.classList.contains('add-item-guide') ){
      const title=target.title.value;
      const desc=target.desc.value || '';
      store.guide.push({ title, desc, });
      loadGuides();
      page.clear('modal');
    }
  });
  const body=document.getElementsByTagName('body')[0];

  body.addEventListener('click', ev =>{
    console.log('click:', ev.target);
    const { target, }=ev;

    if(target.classList.contains('modal') ){
      page.clear('modal');
    }
    if(target.classList.contains('open-modal-add-item-guide') ){
      page.open('modal-add-item-guide', 'modal');
    }
  });
}`,
], '\n').toString() );
}, import.meta.filename);
