// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       // Padrão para desenvolvimento local
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '3001', // Verifique se esta é a porta correta do seu backend
//         pathname: '/**', // Permite qualquer caminho de imagem nesse domínio
//       },
//       // ADICIONE AQUI O DOMÍNIO DE PRODUÇÃO QUANDO FIZER O DEPLOY
//       {
//         protocol: 'https',
//         hostname: 'client-horti-fruti.vercel.app',
//         port: '', 
//         pathname: '/**',
//       },
//     ],
//   },
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // CUIDADO: As regras abaixo permitem imagens de QUALQUER LUGAR da internet.
      // Isso pode levar a vulnerabilidades de segurança e custos inesperados.
      {
        protocol: 'https',
        hostname: '**', // Permite qualquer hostname
      },
      {
        protocol: 'http',
        hostname: '**', // Permite qualquer hostname
      },
    ],
  },
};

module.exports = nextConfig;