import { main, } from '../bronze/debug/index.mjs';
import { html, Success, } from '../bronze/templ/html/index.mjs';

const sccs=new Success();

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

    <template id='template-top'>
      <header>
        <h1>Leaflets</h1>
      </header>
      <section>
      </section>
    </template>

    ${html_script}
  </body>
</html>`).toString() );
}, import.meta.filename);
