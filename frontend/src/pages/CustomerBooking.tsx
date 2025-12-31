import { useNavigate } from 'react-router-dom';
import UserBooking from '../components/UserBooking';
import Navbar from '../components/Navbar';

export default function CustomerBooking() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">
      
      <Navbar />

      <main className="max-w-7xl mx-auto py-4 sm:py-6 flex-grow w-full">
        <UserBooking />
      </main>
      
      <footer id="contact-footer" className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Grills & Gather</h3>
              <p className="text-gray-300">Experience the finest dining with our delicious food and excellent service.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-white transition">Home</a></li>
                <li><a href="/about" className="text-gray-300 hover:text-white transition">About Us</a></li>
                <li><a 
                  href="#contact-footer" 
                  onClick={(e) => {
                    e.preventDefault();
                    const footerElement = document.getElementById('contact-footer');
                    if (footerElement) {
                      footerElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-gray-300 hover:text-white transition"
                >
                  Contact
                </a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-300">
               <li><a href="tel:9840923097"className='hover:text-blue-600' >📞 9840923097</a> </li> 
            
               <li><a href='tel:9848675285' className='hover:text-blue-600'>📞 9848675285 </a> </li> 
                <li>✉️ info@grillandgathering.com</li>
                <li>📍 Grills and Gather ,Balkot </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-lg font-bold mb-4">Find Us</h3>
            <div className="rounded-lg overflow-hidden border border-gray-300">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d403.7530625579317!2d85.3660333256802!3d27.664689598970888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1b093dec14f3%3A0x90b02fb7b0713ace!2sGrills%20and%20Gather!5e1!3m2!1sen!2snp!4v1766763639443!5m2!1sen!2snp" 
                width="100%" 
                height="300" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Grill & Gather Location Map"
              />
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Grills and Gather. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
