import { main, } from '../bronze/debug/index.mjs';
import { html, Success, } from '../bronze/templ/html/index.mjs';

const sccs=new Success()
  .reset('*', 'color: rgba(55,55,55,1.0)', 'font-family: sans-serif', 'font-size: 1rem')
  .classify('flex-col', 'display: flex', 'flex-direction: column')
  .classify('flex-row', 'display: flex', 'flex-direction: row', 'align-items: center')
  .classify('block', 'margin: auto 0.5rem', 'padding: 0.5rem',
    'border-style: solid', 'border-width: 1px', 'border-color: rgba(55,55,55,1.0)' )
  .classify('button', 'padding: 0.2rem',
    'background-color: rgba(5,71,42, 1.0)', 'color: rgba(242,242,242,1.0)' ) 
  .classify('modal-hidden', 'display: none')
  .classify('modal-display', 'display: block', 'position: fixed', 'top: 0', 'height: 100vh', 'width: 100%')
  .themify('.col', 'flex-col')
  .themify('.row', 'flex-row')
  .themify('.block-col', 'block', 'flex-col')
  .themify('.block-row', 'block', 'flex-row')
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
    <section id='modal' class='modal'>
    </section>

    <template id='template-top'>
      <header class='block-row'>
        <h1>Leaflets</h1>
        <button class='open-modal-add-leaflet'>Add Leaflet</button>
      </header>
      <section class='col'>
      </section>
    </template>

    <template id='template-add-leaflet'>
      <div class='block'>
         
      </div>
    </template>

    ${html_script}
  </body>
</html>`).toString() );
}, import.meta.filename);
