import { main, } from '../bronze/debug/index.mjs';
import { html, } from '../bronze/templ/html/index.mjs';
import { script, } from '../bronze/templ/html/script/index.mjs';


const handle=await main(()=>{
console.log( html.join([
html`${script.wisdom}`,
html`${script.starray}`,
html`${script.Funnel}`,
html`${script.wrap}`,
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
        const { id='', url='', inst='', keys='', templ='', }=item;
        wisdom.append(elem.id, 'template-item-step',
          [ guideid, id, url, inst, keys, templ, ]);
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
        const done=0 < nextidx
          ? '次へ' : '完了' ;

        const active=(id === stepid);
        const style=active
          ? '--opacity: 1.0' : '--opacity: 0.6' ;
        const disabled=id === stepid
          ? '' : 'disabled' ;

        wisdom.append(elem.id, 'template-item-run', [
          guideid, id, nextid, title, desc,
          (idx + 1), items.length,  done, style, disabled,
          url, inst, ]);

        if(active){
          emitRun(item);
        }
      });
    });
    loadRunInputs();
    loadRunOutputs();
  };
  loadRunInputs=()=>{
    ([ ...document.getElementsByClassName('load-item-run-inputs'), ]).forEach(async elem =>{
      const { guideid, stepid, }=elem.dataset;
      elem.id=('slot-inputs-' + stepid);

      // const guide=Starray.getInst('store-guide');
      const step=Starray.getInst('store-step-' + guideid);
      const { keys, templ, }=step.list().find(a => a.id === stepid);

      const run=Starray.getInst('store-run-' + guideid);
      const { inputs, outputs, }=run.list()[0];

      wisdom.clear(elem.id);
      const template_name='template-item-run-input';

      keys.split(',').forEach(str =>{
        const key=str.trim();
        const textareaid='textarea-' + key;

        const value=inputs[key] || '';

        wisdom.append(elem.id, template_name, [
          guideid, stepid, key, textareaid, value, ]);
      });
    });
  };
  loadRunOutputs=()=>{
    ([ ...document.getElementsByClassName('load-item-run-outputs'), ]).forEach(async elem =>{
      const { guideid, stepid, }=elem.dataset;
      elem.id=('slot-outputs-' + stepid);

      // const guide=Starray.getInst('store-guide');
      const step=Starray.getInst('store-step-' + guideid);
      const { keys, templ, }=step.list().find(a => a.id === stepid);

      const run=Starray.getInst('store-run-' + guideid);
      const { inputs, outputs, }=run.list()[0];

      wisdom.clear(elem.id);
      const template_name='template-item-run-output';

      if(templ){
        const labeltext='生成されたテキスト';
        const textareaid='textarea-output-' + stepid;

        const { err, result: text=templ, }=await wrap.postMessage(
          { cmd: 'render', templ, ctxt: inputs, },
          '*', document.getElementById('sandbox').contentWindow );

        if(err){
          console.error(err);
        }

        wisdom.append(elem.id, template_name, [
          guideid, stepid, labeltext, textareaid, text, ]);
      }
    });
  };


  const funnRun=new Funnel({ lim: 1, });
  const emitRun=async (item)=>(
    await funnRun.pour(async item =>{
      const { url, }=item;
      const [ tab ]=await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      await chrome.tabs.update(tab.id, { url, });
    }, item)
  );

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
      const [ guideid, id, previd, url, inst, keys, templ, ]=([
        'guideid', 'id', 'previd', 'url', 'inst', 'keys', 'templ', ]).map(
        key => target[key].value
      );
      const star=Starray.getInst('store-step-' + guideid);

      let updated=0;
      star.flatMap(a =>{
        if(a.id === previd){
          updated++;
          return [ a, { id, url, inst, keys, templ, }, ];
        }
        if(a.id === id){
          updated++;
          return Object.assign(a, { url, inst, keys, templ, });
        }
        return a;
      });

      if(updated < 1){
        star.unshift({ id, url, inst, keys, templ, });
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
        const { url='', inst='', keys='', templ='', }=star.list().find(a => a.id === id);
        vals.push(guideid, id, previd, url, inst, keys, templ);
      }else{
        vals.push(guideid, gen.id(), previd, '', '', '', '');
      }
      page.open('modal', 'template-modal-item-step', vals);
    }
    if(onclick === 'open-runs'){
      const { guideid, stepid='', }=target.closest('[data-guideid]').dataset;

      const guide=Starray.getInst('store-guide');
      const { title , desc, }=guide.list().find(a => a.id === guideid);

      const run=Starray.getInst('store-run-' + guideid);
      run.push({ inputs: {}, outputs: [], });
      run.flatMap( (item, idx)=> 0 < idx ? [] : item);

      page.open('display', 'template-runs',
        [ guideid, stepid, title, desc, ]);
    }
  });

  body.addEventListener('change', ev =>{
    const { target, }=ev;
    const { onchange, }=target.dataset;

    if(onchange === 'update-run-input'){
      const { guideid, }=target.dataset;
      const { name, value, }=target;

      const run=Starray.getInst('store-run-' + guideid);
      run.flatMap(item =>{
        const { inputs, }=item;
        inputs[name]=value || undefined;
        return item;
      }); 

      loadRunOutputs();
    }
  });
}`,
], '\n').toString() );
}, import.meta.filename);
