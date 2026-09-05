import { main, } from '../bronze/debug/index.mjs';
import { html, Success, } from '../bronze/templ/html/index.mjs';

const scss=new Success()
  .reset('*', 'color: rgba(55,55,55,1.0)', 'font-family: sans-serif',
     'font-size: var(--font-size, 1rem)', 'opacity: var(--opacity)' )
  .classify('flex-col', 'display: flex', 'flex-direction: column', 'gap: 0.5rem')
  .classify('flex-row', 'display: flex', 'flex-direction: row', 'gap: 0.5rem', 'align-items: center')
  .classify('block', 'margin: 0.5rem', 'padding: 0.5rem', 'background-color: rgba(253,253,253,1.0)')
  .classify('border', 'border-style: solid', 'border-width: 1px',
    'border-color: rgba(55,55,55,0.1)' )
  .classify('bar', 'margin-top: 0.5rem', 'margin-bottom: calc(0.5rem - 1px)',
    'border-bottom-style: solid', 'border-bottom-width: 1px', 'border-bottom-color: rgba(55,55,55,0.1)', 'height: 0' )
  .classify('relative', 'position: relative').classify('absolute', 'position: absolute')
  .classify('absolute-top', 'top: 0').classify('absolute-bottom', 'bottom: 0')
  .classify('absolute-left', 'left: 0').classify('absolute-right', 'right: 0')
  .classify('shadow', 'box-shadow: 0 0 1rem 1px rgba(55,55,55,0.1)')
  .classify('margin-auto', 'margin: auto')
  .classify('center', 'margin-left: auto', 'margin-right: auto')
  .classify('middle', 'margin-top: auto', 'margin-bottom: auto')
  .classify('merge-top', 'margin-bottom: 0', 'border-bottom-width: 0')
  .classify('merge-middle', 'margin-top: 0', 'border-top-width: 0', 'margin-bottom: 0', 'border-bottom-width: 0')
  .classify('merge-bottom', 'margin-top: 0', 'border-top-width: 0')
  .classify('button', 'padding: 0.2rem', 'border-radius: 0.2rem', 'font-weight: bold', '--font-size: 0.8rem', 'min-width: calc(1lh + 0.4rem)' )
  //.classify('button-sign', '--font-size: 1rem')
  .classify('input', 'min-width: 80vw', 'font-weight: normal')
  .classify('textarea', 'min-height: calc(0.4rem + var(--cols) * 1rem)', 'max-height: 30vh', 'resize: none')
  .classify('color1', 'background-color: rgba(31,181,115,1.0)',
    'border-color: rgba(31,181,115,1.0)', 'color: rgba(253,253,253,1.0)' ) 
  .classify('color2', 'background-color: rgba(45,115,210,1.0)',
    'border-color: rgba(45,115,210,1.0)', 'color: rgba(253,253,253,1.0)' ) 
  .classify('color3', 'background-color: rgba(220,70,70,1.0)',
    'border-color: rgba(220,70,70,1.0)', 'color: rgba(253,253,253,1.0)' ) 
  .classify('color9', 'background-color: rgba(220,220,220,1.0)',
    'border-color: rgba(220,220,220,1.0)', 'color: rgba(55,55,55,1.0)' ) 
  .classify('required', html`content: '*'`, 'color: red')
  .classify('modal-hidden', 'display: none')
  .classify('modal-display', 'position: fixed', 'top: 0',
    'height: 100vh', 'width: 100%', 'background-color: rgba(55,55,55,0.5)')
  .themify('.col', 'flex-col')
  .themify('.row', 'flex-row')
  .themify('.block-col', '.col', 'block')
  .themify('.block-row', '.row', 'block')
  .themify('.block-col-shadow', '.block-col', 'shadow')
  .themify('.block-row-shadow', '.block-row', 'shadow')
  .themify('.bar', 'bar', 'flex-row')
  .themify('.margin', 'center', 'middle')
  .themify('button', 'button')
  .themify('.button-color1', 'border', 'button', 'color1')
  .themify('.button-color2', 'border', 'button', 'color2')
  .themify('.button-color3', 'border', 'button', 'color3')
  .themify('.button-color9', 'border', 'button', 'color9')
  .themify('.button-sign-color1', 'border', 'button', 'color1')
  .themify('input', 'border', 'button', 'input')
  .themify('textarea', 'border', 'button', 'input', 'textarea')
  .themify('label', 'button', 'input')
  .themify('label.required::after', 'required')
  .themify('.merge-top', 'border', 'merge-top')
  .themify('.merge-middle', 'border', 'merge-middle')
  .themify('.merge-bottom', 'border', 'merge-bottom')
  .themify('.modal', 'modal-hidden')
  .themify('.modal:not(:empty)', 'modal-display', 'flex-col')
  .themify(html`.modal:not(:empty) > *`, 'center', 'middle')
const html_css=scss.html;

const handle=await main(()=>{
  const html_head=html.head({
    title: 'Evergreen Leaflet',
    metas: [
      { charset: 'UTF-8', },
    ],
    styles: [
      html_css,
    ],
  });
  const html_script=html.scripts([
    { src: 'side_panel.js', },
  ]);
console.log( (html`<!DOCTYOE html>
<html>
  <head>${html_head}</head>
  <body>
    <main id='display' class='col'>
    </main>
    <section id='modal' class='modal' data-onclick='hide-modal'></section>

    <template id='template-guides'>
      <header class='block-row'>
        <h1>ガイド一覧</h1>
        <div class='margin'></div>
        <button class='button-color1' style='--font-size: 1rem'
          data-onclick='open-modal-item-guide'>+</button>
      </header>
      <div class='bar'></div>
      <section id='item-guides' class='block-col load-item-guides'>
      </section>
    </template>
    <template id='template-item-guide'>
      <div class='block-row-shadow'>
        <div class='col' data-render1='data-guideid' data-onclick='open-steps'>
          <h1 style='--font-size: 0.8rem'
            data-render2='textContent' data-onclick='open-steps'></h1>
          <div style='--font-size: 0.6rem'
            data-render3='textContent' data-onclick='open-steps'></div>
        </div>
        <div class='margin' data-render1='data-guideid' data-onclick='open-steps'></div>
        <button class='button-color2' data-render1='data-id'
          data-render2='data-title' data-render3='data-desc'
          data-onclick='open-modal-item-guide'>✎</button>

        <button class='button-color3' data-render1='data-id'
          data-render2='data-title' data-render3='data-desc'
          data-delete='true' data-onclick='open-modal-item-guide'>-</button>
      </div>
    </template>

    <template id='template-modal-item-guide'>
      <form class='block-col' data-onsubmit='upsert-item-guide'>
        <h1 data-render4='textContent'></h1>
        <input type='hidden' name='id' data-render1='value' required></input>

        <label for='input-title' class='required'>タイトル</label> 
        <input id='input-title' type='text' name='title' data-render2='value' required></input>

        <label for='textarea-desc'>説明</label> 
        <textarea id='textarea-desc' style='--cols: 5'
          name='desc' data-render3='value'></textarea>

        <button type='submit'  data-render5='class'
          data-render6='textContent' data-render7='data-delete'></button>
      </form>
    </template>

    <template id='template-steps'>
      <section class='row'>
        <button style='--font-size: 1rem' data-onclick='open-guides'>←</button>
      </section>
      <header class='block-col'>
        <div class='row'>
          <h1 data-render2='textContent'></h1>
          <div class='margin'></div>
          <button class='button-color1' style='--font-size: 1rem'
            data-render1='data-guideid' data-onclick='open-runs'>${ '>' }</button>
        </div>
        <div style='--font-size: 0.8rem' data-render3='textContent'></div>
      </header>
      <div class='bar'></div>
      <section id='item-steps' class='block-col load-item-steps' data-render1='data-guideid'>
      </section>
    </template>
    <template id='template-item-step-top'>
      <div class='bar'>
        <div class='margin'></div>
        <button class='button-color9' style='--font-size: 1rem'
          data-render1='data-guideid'
          data-onclick='open-modal-item-step'>+</button>
      </div>
    </template>
    <template id='template-item-step'>
      <div class='block-row-shadow' data-render1='data-guideid' data-render2='data-id'>
        <div class='col'>
          <h1 style='--font-size: 0.8rem' data-render3='textContent'></h1>
          <div class='row'>
            <div style='--font-size: 0.6rem'>操作説明: </div>
            <div style='--font-size: 0.6rem' data-render4='textContent'></div>
          </div>
          <div class='row'>
            <div style='--font-size: 0.6rem'>取得する値: </div>
            <div style='--font-size: 0.6rem' data-render5='textContent'></div>
          </div>
          <div class='row'>
            <div style='--font-size: 0.6rem'>生成するテキスト: </div>
            <div style='--font-size: 0.6rem' data-render6='textContent'></div>
          </div>
        </div>
        <div class='margin'></div>
        <button class='button-color2' data-onclick='open-modal-item-step'>✎</button>
      </div>
      <div class='bar'>
        <div class='margin'></div>
        <button class='button-color9' style='--font-size: 1rem'
          data-render1='data-guideid' data-render2='data-previd'
          data-onclick='open-modal-item-step'>+</button>
      </div>
    </template>

    <template id='template-modal-item-step'>
      <form class='block-col' data-onsubmit='upsert-item-step'>
        <input type='hidden' name='guideid' data-render1='value' required></input>
        <input type='hidden' name='id' data-render2='value' required></input>
        <input type='hidden' name='previd' data-render3='value' required></input>


        <label for='textarea-url'>ページURL</label> 
        <textarea id='textarea-url' style='--cols: 2'
          name='url' data-render4='value' cols='2'></textarea>

        <label for='textarea-inst'>操作説明</label> 
        <textarea id='textarea-inst' style='--cols: 5'
          name='inst' data-render5='value'></textarea>

        <label for='textarea-keys'>取得する値(カンマ区切り)</label> 
        <textarea id='textarea-keys' style='--cols: 2'
          name='keys' data-render6='value' cols='2'></textarea>

        <label for='textarea-templ'>生成するテキスト</label> 
        <textarea id='textarea-templ' style='--cols: 5'
          name='templ' data-render7='value' cols='5'></textarea>

        <button type='submit' class='button-color1'>保存</button>
      </form>
    </template>


    <template id='template-runs'>
      <section class='row'>
        <button style='--font-size: 1rem'
          data-render1='data-guideid'  data-onclick='open-steps'>←</button>
        <div class='margin'></div>
      </section>
      <header class='block-col'>
        <div class='row'>
          <h1 data-render3='textContent'></h1>
          <div class='margin'></div>
        </div>
        <div style='--font-size: 0.8rem' data-render4='textContent'></div>
      </header>
      <div class='bar'></div>

      <section id='item-runs' class='load-item-runs' data-render1='data-guideid'
        data-render2='data-stepid'>
      </section>
    </template>
    <template id='template-item-run'>
      <div class='block-col-shadow' data-render9='style'
        data-render1='data-guideid' data-render2='data-stepid'
        data-onclick='open-runs'>
        <div class='row'>
          <div style='--font-size: 0.8rem'>(
            <span data-render6='textContent' data-onclick='open-runs'></span>${ ' / '
           }<span data-render7='textContent' data-onclick='open-runs'></span>
          )</div>

          <h1 style='--font-size: 0.8rem' data-render11='textContent'
            data-onclick='open-runs'></h1>
        </div>
        <pre style='--font-size: 0.8rem' data-render12='textContent'
          data-render1='data-guideid' data-render2='data-stepid' data-onclick='open-runs'></pre>

        <div class='col load-item-run-inputs' data-render1='data-guideid'
          data-render2='data-stepid' data-onclick='open-runs' data-type='input'></div>

        <div class='col load-item-run-outputs' data-render1='data-guideid'
          data-render2='data-stepid' data-onclick='open-runs' data-type='output'></div>

        <button class='button-color1' data-render1='data-guideid'
          data-render3='data-stepid' data-render8='textContent'
          data-render10='disabled' data-onclick='open-runs'></button>
      </div>
    </template>
    <template id='template-item-run-input'>
      <div class='col'>
        <label class='merge-top' data-render3='textContent' data-render4='for'></label> 
        <textarea class='merge-bottom' style='--cols: 2'
          data-render1='data-guideid' data-render2='data-stepid'
          data-render3='name' data-render4='id' data-render5='value' data-onchange='update-run-input'
          placeholder='値を貼り付けてください' cols='2'></textarea>
      </div>
    </template>
    <template id='template-item-run-output'>
      <div class='col'>
        <label data-render3='textContent' data-render4='for'></label> 
        <textarea style='--cols: 5'
          data-render1='data-guideid' data-render2='data-stepid'
          data-render4='id' data-render5='value' data-onclick='copy-run-output'
          cols='5' readonly></textarea>
      </div>
    </template>


    <iframe id='sandbox' src='sandbox.html' hidden></iframe>
    ${html_script}
  </body>
</html>`).toString() );
}, import.meta.filename);
