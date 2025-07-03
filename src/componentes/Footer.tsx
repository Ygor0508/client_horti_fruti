import Link from 'next/link';
// Instale react-icons para os ícones: npm install react-icons
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-[#377d4c] text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        
        {/* Coluna 1: Logo e Descrição */}
        <div>
          <h2 className="text-2xl font-bold mb-3">FreshMarket</h2>
          <p className="text-gray-200 mb-4">
            Conectando você aos melhores produtores locais. Qualidade e frescor garantidos.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-gray-300"><FaFacebookF size={20} /></Link>
            <Link href="#" className="hover:text-gray-300"><FaInstagram size={20} /></Link>
            <Link href="#" className="hover:text-gray-300"><FaWhatsapp size={20} /></Link>
          </div>
        </div>

        {/* Coluna 2: Contato */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contato</h3>
          <ul className="space-y-2 text-gray-200">
            <li className="flex items-center">
              <FaPhoneAlt className="mr-3" /> (11) 99999-9999
            </li>
            <li className="flex items-center">
              <FaEnvelope className="mr-3" /> contato@freshmarket.com
            </li>
            <li className="flex items-center">
              <FaMapMarkerAlt className="mr-3" /> Pelotas, RS
            </li>
          </ul>
        </div>

        {/* Coluna 3: Horário de Funcionamento */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Horário de Funcionamento</h3>
          <ul className="space-y-1 text-gray-200">
            <li>Segunda a Sexta: 7h às 19h</li>
            <li>Sábado: 7h às 17h</li>
            <li>Domingo: 8h às 14h</li>
          </ul>
        </div>

      </div>
      <div className="text-center text-gray-400 mt-8 border-t border-gray-600 pt-4">
        <p>&copy; {new Date().getFullYear()} FreshMarket. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}