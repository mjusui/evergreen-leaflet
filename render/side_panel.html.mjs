import { main, } from '../bronze/debug/index.mjs';
import { html, Success, } from '../bronze/templ/html/index.mjs';

const sccs=new Success()
  .reset('*', 'color: rgba(55,55,55,1.0)', 'font-family: sans-serif', 'font-size: 1rem')
  .classify('flex-col', 'display: flex', 'flex-direction: column', 'gap: 1rem')
  .classify('flex-row', 'display: flex', 'flex-direction: row', 'gap: 1rem', 'align-items: center')
  .classify('block', 'margin: 0.5rem', 'padding: 0.5rem', 'background-color: rgba(253,253,253,1.0)')
  .classify('border', 'border-style: solid', 'border-width: 1px',
     'border-color: rgba(55,55,55,1.0)', 'font-weight: bold' )
  .classify('shadow', 'box-shadow: 0 0 1rem 1rem rgba(55,55,55,0.2)')
  .classify('margin-auto', 'margin: auto')
  .classify('button', 'padding: 0.5rem' )
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
  .themify('.margin', 'margin-auto')
  .themify('.button-color1', 'button', 'color1')
  .themify('.modal', 'modal-hidden')
  .themify('.modal:not(:empty)', 'modal-display')

const handle=await main(()=>{
  const html_head=html.head({
    title: 'Evergreen Leaflet',
    styles: [
      sccs.html,
    ],
  });
  const html_script=html.scripts([
    { src: 'side_panel.js', },
  ]);
console.log( (html`<html>
  <head>${html_head}</head>
  <body>
    <main id='display'>
    </main>
    <section id='modal' class='modal'></section>

    <template id='template-top'>
      <header class='block-row'>
        <h1>Leaflets</h1>
        <div class='margin'></div>
        <button class='button-color1 open-modal-add-leaflet'>Add Leaflet</button>
      </header>
      <section class='block-col-shadow'>
      </section>
    </template>

    <template id='template-modal-add-leaflet'>
      <div class='block-col'>
         
      </div>
    </template>

    ${html_script}
  </body>
</html>`).toString() );
}, import.meta.filename);
