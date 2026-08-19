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
console.log( (html`<html>
  <head>${html_head}</head>
  <body>
    <main>
    </main>

    <template id='template-leaflets'>
      <header>
        <h1>Leaflets</h1>
      </header>
      <section>
      </section>
    </template>
  </body>
</html>`).toString() );
}, import.meta.filename);
