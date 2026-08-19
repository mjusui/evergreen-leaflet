import { main, } from '../bronze/debug/index.mjs';
import { html, } from '../bronze/templ/html/index.mjs';
import { script, } from '../bronze/templ/html/script/index.mjs';


const handle=await main(()=>{
console.log( html.join([
html`${script.wisdom}`,
html`
  const page={};
page: {
  const body=document.getElementsByTagName('body')[0];
  body.addEventListener('submit', ev =>{
    ev.preventDefault();
  });
  body.addEventListener('click', ev =>{
    const { target, }=ev;

    if(target.classList.contains('modal') ){
      page.clear('modal');
    }
    if(target.classList.contains('open-modal-add-guide') ){
      page.open('modal-add-guide', 'modal');
    }
  });

  page.open=(suffix, target='display')=>{
    wisdom.write(target, 'template-' + suffix);

    let guides=null;
    ([ ...document.getElementsByClassName('load-item-guides'), ]).forEach(elem =>{
      console.log('load-item-guides:', elem);

      if(!guides){
        const json=localStorage.getItem('json-guides');
        guides=JSON.parse(json) || [];
      }
      if(guides.length < 1){
        wisdom.text(elem.id, 'ガイドがありません');
        return;
      }
      guides.forEach(guide =>{
        const { title, desc, }=guide;
        wisdom.append(elem.id, 'template-item-guide', [ title, desc, ]);
      });
    });
  };
  page.open('top');

  page.clear=(target='display')=>{
    wisdom.clear(target);
  };

}`,
], '').toString() );
}, import.meta.filename);
