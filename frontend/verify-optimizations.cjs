#!/usr/bin/env node

/**
 * Script de Verificación de Optimizaciones
 * Valida que todas las optimizaciones se hayan aplicado correctamente
 */

const fs = require('fs');
const path = require('path');

const checks = [
  {
    name: '✓ vite.config.js - Build optimization',
    file: 'vite.config.js',
    contains: ['minify', 'terserOptions', 'manualChunks']
  },
  {
    name: '✓ App.jsx - Lazy loading',
    file: 'src/App.jsx',
    contains: ['lazy(', 'Suspense']
  },
  {
    name: '✓ useJQueryPlugins.js - Modularización',
    file: 'src/hooks/useJQueryPlugins.js',
    contains: ['setupHeaderSticky', 'setupDropdownMenu', 'setupSyncCarousels']
  },
  {
    name: '✓ Home.jsx - Componentes React',
    file: 'src/pages/Home.jsx',
    contains: ['ServicesSection', 'GallerySection', 'TestimonialsSyncSection']
  },
  {
    name: '✓ GallerySection - React.memo',
    file: 'src/components/sections/GallerySection.jsx',
    contains: ['memo(GallerySection)']
  },
  {
    name: '✓ optimization.js - Utilidades',
    file: 'src/utils/optimization.js',
    contains: ['debounce', 'throttle', 'memoize']
  }
];

console.log('\n📊 VERIFICACIÓN DE OPTIMIZACIONES\n');
console.log('=' .repeat(50));

let passed = 0;
let failed = 0;

checks.forEach(check => {
  const filePath = path.join(__dirname, check.file);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const allFound = check.contains.every(str => content.includes(str));
    
    if (allFound) {
      console.log(check.name);
      passed++;
    } else {
      console.log(`✗ ${check.name} - FALTA contenido`);
      failed++;
    }
  } else {
    console.log(`✗ ${check.name} - ARCHIVO NO ENCONTRADO`);
    failed++;
  }
});

console.log('=' .repeat(50));
console.log(`\n✅ Pasados: ${passed}/${checks.length}`);
console.log(`❌ Fallidos: ${failed}/${checks.length}\n`);

if (failed === 0) {
  console.log('🎉 ¡Todas las optimizaciones se aplicaron correctamente!\n');
  process.exit(0);
} else {
  console.log('⚠️  Algunas optimizaciones no se verificaron correctamente.\n');
  process.exit(1);
}
