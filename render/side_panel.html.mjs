import { main, } from '../bronze/debug/index.mjs';
import { html, Success, } from '../bronze/templ/html/index.mjs';

const scss=new Success()
  .reset('*', 'color: rgba(55,55,55,1.0)', 'font-family: sans-serif', 'font-size: var(--font-size, 1rem)')
  .classify('flex-col', 'display: flex', 'flex-direction: column', 'gap: 1rem')
  .classify('flex-row', 'display: flex', 'flex-direction: row', 'gap: 1rem', 'align-items: center')
  .classify('block', 'margin: 0.5rem', 'padding: 0.5rem', 'background-color: rgba(253,253,253,1.0)')
  .classify('border', 'border-style: solid', 'border-width: 1px',
    'border-color: rgba(55,55,55,0.1)' )
  .classify('shadow', 'box-shadow: 0 0 1rem 1px rgba(55,55,55,0.1)')
  .classify('margin-auto', 'margin: auto')
  .classify('center', 'margin-left: auto', 'margin-right: auto')
  .classify('middle', 'margin-top: auto', 'margin-bottom: auto')
  .classify('button', 'padding: 0.5rem', 'border-radius: 0.5rem', 'font-weight: bold', '--font-size: 0.8rem' )
  .classify('button-back', html`content: "←"` )
  .classify('button-close', html`content: "✕"` )
  .classify('input', 'min-width: 80vw', 'font-weight: normal')
  .classify('textarea', 'min-height: 5.4rem', 'max-height: 30vh', 'resize: none')
  .classify('color1', 'background-color: rgba(31,181,115,1.0)',
    'border-color: rgba(31,181,115,1.0)', 'color: rgba(253,253,253,1.0)' ) 
  .classify('require', 'content: "*"', 'color: red')
  .classify('modal-hidden', 'display: none')
  .classify('modal-display', 'position: fixed', 'top: 0',
    'height: 100vh', 'width: 100%', 'background-color: rgba(55,55,55,0.5)')
  .themify('.col', 'flex-col')
  .themify('.row', 'flex-row')
  .themify('.block-col', '.col', 'block')
  .themify('.block-row', '.row', 'block')
  .themify('.block-col-shadow', '.block-col', 'shadow')
  .themify('.block-row-shadow', '.block-row', 'shadow')
  .themify('.margin', 'center', 'middle')
  .themify('.button-color1', 'border', 'button', 'color1')
  .themify('.button-back', 'button', 'button-back')
  .themify('.button-close', 'button', 'button-close')
  .themify('input', 'border', 'button', 'input')
  .themify('textarea', 'border', 'button', 'input', 'textarea')
  .themify('label.require::after', 'require')
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
    <main id='display'>
    </main>
    <section id='modal' class='modal' data-onclick='hide-modal'></section>

    <template id='template-guides'>
      <header class='block-row'>
        <h1>ガイド一覧</h1>
        <div class='margin'></div>
        <button class='button-color1' data-onclick='open-modal-add-item-guide'>追加する</button>
      </header>
      <section id='item-guides' class='block-col load-item-guides'>
      </section>
    </template>

    <template id='template-item-guide'>
      <div class='block-col-shadow'
        data-render1='data-id'  data-onclick='open-steps'>
        <h1 class='text-small' style='--font-size: 0.8rem'
          data-render2='textContent' data-onclick='open-steps'></h1>
        <div class='text-short' style='--font-size: 0.6rem'
          data-render3='textContent' data-onclick='open-steps'></div>
      </div>
    </template>

    <template id='template-modal-add-item-guide'>
      <form class='block-col' data-onsubmit='add-item-guide'>
        <input type='hidden' name='id' data-render1='value' required></input>

        <label class='require'>タイトル</label> 
        <input type='text' name='title' required></input>

        <label>説明</label> 
        <textarea name='desc' cols='5'></textarea>

        <button type='submit' class='button-color1'>追加</button>
      </form>
    </template>

    <template id='template-steps'>
      <header class='block-row'>
        <button class='button-back'></button>
        <h1 data-render2='textContent'></h1>
        <div class='margin' data-render3='textContent'></div>
        <button class='button-color1' data-onclick='open-modal-add-item-guide'>追加する</button>
      </header>
      <section id='item-steps' class='block-col load-item-steps' data-render1='data-id'>
      </section>
    </template>

    ${html_script}
  </body>
</html>`).toString() );
}, import.meta.filename);
