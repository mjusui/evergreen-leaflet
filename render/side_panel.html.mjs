import { main, } from '../bronze/debug/index.mjs';
import { html, Success, } from '../bronze/templ/html/index.mjs';

const scss=new Success()
  .reset('*', 'color: rgba(55,55,55,1.0)', 'font-family: sans-serif', 'font-size: 1rem')
  .classify('flex-col', 'display: flex', 'flex-direction: column', 'gap: 1rem')
  .classify('flex-row', 'display: flex', 'flex-direction: row', 'gap: 1rem', 'align-items: center')
  .classify('block', 'margin: 0.5rem', 'padding: 0.5rem', 'background-color: rgba(253,253,253,1.0)')
  // .classify('border', 'border-style: solid', 'border-width: 1px',
  //    'border-color: rgba(55,55,55,1.0)', 'font-weight: bold' )
  .classify('shadow', 'box-shadow: 0 0 1px 1px rgba(55,55,55,0.1)')
  .classify('margin-auto', 'margin: auto')
  .classify('center', 'margin-left: auto', 'margin-right: auto')
  .classify('middle', 'margin-top: auto', 'margin-bottom: auto')
  .classify('button', 'padding: 0.5rem', 'border-style: solid',
    'border-width: 0px', 'border-radius: 0.5rem', 'font-size: 0.8rem', 'font-weight: bold' )
  .classify('color1', 'background-color: rgba(31,181,115, 1.0)', 'color: rgba(253,253,253,1.0)' ) 
  .classify('modal-hidden', 'display: none')
  .classify('modal-display', 'display: block', 'position: fixed', 'top: 0',
    'height: 100vh', 'width: 100%', 'background-color: rgba(55,55,55,0.5)')
  .themify('.col', 'flex-col')
  .themify('.row', 'flex-row')
  .themify('.block-col', '.col', 'block')
  .themify('.block-row', '.row', 'block')
  .themify('.block-col-shadow', '.block-col', 'shadow')
  .themify('.block-row-shadow', '.block-row', 'shadow')
  .themify('.margin', 'center', 'middle')
  .themify('.button-color1', 'button', 'color1')
  .themify('.modal', 'modal-hidden')
  .themify('.modal:not(:empty)', 'modal-display')
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
    <section id='modal' class='modal'></section>

    <template id='template-top'>
      <header class='block-row'>
        <h1>ガイド一覧</h1>
        <div class='margin'></div>
        <button class='button-color1 open-modal-add-guide'>追加する</button>
      </header>
      <section id='item-guides' class='block-col-shadow load-item-guides'>
      </section>
    </template>

    <template id='template-item-guide'>
      <div class='block-col-shadow'>
        <h1 data-render1='textContent'></h1>
        <div data-render2='textContent'></div>
      </div>
    </template>

    <template id='template-modal-add-leaflet'>
      <div class='block-col'>
         
      </div>
    </template>

    ${html_script}
  </body>
</html>`).toString() );
}, import.meta.filename);
