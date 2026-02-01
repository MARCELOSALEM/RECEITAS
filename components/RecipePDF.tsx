
import { Recipe } from "../types";

export const printRecipe = (recipe: Recipe, imageUrl: string | null) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>${recipe.titulo}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
        body { font-family: 'Inter', sans-serif; padding: 0; margin: 0; color: #1a1a1a; line-height: 1.5; }
        .container { padding: 40px; max-width: 800px; margin: 0 auto; }
        header { text-align: center; margin-bottom: 30px; }
        h1 { font-family: 'Playfair Display', serif; font-size: 42px; color: #c2410c; margin: 0 0 10px 0; }
        .recipe-img { width: 100%; height: 500px; object-fit: cover; border-radius: 24px; margin-bottom: 30px; }
        .meta-box { display: flex; justify-content: space-around; margin-bottom: 40px; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 20px 0; }
        .meta-item { text-align: center; }
        .meta-label { font-size: 11px; text-transform: uppercase; color: #737373; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px; }
        .meta-value { font-size: 16px; font-weight: 600; color: #1a1a1a; }
        .content-grid { display: grid; grid-template-columns: 1fr; gap: 40px; }
        h2 { font-family: 'Playfair Display', serif; font-size: 28px; color: #262626; border-bottom: 3px solid #fdba74; padding-bottom: 8px; margin-bottom: 24px; }
        .ingredients-list { list-style: none; padding: 0; columns: 2; column-gap: 40px; }
        .ingredients-list li { padding: 8px 0; border-bottom: 1px solid #f5f5f5; font-size: 14px; break-inside: avoid; }
        .ingredients-list li:before { content: "•"; color: #f97316; font-weight: bold; margin-right: 12px; }
        .step { margin-bottom: 24px; display: flex; gap: 20px; align-items: flex-start; }
        .step-number { background: #fff7ed; color: #c2410c; min-width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; }
        .step-text { font-size: 15px; flex: 1; }
        footer { margin-top: 60px; border-top: 1px solid #eee; padding-top: 24px; text-align: center; font-size: 12px; color: #a3a3a3; font-style: italic; }
        @media print {
          body { padding: 0; }
          .container { width: 100%; padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>${recipe.titulo}</h1>
        </header>
        
        ${imageUrl ? `<img src="${imageUrl}" class="recipe-img" />` : ''}

        <div class="meta-box">
          <div class="meta-item">
            <div class="meta-label">Tempo</div>
            <div class="meta-value">${recipe.tempo}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Porções</div>
            <div class="meta-value">${recipe.porcoes}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Dificuldade</div>
            <div class="meta-value">${recipe.dificuldade}</div>
          </div>
        </div>

        <div class="content-grid">
          <section>
            <h2>Ingredientes</h2>
            <ul class="ingredients-list">
              ${recipe.ingredientes.map(i => `<li>${i}</li>`).join('')}
            </ul>
          </section>

          <section>
            <h2>Modo de Preparo</h2>
            ${recipe.instrucoes.map((step, idx) => `
              <div class="step">
                <div class="step-number">${idx + 1}</div>
                <div class="step-text">${step}</div>
              </div>
            `).join('')}
          </section>
        </div>

        <footer>
          Chef Digital AI - Sua inspiração gastronômica movida a inteligência artificial.
        </footer>
      </div>
      <script>
        window.onload = function() {
          setTimeout(() => {
            window.print();
            window.onafterprint = function() { window.close(); };
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
