import { main, } from '../bronze/debug/index.mjs';
import { html, } from '../bronze/templ/html/index.mjs';
import { script, } from '../bronze/templ/html/script/index.mjs';


const handle=await main(()=>{
console.log( html.join([
html`${script.wisdom}`,
html`${script.starray}`,
html`page: {
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
      const { id, }=elem.closest('[data-id]').dataset;
      const star=Starray.getInst('store-step-' + id);
      const items=star.list();

      if(items.length < 1){
        wisdom.text(elem.id, '手順がありません');
        return;
      }
      wisdom.clear(elem.id);

      items.forEach(item =>{
        const { id='', capt='', cmd='', args='', inst='', }=item;
        wisdom.append(elem.id, 'template-item-step',
          [ id, capt, cmd, args, inst, ]);
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
      const [ id, title, desc ]=([ 'id', 'title', 'desc', ]).map(
        key => target[key].value
      );
      const star=Starray.getInst('store-guide');
      star.push({ id, title, desc, });
      // loadGuides();
      page.clear('modal');
      page.open('display', 'template-steps', [ id, title, desc, ]);
      loadSteps();
    }
    if(onsubmit === 'add-item-step'){
      console.log(onsubmit, target);
      const [ id, cmd, args, inst, ]=([ 'id', 'cmd', 'args', 'inst', ]).map(
        key => target[key].value
      );
      const star=Starray.getInst('store-step-' + id);
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
      const { guideid, id='', cmd='', args='', inst='', }=target.dataset;
      page.open('modal', 'template-modal-item-step', [ guideid, id, cmd, args, inst, ]);
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
}`,
], '\n').toString() );
}, import.meta.filename);
